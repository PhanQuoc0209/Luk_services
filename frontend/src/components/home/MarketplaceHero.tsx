'use client';

import React from 'react';
import Link from 'next/link';
import { HeroCarousel } from './HeroCarousel';
import {
  Video,
  Presentation,
  FileAudio,
  Bot,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const CATEGORY_SHORTCUTS = [
  {
    key: 'AI_ACCOUNTS',
    label: 'Các AI Pro',
    sub: 'CapCut, ChatGPT, Gemini, Canva',
    icon: Bot,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:border-indigo-400',
    href: '/services?cat=AI_ACCOUNTS',
  },
  {
    key: 'VIDEO_EDITING',
    label: 'Edit Chuẩn LUK',
    sub: 'Recap sự kiện, thuyết trình, TikTok',
    icon: Video,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:border-blue-400',
    href: '/services?cat=VIDEO_EDITING',
  },
  {
    key: 'TRANSCRIPT_EDITING',
    label: 'Transcript Chuẩn LUK',
    sub: 'Gỡ băng phỏng vấn NCKH, SRT',
    icon: FileAudio,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-400',
    href: '/services?cat=TRANSCRIPT_EDITING',
  },
  {
    key: 'SLIDE_DESIGN',
    label: 'Slide Chuẩn LUK',
    sub: 'Khóa luận, bảo vệ đồ án, pitch deck',
    icon: Presentation,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:border-amber-400',
    href: '/services?cat=SLIDE_DESIGN',
  },
];

export function MarketplaceHero() {
  return (
    <div className="space-y-4">
      {/* 1. Main Hero Grid: 3-Col Carousel + 1-Col Stacked Promos */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        {/* Main Banner (Takes 3 columns on desktop) */}
        <div className="lg:col-span-3">
          <HeroCarousel />
        </div>

        {/* 2 Stacked Side Promo Banners (Takes 4th column on desktop) */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
          {/* Top Promo Card: AI Pro accounts */}
          <div className="flex-1 flex flex-col justify-between rounded-2xl border border-luk-border bg-gradient-to-br from-luk-card via-[#121630] to-luk-card p-5 shadow-md relative overflow-hidden group">
            <div className="space-y-2 relative z-10">
              <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                <Zap className="h-3 w-3" />
                Kích Hoạt Tức Thì
              </span>
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition leading-snug">
                Tài Khoản AI Pro Sinh Viên: CapCut, ChatGPT & Gemini
              </h3>
              <p className="text-[11px] text-luk-muted leading-relaxed">
                Tài khoản chính chủ hoặc cấp riêng, bảo hành 1 đổi 1 suốt thời gian đăng ký.
              </p>
            </div>

            <Link
              href="/services?cat=AI_ACCOUNTS"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition relative z-10"
            >
              <span>Xem bảng giá AI Pro</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* Bottom Promo Card: Student Video & Transcript */}
          <div className="flex-1 flex flex-col justify-between rounded-2xl border border-luk-border bg-gradient-to-br from-luk-card via-[#0F1E33] to-luk-card p-5 shadow-md relative overflow-hidden group">
            <div className="space-y-2 relative z-10">
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-luk-blueLight border border-blue-500/20">
                <ShieldCheck className="h-3 w-3" />
                Cam Kết Đúng Deadline
              </span>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition leading-snug">
                Combo Dựng Video & Gỡ Băng Transcript NCKH
              </h3>
              <p className="text-[11px] text-luk-muted leading-relaxed">
                Bàn giao file trong 24 giờ, chỉnh sửa đến khi hoàn toàn hài lòng.
              </p>
            </div>

            <Link
              href="/services?cat=VIDEO_EDITING"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-luk-blueLight hover:text-blue-300 transition relative z-10"
            >
              <span>Xem dịch vụ video</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Category Shortcuts Bar: 4 Core Categories (Muakey Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORY_SHORTCUTS.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.key}
              href={cat.href}
              className="group flex items-center gap-3.5 rounded-2xl border border-luk-border bg-luk-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-luk-borderLight hover:bg-luk-cardHover shadow-sm"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${cat.color} transition-transform duration-200 group-hover:scale-110 shadow-sm`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="truncate">
                <h4 className="text-xs font-bold text-luk-text group-hover:text-blue-400 transition truncate">
                  {cat.label}
                </h4>
                <p className="text-[11px] text-luk-dim truncate mt-0.5">{cat.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
