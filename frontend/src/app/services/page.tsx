import React from 'react';
import { prisma } from '@/lib/prisma';
import { getFallbackServices } from '@/lib/fallback-data';
import { ServiceSection } from '@/components/home/ServiceSection';

export const revalidate = 0;

interface ServicesPageProps {
  searchParams: Promise<{ q?: string; cat?: string }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { q, cat } = await searchParams;

  let services: any[] = [];

  try {
    const whereClause: any = { isActive: true };

    if (q && q.trim()) {
      whereClause.OR = [
        { title: { contains: q.trim() } },
        { shortDescription: { contains: q.trim() } },
        { description: { contains: q.trim() } },
      ];
    }

    if (cat && cat !== 'ALL') {
      whereClause.category = cat;
    }

    services = await prisma.service.findMany({
      where: whereClause,
      orderBy: { sortOrder: 'asc' },
    });
  } catch (error: any) {
    console.error('[LUK Services /services] Notice: Database query fallback applied:', error?.message || error);
    // Filter fallback catalog
    let fallback = getFallbackServices(cat);
    if (q && q.trim()) {
      const lower = q.trim().toLowerCase();
      fallback = fallback.filter(
        (s) =>
          s.title.toLowerCase().includes(lower) ||
          s.shortDescription.toLowerCase().includes(lower) ||
          s.description.toLowerCase().includes(lower)
      );
    }
    services = fallback;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="border-b border-luk-border pb-4">
        <h1 className="text-xl font-bold text-white">Tất cả dịch vụ LUK Services</h1>
        <p className="text-xs text-luk-muted mt-1">
          {q ? `Kết quả tìm kiếm cho "${q}" (${services.length} dịch vụ)` : 'Khám phá giải pháp học tập, thiết kế và truyền thông chất lượng cao cho sinh viên'}
        </p>
      </div>

      <ServiceSection initialServices={services} />
    </div>
  );
}
