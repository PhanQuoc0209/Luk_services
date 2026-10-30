import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { readPrivateFile } from '@/lib/storage';

interface RouteParams {
  params: Promise<{ fileId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { fileId } = await params;
    const user = await getCurrentUser();

    // 1. Try finding in OrderFile
    const orderFile = await prisma.orderFile.findUnique({
      where: { id: fileId },
      include: { order: true },
    });

    if (orderFile) {
      // Authorization Check
      const isAdmin = user?.role === 'ADMIN';
      const isOwner = user?.id && orderFile.order.userId === user.id;
      // Allow if token or owner
      if (!isAdmin && !isOwner) {
        return NextResponse.json({ success: false, error: 'Không có quyền truy cập file này.' }, { status: 403 });
      }

      const { buffer, exists } = await readPrivateFile(orderFile.fileName);
      if (!exists) {
        return NextResponse.json({ success: false, error: 'File không tồn tại trên hệ thống.' }, { status: 404 });
      }

      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': orderFile.mimeType,
          'Content-Disposition': `attachment; filename="${encodeURIComponent(orderFile.originalName)}"`,
          'Content-Length': buffer.length.toString(),
        },
      });
    }

    // 2. Try finding in DraftVersion
    const draftVersion = await prisma.draftVersion.findUnique({
      where: { id: fileId },
      include: { order: true },
    });

    if (draftVersion && draftVersion.fileName) {
      const isAdmin = user?.role === 'ADMIN';
      const isOwner = user?.id && draftVersion.order.userId === user.id;

      if (!isAdmin && !isOwner) {
        return NextResponse.json({ success: false, error: 'Không có quyền truy cập bản nháp.' }, { status: 403 });
      }

      if (!isAdmin && !draftVersion.canDownload) {
        return NextResponse.json(
          { success: false, error: 'Bản nháp này chỉ được bật quyền xem trước, chưa được cấp phép tải về.' },
          { status: 403 }
        );
      }

      const { buffer, exists } = await readPrivateFile(draftVersion.fileName);
      if (!exists) {
        return NextResponse.json({ success: false, error: 'File không tồn tại.' }, { status: 404 });
      }

      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': draftVersion.mimeType || 'application/octet-stream',
          'Content-Disposition': `inline; filename="${encodeURIComponent(draftVersion.title)}"`,
          'Content-Length': buffer.length.toString(),
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Không tìm thấy tài liệu.' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
