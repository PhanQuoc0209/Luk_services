import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { createDraftSchema } from '@/lib/validation';
import { logAudit } from '@/lib/audit';
import { createNotification } from '@/lib/notifications';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    const body = await req.json();
    const parsed = createDraftSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.format() }, { status: 400 });
    }

    const {
      versionNumber,
      versionType,
      title,
      notes,
      previewUrl,
      canDownload,
      isFinal,
      uploadedFile,
    } = parsed.data;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Đơn hàng không tồn tại' }, { status: 404 });
    }

    // Determine final status
    const isDeliverFinal = isFinal || versionType === 'FINAL';

    // Create DraftVersion
    const draft = await prisma.draftVersion.create({
      data: {
        orderId: order.id,
        versionNumber,
        versionType,
        title,
        notes: notes || null,
        previewUrl: previewUrl || null,
        fileName: uploadedFile?.fileName || null,
        fileSize: uploadedFile?.fileSize || null,
        mimeType: uploadedFile?.mimeType || null,
        storagePath: uploadedFile?.storagePath || null,
        canDownload,
        isFinal: isDeliverFinal,
        createdByAdminId: admin.id,
      },
    });

    // Update order status:
    // If delivering final version -> COMPLETED!
    // Otherwise -> DRAFT_DELIVERED!
    const newOrderStatus = isDeliverFinal ? 'COMPLETED' : 'DRAFT_DELIVERED';
    await prisma.order.update({
      where: { id: order.id },
      data: { status: newOrderStatus },
    });

    // Audit Log
    await logAudit({
      orderId: order.id,
      entityType: 'DRAFT',
      entityId: draft.id,
      action: isDeliverFinal ? 'DELIVER_FINAL_VERSION' : 'UPLOAD_DRAFT_VERSION',
      actorId: admin.id,
      actorRole: 'ADMIN',
      details: {
        versionNumber,
        versionType,
        isFinal: isDeliverFinal,
        canDownload,
        title,
      },
    });

    // Notify Customer
    await createNotification({
      userId: order.userId,
      guestEmail: order.guestEmail,
      type: isDeliverFinal ? 'ORDER_COMPLETED' : 'DRAFT_DELIVERED',
      title: isDeliverFinal
        ? `Đơn hàng #${order.orderCode} đã hoàn tất bàn giao bản cuối!`
        : `Bản nháp v${versionNumber} đơn #${order.orderCode} đã sẵn sàng xem trước`,
      message: isDeliverFinal
        ? `Sản phẩm hoàn thiện đã được bàn giao. Cảm ơn bạn đã tin tưởng dịch vụ của LUK Global!`
        : `Admin đã tải lên bản nháp v${versionNumber}: "${title}". Bạn có thể xem trước và gửi phản hồi chỉnh sửa ngay.`,
      linkUrl: `/orders/${order.orderCode}`,
    });

    return NextResponse.json({
      success: true,
      draft,
      orderStatus: newOrderStatus,
    });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN_ADMIN_ONLY' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Yêu cầu quyền Quản trị viên (Admin).' }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
