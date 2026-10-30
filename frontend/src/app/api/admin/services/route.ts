import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('q');

    const where: any = {};
    if (category && category !== 'ALL') {
      where.category = category;
    }
    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search.trim() } },
        { shortDescription: { contains: search.trim() } },
      ];
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { orderItems: true, reviews: true },
        },
      },
    });

    return NextResponse.json({ success: true, services });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    const {
      title,
      slug,
      shortDescription,
      description,
      category,
      startingPrice,
      turnaround,
      deliveryFormat,
      imageUrl,
      isFeatured,
      isPopular,
      tags,
      isActive,
    } = body;

    if (!title || !slug || !shortDescription || !description || !category) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ các trường bắt buộc.' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Đường dẫn (slug) dịch vụ đã tồn tại. Vui lòng chọn slug khác.' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        category,
        startingPrice: Number(startingPrice) || 0,
        turnaround: turnaround || '2-4 ngày',
        deliveryFormat: deliveryFormat || 'File kỹ thuật số',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
        isActive: isActive !== false,
        isFeatured: Boolean(isFeatured),
        isPopular: Boolean(isPopular),
        tags: tags || null,
        isDemo: false,
      },
    });

    await logAudit({
      entityType: 'ORDER',
      entityId: service.id,
      action: 'ADMIN_CREATE_SERVICE',
      actorId: admin.id,
      actorRole: 'ADMIN',
      details: { title: service.title, slug: service.slug },
    });

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
