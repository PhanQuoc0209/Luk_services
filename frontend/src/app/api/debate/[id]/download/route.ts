import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const resource = await prisma.debateResource.findUnique({
      where: { id },
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: 'Tài liệu debate không tồn tại.' },
        { status: 404 }
      );
    }

    // Access control: If premium resource, require authenticated user
    if (resource.isPremium) {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: 'Vui lòng đăng nhập để truy cập và tải tài liệu chuyên sâu này.',
          },
          { status: 401 }
        );
      }
    }

    // Increment downloads count safely
    await prisma.debateResource.update({
      where: { id },
      data: { downloadsCount: { increment: 1 } },
    });

    // If external safe URL exists (e.g. Google Drive view, Notion public template, etc.)
    if (resource.downloadUrl && resource.downloadUrl.startsWith('http')) {
      return NextResponse.redirect(resource.downloadUrl);
    }

    // Safe demo response (synthesizes downloadable summary document)
    const content = `=====================================================
LUK SERVICES — HỆ SINH THÁI HỌC THUẬT LUK GLOBAL
TÀI LIỆU TRANH BIỆN: ${resource.title.toUpperCase()}
Chủ đề: ${resource.topic} | Định dạng: ${resource.format}
Cấp độ: ${resource.difficulty} | Ngôn ngữ: ${resource.language}
Tác giả/Biên soạn: ${resource.author || 'LUK Debate Society'}
=====================================================

MÔ TẢ CHI TIẾT:
${resource.description}

TỪ KHÓA (TAGS):
${resource.tags}

HƯỚNG DẪN SỬ DỤNG CASE FILE:
1. Xác định rõ Actor và Stakeholders trong Motion.
2. Phân tách rõ ràng Argument of Principle và Argument of Practical.
3. Sử dụng Rebuttal Bank để dự đoán các luận điểm đối lập.
4. Liên hệ LUK Services để đặt nghiên cứu Motion chuyên sâu cho giải đấu.

Bản quyền tài liệu thuộc LUK Global Ecosystem. Mọi hành vi sao chép thương mại cần được cấp phép.
`;

    const filename = `${resource.slug || 'debate-resource'}.txt`;

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('Debate download error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
