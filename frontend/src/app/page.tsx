import React from 'react';
import { prisma } from '@/lib/prisma';
import { getFallbackServices } from '@/lib/fallback-data';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategorySection } from '@/components/home/CategorySection';
import { RollingAnnouncementBanner } from '@/components/home/RollingAnnouncementBanner';
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
      {/* Count-up site preloader */}
      <CountUpSitePreloader />

      {/* Main Home Page Layout */}
      <div className="mx-auto max-w-[1536px] px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* 1. Hero Carousel (Pure image-only banner with touch/dot navigation) */}
        <section aria-label="Banner quảng bá dịch vụ">
          <HeroCarousel />
        </section>

        {/* 2. Rolling Announcement Banner Strip */}
        <RollingAnnouncementBanner />

        {/* 3. 6 Distinct Category Cards Section */}
        <CategorySection />

        {/* 4. Academic Universal Services Catalog & Filter Explorer */}
        <section id="services-catalog" aria-label="Danh mục dịch vụ học thuật LUK">
          <CategoryRailExplorer allServices={formattedServices} />
        </section>
      </div>
    </>
  );
}
