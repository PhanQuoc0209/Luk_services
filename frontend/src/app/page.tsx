import React from 'react';
import { prisma } from '@/lib/prisma';
import { getFallbackServices } from '@/lib/fallback-data';
import { RollingAnnouncementBanner } from '@/components/home/RollingAnnouncementBanner';
import { KeyholeZoomBanner } from '@/components/home/KeyholeZoomBanner';
import { CategoryRailExplorer } from '@/components/home/CategoryRailExplorer';
import { CountUpSitePreloader } from '@/components/common/CountUpSitePreloader';

export const revalidate = 0; // Dynamic

async function getAllActiveServices() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    if (services && services.length > 0) {
      return services;
    }
  } catch (error: any) {
    console.error(
      '[LUK Services HomePage] Database query notice: Serving guaranteed fallback catalog:',
      error?.message || error
    );
  }

  // Gracefully return curated catalog so the website NEVER crashes with a 500 digest error
  return getFallbackServices('ALL');
}

export default async function HomePage() {
  const services = await getAllActiveServices();

  const formattedServices = services.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    category: s.category,
    shortDescription: s.shortDescription,
    startingPrice: s.startingPrice,
    turnaround: s.turnaround,
    deliveryFormat: s.deliveryFormat,
    imageUrl: s.imageUrl,
    isFeatured: s.isFeatured,
    isPopular: s.isPopular,
    isDemo: s.isDemo,
  }));

  return (
    <>
      {/* Lucian UX/UI Prompt #256: Count-up site preloader (Nhanh & không hiện %) */}
      <CountUpSitePreloader />

      {/* 1. Grand Full-Width Moonlight Hero Banner (Tràn từ đỉnh y=0 để navbar nổi trực tiếp trên đêm trăng) */}
      <section className="w-full relative overflow-hidden -mt-20 sm:-mt-24">
        <KeyholeZoomBanner />
      </section>

      {/* 2. Main Content Container */}
      <div className="mx-auto max-w-[1536px] px-3 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Rolling Announcement Banner Strip (Prompt #073) */}
        <RollingAnnouncementBanner />

        {/* Academic Universal Services & Multi-Course Catalog */}
        <CategoryRailExplorer allServices={formattedServices} />
      </div>
    </>
  );
}
