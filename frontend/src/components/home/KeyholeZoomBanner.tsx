/* Lucian UX/UI Prompt #205 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#205 */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  Clock,
  GraduationCap,
  Video,
  Presentation,
  FileAudio,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Star,
} from 'lucide-react';
import { triggerCurtain } from '../common/CurtainPageTransition';

export function KeyholeZoomBanner() {
  const [heroSearch, setHeroSearch] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      const catalogEl = document.getElementById('services-catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
        // Dispatch search event to CategoryRailExplorer
        window.dispatchEvent(
          new CustomEvent('luk-hero-search', { detail: { query: heroSearch.trim() } })
        );
      } else {
        window.location.href = `/services?q=${encodeURIComponent(heroSearch.trim())}`;
      }
    }
  };

  const scrollToCatalog = (catKey?: string, curtainTitle?: string) => {
    if (curtainTitle) {
      triggerCurtain(curtainTitle, () => {
        if (catKey) {
          window.dispatchEvent(
            new CustomEvent('luk-select-category', { detail: { key: catKey } })
          );
        }
        const el = document.getElementById('services-catalog');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
    } else {
      const el = document.getElementById('services-catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20 transition-colors duration-500">
      {/* 1. Ambient Warm Lighting (Replaces harsh AI neon with prestigious academic sapphire & gold warmth) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] pointer-events-none opacity-60 dark:opacity-40"
        aria-hidden="true"
      >
        <div className="absolute top-10 left-1/4 w-[450px] h-[350px] rounded-full bg-gradient-to-tr from-blue-400/25 via-indigo-300/20 to-sky-200/10 dark:from-blue-600/15 dark:via-indigo-500/10 dark:to-transparent blur-3xl" />
        <div className="absolute top-16 right-1/4 w-[400px] h-[300px] rounded-full bg-gradient-to-bl from-amber-300/20 via-sky-200/20 to-transparent dark:from-amber-500/10 dark:via-blue-500/10 dark:to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1536px] px-3 sm:px-6 lg:px-8 space-y-10">
        {/* 2. Hero Header Content */}
        <div className="max-w-4xl mx-auto text-center space-y-5">
          {/* Top Academic Status Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 dark:border-white/15 bg-white/90 dark:bg-white/5 px-4 py-1.5 backdrop-blur-md shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Cổng Dịch Vụ Học Thuật &amp; Môn Học Đại Học • LUK Services
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">
              Hơn 50+ Môn Học
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Đồng Hành Cùng Sinh Viên{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 dark:from-blue-400 dark:via-indigo-300 dark:to-sky-300 bg-clip-text text-transparent">
              Chinh Phục Điểm A+
            </span>{' '}
            Mọi Môn Học
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Hệ sinh thái hỗ trợ học tập toàn diện cho sinh viên các trường đại học (NEU, FTU, FPT, Bách Khoa, RMIT, UEH, VNU...): từ 4 gói đặc quyền LUK (Edit Video • Slide Đồ Án • Transcript NCKH • Debate BP) đến tài khoản AI Pro và dịch vụ kèm môn học chuyên sâu.
          </p>

          {/* 3. Universal Academic Search Command Bar (Prompt #205 Reimagined with High Utility) */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-2xl mx-auto relative flex flex-col sm:flex-row items-center gap-2 sm:gap-0 rounded-3xl sm:rounded-full border border-sky-300/90 dark:border-white/20 bg-white/95 dark:bg-[#0c1022]/95 backdrop-blur-xl p-2 shadow-xl shadow-blue-500/10 dark:shadow-black/50 transition-all focus-within:ring-2 focus-within:ring-blue-500/50"
          >
            <div className="flex items-center flex-1 w-full pl-3 pr-2">
              <Search className="h-5 w-5 text-slate-400 dark:text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                placeholder="Nhập tên môn học, bài tập lớn, đồ án (vd: Kinh tế lượng, SPSS, Python, Slide...)"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 sm:py-3 shadow-md shadow-blue-500/25 transition cursor-pointer shrink-0"
            >
              <span>Tìm Dịch Vụ</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Suggestions underneath Search */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <span className="font-medium text-slate-400 dark:text-slate-400">Gợi ý phổ biến:</span>
            <button
              type="button"
              onClick={() => {
                setHeroSearch('Kinh tế lượng');
                scrollToCatalog('ECONOMICS', 'MÔN HỌC KINH TẾ & SPSS');
              }}
              className="rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-0.5 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition"
            >
              📊 Kinh Tế Lượng &amp; SPSS
            </button>
            <button
              type="button"
              onClick={() => {
                setHeroSearch('Slide khóa luận');
                scrollToCatalog('SLIDE_DESIGN', 'SLIDE THUYẾT TRÌNH LUK');
              }}
              className="rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-0.5 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition"
            >
              🎓 Slide Khóa Luận Tốt Nghiệp
            </button>
            <button
              type="button"
              onClick={() => {
                setHeroSearch('Edit video');
                scrollToCatalog('VIDEO_EDITING', 'EDIT VIDEO CHUẨN LUK');
              }}
              className="rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-0.5 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition"
            >
              🎬 Edit Video Thuyết Trình
            </button>
            <button
              type="button"
              onClick={() => {
                setHeroSearch('Python');
                scrollToCatalog('COMPUTER_SCIENCE', 'MÔN HỌC CNTT & LẬP TRÌNH');
              }}
              className="rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-0.5 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition"
            >
              💻 Đồ Án Lập Trình &amp; Python
            </button>
          </div>
        </div>

        {/* 4. Four Core Pillars Quick Cards (Soft UI Evolution) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-2">
          {/* Card 1: Edit Video */}
          <button
            type="button"
            onClick={() => scrollToCatalog('VIDEO_EDITING', 'EDIT VIDEO CHUẨN LUK')}
            className="group text-left rounded-3xl border border-sky-200/90 dark:border-white/10 bg-white/90 dark:bg-luk-card/80 p-5 backdrop-blur-xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400/60 dark:hover:border-blue-500/40 transition-all duration-300 cursor-pointer"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 mb-3.5 group-hover:scale-110 transition-transform">
              <Video className="h-5 w-5" />
            </div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Edit Video Chuẩn LUK
              </h3>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.2 rounded-md">
                5 Gói
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Video thuyết trình đồ án, highlight recap sự kiện CLB, lọc tạp âm chuẩn studio.
            </p>
          </button>

          {/* Card 2: Slide Đồ Án */}
          <button
            type="button"
            onClick={() => scrollToCatalog('SLIDE_DESIGN', 'SLIDE THUYẾT TRÌNH LUK')}
            className="group text-left rounded-3xl border border-sky-200/90 dark:border-white/10 bg-white/90 dark:bg-luk-card/80 p-5 backdrop-blur-xl shadow-sm hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-400/60 dark:hover:border-amber-500/40 transition-all duration-300 cursor-pointer"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mb-3.5 group-hover:scale-110 transition-transform">
              <Presentation className="h-5 w-5" />
            </div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Slide Đồ Án Chuẩn LUK
              </h3>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.2 rounded-md">
                5 Gói
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Slide bảo vệ khóa luận tốt nghiệp, slide đồ án môn học &amp; pitch deck gọi vốn.
            </p>
          </button>

          {/* Card 3: Transcript NCKH */}
          <button
            type="button"
            onClick={() => scrollToCatalog('TRANSCRIPT_EDITING', 'TRANSCRIPT CHUẨN LUK')}
            className="group text-left rounded-3xl border border-sky-200/90 dark:border-white/10 bg-white/90 dark:bg-luk-card/80 p-5 backdrop-blur-xl shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-400/60 dark:hover:border-emerald-500/40 transition-all duration-300 cursor-pointer"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mb-3.5 group-hover:scale-110 transition-transform">
              <FileAudio className="h-5 w-5" />
            </div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Transcript Chuẩn LUK
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.2 rounded-md">
                99.5%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Gỡ băng phỏng vấn sâu NCKH định tính, dịch phụ đề song ngữ SRT chuẩn thời gian.
            </p>
          </button>

          {/* Card 4: Debate BP & 50+ Môn Học */}
          <button
            type="button"
            onClick={() => scrollToCatalog('DEBATE_RESOURCES', 'TÀI LIỆU DEBATE & NCKH')}
            className="group text-left rounded-3xl border border-sky-200/90 dark:border-white/10 bg-white/90 dark:bg-luk-card/80 p-5 backdrop-blur-xl shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-400/60 dark:hover:border-purple-500/40 transition-all duration-300 cursor-pointer"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 mb-3.5 group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Debate BP &amp; Đa Môn Học
              </h3>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-900/30 px-1.5 py-0.2 rounded-md">
                12+ Tài liệu
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Giáo trình tranh biện BP, đề cương mẫu NCKH và hỗ trợ hơn 50+ môn học đại học.
            </p>
          </button>
        </div>

        {/* 5. Trust & Verified Social Proof Bar */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-luk-card/40 p-4 sm:p-5 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-luk-card object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Student 1"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-luk-card object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Student 2"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-luk-card object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Student 3"
                />
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-luk-card">
                  +1.8k
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="text-xs font-bold text-slate-800 dark:text-white ml-1">4.95 / 5.0</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Từ hơn 1,850+ đồ án sinh viên hoàn tất
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Bảo hành 1 đổi 1</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <Clock className="h-4 w-4" />
                <span>Cam kết đúng hạn</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <Zap className="h-4 w-4" />
                <span>AI kích hoạt 5p</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
