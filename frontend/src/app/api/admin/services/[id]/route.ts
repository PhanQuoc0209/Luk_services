import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const service = await prisma.service.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title.trim() : undefined,
        shortDescription: body.shortDescription !== undefined ? body.shortDescription.trim() : undefined,
        description: body.description !== undefined ? body.description.trim() : undefined,
        category: body.category !== undefined ? body.category : undefined,
        startingPrice: body.startingPrice !== undefined ? Number(body.startingPrice) : undefined,
        turnaround: body.turnaround !== undefined ? body.turnaround.trim() : undefined,
        deliveryFormat: body.deliveryFormat !== undefined ? body.deliveryFormat.trim() : undefined,
        imageUrl: body.imageUrl !== undefined ? body.imageUrl.trim() : undefined,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
        isPopular: body.isPopular !== undefined ? Boolean(body.isPopular) : undefined,
        tags: body.tags !== undefined ? body.tags : undefined,
      },
    });

    await logAudit({
      entityType: 'ORDER',
      entityId: service.id,
      action: 'ADMIN_UPDATE_SERVICE',
      actorId: admin.id,
      actorRole: 'ADMIN',
      details: { title: service.title, isActive: service.isActive },
    });

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    // Check if service has orders
    const orderCount = await prisma.orderItem.count({ where: { serviceId: id } });
    if (orderCount > 0) {
      // Safely deactivate instead of deleting to preserve order history
      const service = await prisma.service.update({
        where: { id },
        data: { isActive: false },
      });

      await logAudit({
        entityType: 'ORDER',
        entityId: id,
        action: 'ADMIN_DEACTIVATE_SERVICE',
        actorId: admin.id,
        actorRole: 'ADMIN',
        details: { reason: 'Has order items, deactivated instead of hard deleted' },
      });

      return NextResponse.json({
        success: true,
        message: 'Dịch vụ đã có đơn hàng trong lịch sử nên được chuyển sang trạng thái Ngừng kinh doanh.',
        service,
      });
    }

    const service = await prisma.service.delete({ where: { id } });

    await logAudit({
      entityType: 'ORDER',
      entityId: id,
      action: 'ADMIN_DELETE_SERVICE',
      actorId: admin.id,
      actorRole: 'ADMIN',
      details: { title: service.title },
    });

    return NextResponse.json({ success: true, message: 'Đã xóa dịch vụ thành công.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
