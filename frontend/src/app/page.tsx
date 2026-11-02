import React from 'react';
import { prisma } from '@/lib/prisma';
import { getFallbackServices } from '@/lib/fallback-data';
import { CinematicHeroSection } from '@/components/cinematic/CinematicHeroSection';
import { CinematicCapabilitiesSection } from '@/components/cinematic/CinematicCapabilitiesSection';

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
      '[Cinematic HomePage] Notice: Serving fallback services catalog:',
      error?.message || error
    );
  }

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
  }));

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* SECTION 1 — HERO (Full Viewport, Looping Video / Day Sky, Giant Scatter LUK GLOBAL, Stats) */}
      <CinematicHeroSection />

      {/* SECTION 2 — CAPABILITIES (Horizontal Sliding Cards with "Xem chi tiết" Modal) */}
      <CinematicCapabilitiesSection services={formattedServices} />
    </div>
  );
}
