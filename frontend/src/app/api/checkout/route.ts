import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { checkoutSchema } from '@/lib/validation';
import { clearCart, getOrCreateCart } from '@/lib/cart';
import { createNotification } from '@/lib/notifications';
import { logAudit } from '@/lib/audit';

function generateOrderCode(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `LUK-${dateStr}-${randomSuffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const cart = await getOrCreateCart();

    if (cart.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Giỏ hàng của bạn đang trống.' }, { status: 400 });
    }

    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.format() }, { status: 400 });
    }

    const {
      guestName,
      guestEmail,
      guestPhone,
      requestedDeadline,
      generalNotes,
      itemDetails,
    } = parsed.data;

    const orderCode = generateOrderCode();

    // Map cart items with their snapshot price
    const orderItemsData = cart.items.map((cartItem) => {
      const customDetail = itemDetails.find((d) => d.serviceId === cartItem.serviceId);
      return {
        serviceId: cartItem.serviceId,
        serviceTitleSnapshot: cartItem.service.title,
        unitPriceSnapshot: cartItem.service.startingPrice,
        quantity: cartItem.quantity,
        itemNotes: customDetail?.itemNotes || cartItem.itemNotes || null,
      };
    });

    // Create Order in Database
    const order = await prisma.order.create({
      data: {
        orderCode,
        userId: user?.id || null,
        guestName,
        guestEmail,
        guestPhone,
        status: 'PENDING_REVIEW', // Initial status
        requestedDeadline: requestedDeadline ? new Date(requestedDeadline) : null,
        generalNotes: generalNotes || null,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    // Save uploaded files associated with items
    for (const detail of itemDetails) {
      if (detail.uploadedFiles && detail.uploadedFiles.length > 0) {
        const matchingOrderItem = order.items.find((i) => i.serviceId === detail.serviceId);
        for (const f of detail.uploadedFiles) {
          await prisma.orderFile.create({
            data: {
              orderId: order.id,
              orderItemId: matchingOrderItem?.id || null,
              fileName: f.fileName,
              originalName: f.originalName,
              fileSize: f.fileSize,
              mimeType: f.mimeType,
              storagePath: f.storagePath,
              uploadedByRole: 'CUSTOMER',
            },
          });
        }
      }
    }

    // Clear cart after checkout
    await clearCart(cart.id);

    // Audit Log
    await logAudit({
      orderId: order.id,
      entityType: 'ORDER',
      entityId: order.orderCode,
      action: 'ORDER_CREATED',
      actorId: user?.id || null,
      actorRole: 'CUSTOMER',
      details: {
        orderCode,
        guestEmail,
        totalItems: cart.items.length,
      },
    });

    // In-app Notification & Email
    await createNotification({
      userId: user?.id || null,
      guestEmail,
      type: 'ORDER_RECEIVED',
      title: `Yêu cầu dịch vụ #${orderCode} đã được tiếp nhận`,
      message: `Đội ngũ LUK Services đã nhận yêu cầu của bạn. Admin đang xem xét nội dung và sẽ gửi báo giá cùng thời hạn hoàn thành trong thời gian sớm nhất.`,
      linkUrl: `/orders/${orderCode}`,
    });

    return NextResponse.json({
      success: true,
      orderCode,
      orderId: order.id,
      trackingToken: order.trackingToken,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
