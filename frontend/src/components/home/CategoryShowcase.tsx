import React from 'react';
import Link from 'next/link';
import { LucideIcon, ArrowRight, Bot, Video, FileAudio, Presentation, Sparkles } from 'lucide-react';
import { ServiceCard, ServiceCardData } from './ServiceCard';

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  AI_ACCOUNTS: Bot,
  VIDEO_EDITING: Video,
  TRANSCRIPT_EDITING: FileAudio,
  SLIDE_DESIGN: Presentation,
};

interface CategoryShowcaseProps {
  title: string;
  categoryKey: string;
  description: string;
  iconColor?: string;
  badgeText?: string;
  services: ServiceCardData[];
  viewAllHref?: string;
}

export function CategoryShowcase({
  title,
  categoryKey,
  description,
  iconColor = 'text-blue-400',
  badgeText,
  services,
  viewAllHref,
}: CategoryShowcaseProps) {
  if (!services || services.length === 0) return null;

  const targetHref = viewAllHref || `/services?cat=${categoryKey}`;
  const Icon = CATEGORY_ICON_MAP[categoryKey] || Sparkles;

  return (
    <section className="space-y-4">
      {/* Section Header (Muakey Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 ${iconColor} shadow-inner shrink-0`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                {title}
              </h2>
              {badgeText && (
                <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/25">
                  {badgeText}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
          </div>
        </div>

        <Link
          href={targetHref}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-all duration-200 group"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition text-slate-500 group-hover:text-blue-400" />
        </Link>
      </div>

      {/* Grid of Cards (4 columns on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.slice(0, 4).map((service) => (
          <ServiceCard
            key={service.id}
            service={{
              id: service.id,
              title: service.title,
              slug: service.slug,
              category: service.category,
              shortDescription: service.shortDescription,
              startingPrice: service.startingPrice,
              turnaround: service.turnaround,
              deliveryFormat: service.deliveryFormat,
              imageUrl: service.imageUrl,
              isFeatured: service.isFeatured,
              isPopular: service.isPopular,
              isDemo: service.isDemo,
            }}
          />
        ))}
      </div>
    </section>
  );
}
