import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { submitFeedbackSchema } from '@/lib/validation';
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
      include: { drafts: { orderBy: { versionNumber: 'desc' } } },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Đơn hàng không tồn tại' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = submitFeedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.format() }, { status: 400 });
    }

    const { draftVersionId, content, revisionRequested } = parsed.data;

    // Create Feedback record
    const feedback = await prisma.feedback.create({
      data: {
        orderId: order.id,
        draftVersionId: draftVersionId || null,
        authorRole: user?.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER',
        authorName: user?.name || order.guestName,
        content,
        revisionRequested,
      },
    });

    // If customer requested revision, update order status to REVISING
    if (revisionRequested && order.status !== 'COMPLETED') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'REVISING' },
      });
    } else if (order.status === 'DRAFT_DELIVERED') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'AWAITING_FEEDBACK' },
      });
    }

    // Audit Log
    await logAudit({
      orderId: order.id,
      entityType: 'FEEDBACK',
      entityId: feedback.id,
      action: revisionRequested ? 'REVISION_REQUESTED' : 'FEEDBACK_SUBMITTED',
      actorId: user?.id || null,
      actorRole: user?.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER',
      details: {
        draftVersionId,
        revisionRequested,
        feedbackLength: content.length,
      },
    });

    // Notify Admin or Customer
    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (adminUser) {
      await createNotification({
        userId: adminUser.id,
        type: 'FEEDBACK_RECEIVED',
        title: revisionRequested
          ? `Yêu cầu chỉnh sửa mới cho đơn #${order.orderCode}`
          : `Phản hồi mới cho đơn #${order.orderCode}`,
        message: `${order.guestName}: "${content.substring(0, 80)}${content.length > 80 ? '...' : ''}"`,
        linkUrl: `/admin/orders/${order.id}`,
      });
    }

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
