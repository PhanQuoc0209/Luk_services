import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { submitPaymentProofSchema } from '@/lib/validation';
import { createNotification } from '@/lib/notifications';
import { logAudit } from '@/lib/audit';

interface RouteParams {
  params: Promise<{ orderCode: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { orderCode } = await params;
    const user = await getCurrentUser();

    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: { quotes: { orderBy: { createdAt: 'desc' } } },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Đơn hàng không tồn tại' }, { status: 404 });
    }

    const latestQuote = order.quotes[0];
    if (!latestQuote) {
      return NextResponse.json(
        { success: false, error: 'Đơn hàng chưa có báo giá từ Admin, chưa thể thanh toán.' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = submitPaymentProofSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.format() }, { status: 400 });
    }

    const bankSetting = await prisma.bankSetting.findUnique({
      where: { id: 'default' },
    });

    const transferContent = `${bankSetting?.transferNotePrefix || 'LUK'} ${order.orderCode}`;

    // Create Payment Record with PENDING_CONFIRMATION status
    // NOTE: Does NOT mark order as PAYMENT_CONFIRMED. Admin must manually verify!
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: parsed.data.amount,
        paymentType: parsed.data.paymentType,
        paymentStatus: 'PENDING_CONFIRMATION',
        bankName: bankSetting?.bankName || 'MB Bank',
        accountNumber: bankSetting?.accountNumber || '0988888888',
        accountHolder: bankSetting?.accountHolder || 'LUK SERVICES',
        transferContent,
        proofFileName: parsed.data.proofFileName || null,
        proofStoragePath: parsed.data.proofStoragePath || null,
        proofNotes: parsed.data.proofNotes || null,
      },
    });

    // Update order status to AWAITING_PAYMENT if was QUOTED
    if (order.status === 'QUOTED') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'AWAITING_PAYMENT' },
      });
    }

    // Audit Log
    await logAudit({
      orderId: order.id,
      entityType: 'PAYMENT',
      entityId: payment.id,
      action: 'PAYMENT_PROOF_SUBMITTED',
      actorId: user?.id || null,
      actorRole: 'CUSTOMER',
      details: {
        amount: parsed.data.amount,
        paymentType: parsed.data.paymentType,
        proofNotes: parsed.data.proofNotes,
      },
    });

    // Notify Admin
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (adminUser) {
      await createNotification({
        userId: adminUser.id,
        type: 'PAYMENT_REQUIRED',
        title: `Thông báo chuyển khoản mới: Đơn ${order.orderCode}`,
        message: `Khách hàng ${order.guestName} đã thông báo chuyển khoản ${parsed.data.amount.toLocaleString('vi-VN')}₫. Vui lòng kiểm tra tài khoản thực tế và bấm xác nhận thủ công.`,
        linkUrl: `/admin/orders/${order.id}`,
      });
    }

    return NextResponse.json({
      success: true,
      payment,
      message: 'Đã gửi thông báo chuyển khoản thành công. Admin sẽ kiểm tra giao dịch thực tế và xác nhận.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
