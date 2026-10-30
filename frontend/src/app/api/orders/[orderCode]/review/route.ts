import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
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
      include: {
        items: true,
        review: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy đơn hàng.' },
        { status: 404 }
      );
    }

    // Authorization check: User must own the order, or provide valid tracking token or be admin
    const { searchParams } = new URL(req.url);
    const queryToken = searchParams.get('token');
    const body = await req.json();
    const token = body.trackingToken || queryToken;

    const isOwner = user && order.userId === user.id;
    const isAdmin = user && user.role === 'ADMIN';
    const hasValidToken = token && token === order.trackingToken;
    const isMatchingGuest = !user && body.guestEmail && body.guestEmail.toLowerCase() === order.guestEmail.toLowerCase();

    if (!isOwner && !isAdmin && !hasValidToken && !isMatchingGuest) {
      return NextResponse.json(
        { success: false, error: 'Bạn không có quyền đánh giá đơn hàng này.' },
        { status: 403 }
      );
    }

    // STRICT SERVER-SIDE RULE: Order must be COMPLETED
    if (order.status !== 'COMPLETED') {
      return NextResponse.json(
        {
          success: false,
          error: 'Chỉ có thể đánh giá đơn hàng khi đã hoàn thành và nhận bàn giao sản phẩm cuối cùng.',
        },
        { status: 400 }
      );
    }

    // STRICT SERVER-SIDE RULE: Prevent duplicate reviews
    if (order.review) {
      return NextResponse.json(
        {
          success: false,
          error: 'Đơn hàng này đã được gửi đánh giá trước đó. Mỗi đơn hàng chỉ được gửi 1 lần đánh giá.',
        },
        { status: 400 }
      );
    }

    const rating = Number(body.rating);
    const comment = typeof body.comment === 'string' ? body.comment.trim() : '';

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng chọn mức đánh giá từ 1 đến 5 sao.' },
        { status: 400 }
      );
    }

    if (!comment || comment.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập nhận xét chi tiết (tối thiểu 5 ký tự).' },
        { status: 400 }
      );
    }

    const primaryServiceId = order.items[0]?.serviceId || null;
    const authorName = user?.name || order.guestName || 'Khách hàng LUK';

    const review = await prisma.review.create({
      data: {
        orderId: order.id,
        serviceId: primaryServiceId,
        userId: user?.id || null,
        authorName,
        rating,
        comment,
        isDemo: false,
      },
    });

    await logAudit({
      orderId: order.id,
      entityType: 'ORDER',
      entityId: order.orderCode,
      action: 'CUSTOMER_REVIEW_SUBMITTED',
      actorId: user?.id || null,
      actorRole: 'CUSTOMER',
      details: {
        rating,
        commentLength: comment.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Cảm ơn bạn đã gửi đánh giá dịch vụ!',
      review,
    });
  } catch (error: any) {
    console.error('Submit review error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
