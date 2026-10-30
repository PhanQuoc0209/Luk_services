import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { orderStatusSchema } from '@/lib/validation';
import { logAudit } from '@/lib/audit';
import { createNotification } from '@/lib/notifications';
import { ORDER_STATUS_CONFIG } from '@/components/orders/OrderStatusProgress';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    const body = await req.json();
    const parsed = orderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.format() }, { status: 400 });
    }

    const { status, notes } = parsed.data;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Đơn hàng không tồn tại' }, { status: 404 });
    }

    const prevStatus = order.status;

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });

    // Audit Log
    await logAudit({
      orderId: order.id,
      entityType: 'ORDER',
      entityId: order.orderCode,
      action: 'UPDATE_STATUS',
      actorId: admin.id,
      actorRole: 'ADMIN',
      details: {
        from: prevStatus,
        to: status,
        notes,
      },
    });

    // Notify Customer
    const statusLabel = ORDER_STATUS_CONFIG[status]?.label || status;
    await createNotification({
      userId: order.userId,
      guestEmail: order.guestEmail,
      type: status === 'COMPLETED' ? 'ORDER_COMPLETED' : 'ORDER_RECEIVED',
      title: `Cập nhật tiến độ đơn #${order.orderCode}: ${statusLabel}`,
      message: notes || `Đơn hàng của bạn đã chuyển sang trạng thái "${statusLabel}".`,
      linkUrl: `/orders/${order.orderCode}`,
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN_ADMIN_ONLY' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Yêu cầu quyền Quản trị viên (Admin).' }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
