import React from 'react';
import { prisma } from '@/lib/prisma';
import { RollingAnnouncementBanner } from '@/components/home/RollingAnnouncementBanner';
import { KeyholeZoomBanner } from '@/components/home/KeyholeZoomBanner';
import { CategoryRailExplorer } from '@/components/home/CategoryRailExplorer';
import { CountUpSitePreloader } from '@/components/common/CountUpSitePreloader';

export const revalidate = 0; // Dynamic

export default async function HomePage() {
  const [
    aiServices,
    videoServices,
    transcriptServices,
    slideServices,
  ] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true, category: 'AI_ACCOUNTS' },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.service.findMany({
      where: { isActive: true, category: 'VIDEO_EDITING' },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.service.findMany({
      where: { isActive: true, category: 'TRANSCRIPT_EDITING' },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.service.findMany({
      where: { isActive: true, category: 'SLIDE_DESIGN' },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

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
        {/* Rolling Announcement Banner Strip (Prompt #073) - Chuyển xuống đây ngay trước phần dịch vụ theo yêu cầu */}
        <RollingAnnouncementBanner />

        {/* Category Rail Explorer with Prompt #339 Drag-and-Snap Cards */}
        <CategoryRailExplorer
          aiServices={aiServices.map((s) => ({
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
          }))}
          videoServices={videoServices.map((s) => ({
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
          }))}
          transcriptServices={transcriptServices.map((s) => ({
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
          }))}
          slideServices={slideServices.map((s) => ({
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
          }))}
        />
      </div>
    </>
  );
}
