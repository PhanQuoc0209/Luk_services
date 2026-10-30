import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { confirmPaymentSchema } from '@/lib/validation';
import { logAudit } from '@/lib/audit';
import { createNotification } from '@/lib/notifications';
import { formatVND } from '@/lib/vietqr';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    const body = await req.json();
    const parsed = confirmPaymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.format() }, { status: 400 });
    }

    const { paymentId, confirmed, adminNotes } = parsed.data;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Đơn hàng không tồn tại' }, { status: 404 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ success: false, error: 'Bản ghi thanh toán không tồn tại' }, { status: 404 });
    }

    const newPaymentStatus = confirmed ? 'CONFIRMED' : 'REJECTED';

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        paymentStatus: newPaymentStatus,
        confirmedAt: confirmed ? new Date() : null,
        confirmedByUserId: confirmed ? admin.id : null,
        adminNotes: adminNotes || null,
      },
    });

    // Update order status if payment confirmed
    let newOrderStatus = order.status;
    if (confirmed) {
      newOrderStatus = 'PAYMENT_CONFIRMED';
      await prisma.order.update({
        where: { id: order.id },
        data: { status: newOrderStatus },
      });
    }

    // Audit Log
    await logAudit({
      orderId: order.id,
      entityType: 'PAYMENT',
      entityId: payment.id,
      action: confirmed ? 'CONFIRM_PAYMENT_MANUAL' : 'REJECT_PAYMENT',
      actorId: admin.id,
      actorRole: 'ADMIN',
      details: {
        paymentId: payment.id,
        amount: payment.amount,
        paymentType: payment.paymentType,
        confirmed,
        adminNotes,
        orderCode: order.orderCode,
      },
    });

    // Notify Customer
    if (confirmed) {
      await createNotification({
        userId: order.userId,
        guestEmail: order.guestEmail,
        type: 'PAYMENT_CONFIRMED',
        title: `Đã xác nhận thanh toán đơn #${order.orderCode} (${formatVND(payment.amount)})`,
        message: `Admin đã đối soát tài khoản và xác nhận nhận đủ khoản thanh toán ${formatVND(
          payment.amount
        )}. Đơn hàng đang được bắt tay vào thực hiện ngay!`,
        linkUrl: `/orders/${order.orderCode}`,
      });
    }

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      orderStatus: newOrderStatus,
    });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN_ADMIN_ONLY' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Yêu cầu quyền Quản trị viên (Admin).' }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
