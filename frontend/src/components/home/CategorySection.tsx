'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Video,
  Presentation,
  BookOpen,
  Scale,
  Palette,
  Bot,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { triggerCurtain } from '../common/CurtainPageTransition';

export interface CategoryCardItem {
  id: string;
  name: string;
  shortDesc: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  href: string;
  curtainTitle: string;
}

export const HOME_6_CATEGORIES: CategoryCardItem[] = [
  {
    id: 'video',
    name: 'Edit Video',
    shortDesc: 'Thuyết trình, recap sự kiện, TikTok chuẩn đại học',
    badge: '5 dịch vụ',
    icon: Video,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    href: '/services?cat=VIDEO_EDITING',
    curtainTitle: 'EDIT VIDEO CHUẨN LUK',
  },
  {
    id: 'slide',
    name: 'Thiết kế Slide',
    shortDesc: 'Khóa luận tốt nghiệp, bảo vệ đồ án, pitch deck',
    badge: '5 dịch vụ',
    icon: Presentation,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    href: '/services?cat=SLIDE_DESIGN',
    curtainTitle: 'SLIDE ĐỒ ÁN CHUẨN LUK',
  },
  {
    id: 'research',
    name: 'Viết bài & Research',
    shortDesc: 'Đề cương NCKH, tổng quan tài liệu, chuẩn trích dẫn',
    badge: 'Học thuật',
    icon: BookOpen,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    href: '/services?cat=TRANSCRIPT_EDITING',
    curtainTitle: 'VIẾT BÀI & RESEARCH NCKH',
  },
  {
    id: 'debate',
    name: 'Debate Resources',
    shortDesc: 'Giáo trình tranh biện BP, case study, đề cương mẫu',
    badge: '12 tài liệu',
    icon: Scale,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-500/10 border-purple-500/20',
    href: '/debate',
    curtainTitle: 'TÀI LIỆU DEBATE & NCKH',
  },
  {
    id: 'poster',
    name: 'Thiết kế Poster',
    shortDesc: 'Poster hội thảo NCKH, infographic đồ án, CLB',
    badge: 'Đồ họa',
    icon: Palette,
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-500/10 border-rose-500/20',
    href: '/services?cat=SLIDE_DESIGN',
    curtainTitle: 'THIẾT KẾ POSTER & ẤN PHẨM',
  },
  {
    id: 'ai-other',
    name: 'Dịch vụ khác & AI',
    shortDesc: 'CapCut Pro, ChatGPT-4o, Gemini 2TB, Canva Pro',
    badge: 'Giao 5m',
    icon: Bot,
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-500/10 border-indigo-500/20',
    href: '/services?cat=AI_ACCOUNTS',
    curtainTitle: 'TÀI KHOẢN AI PRO CHÍNH CHỦ',
  },
];

export function CategorySection() {
  const router = useRouter();

  const handleCategoryClick = (cat: CategoryCardItem) => {
    triggerCurtain(cat.curtainTitle, () => {
      router.push(cat.href);
    });
  };

  return (
    <section className="space-y-3" aria-labelledby="home-categories-title">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <h2
            id="home-categories-title"
            className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white"
          >
            6 Nhóm Dịch Vụ Sinh Viên Trọng Tâm
          </h2>
        </div>
        <Link
          href="/services"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>Xem tất cả danh mục</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 6 Category Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {HOME_6_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className="group flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E1726] hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-200 text-left cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${cat.iconBg} ${cat.iconColor} group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                    {cat.badge}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-snug">
                  {cat.shortDesc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                <span>Khám phá</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
