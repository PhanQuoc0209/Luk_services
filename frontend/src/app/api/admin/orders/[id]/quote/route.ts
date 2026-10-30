import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { createQuoteSchema } from '@/lib/validation';
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
    const parsed = createQuoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.format() }, { status: 400 });
    }

    const { totalPrice, depositAmount, confirmedDeadline, paymentNotes } = parsed.data;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Đơn hàng không tồn tại' }, { status: 404 });
    }

    // Create Quote
    const quote = await prisma.quote.create({
      data: {
        orderId: order.id,
        totalPrice,
        depositAmount,
        confirmedDeadline: new Date(confirmedDeadline),
        paymentNotes: paymentNotes || null,
        status: 'SENT',
        createdByAdminId: admin.id,
      },
    });

    // Update order with snapshotted prices and status QUOTED
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'QUOTED',
        quotedPrice: totalPrice,
        depositRequired: depositAmount > 0 ? depositAmount : null,
      },
    });

    // Audit Log
    await logAudit({
      orderId: order.id,
      entityType: 'QUOTE',
      entityId: quote.id,
      action: 'QUOTE_ISSUED',
      actorId: admin.id,
      actorRole: 'ADMIN',
      details: {
        totalPrice,
        depositAmount,
        confirmedDeadline,
        paymentNotes,
      },
    });

    // Notify Customer
    await createNotification({
      userId: order.userId,
      guestEmail: order.guestEmail,
      type: 'QUOTE_ISSUED',
      title: `Báo giá chính thức cho đơn #${order.orderCode}: ${formatVND(totalPrice)}`,
      message: `Admin đã hoàn tất kiểm tra hồ sơ và gửi báo giá chính thức: ${formatVND(totalPrice)}${
        depositAmount > 0 ? ` (Hỗ trợ đặt cọc: ${formatVND(depositAmount)})` : ''
      }. Thời hạn hoàn thiện: ${new Date(confirmedDeadline).toLocaleDateString('vi-VN')}. Quét VietQR để bắt đầu thực hiện.`,
      linkUrl: `/orders/${order.orderCode}`,
    });

    return NextResponse.json({ success: true, quote, order: updatedOrder });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN_ADMIN_ONLY' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Yêu cầu quyền Quản trị viên (Admin).' }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
