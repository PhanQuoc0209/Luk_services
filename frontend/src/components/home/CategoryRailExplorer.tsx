/* Lucian UX/UI Prompt #040 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#040 */
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  ArrowRight,
  Check,
  Sparkles,
  LayoutGrid,
  List,
  Grid3X3,
  Search,
  X,
  GraduationCap,
  TrendingUp,
  Code2,
  Scale,
  Palette,
  BookOpen,
  Layers,
  Send,
  Clock,
  ShieldCheck,
  Award,
  Zap,
  ChevronRight,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';
import { formatVND } from '@/lib/vietqr';
import { useApp } from '../providers/AppProvider';
import { ServiceCardData } from './ServiceCard';
import { DragSnapCardCarousel } from './DragSnapCardCarousel';

export interface CategoryRailExplorerProps {
  allServices?: ServiceCardData[];
  aiServices?: ServiceCardData[];
  videoServices?: ServiceCardData[];
  transcriptServices?: ServiceCardData[];
  slideServices?: ServiceCardData[];
  topContent?: React.ReactNode;
}

interface SubjectCategory {
  key: string;
  label: string;
  shortLabel: string;
  title: string;
  badge?: string;
  description: string;
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  filterFn: (s: ServiceCardData) => boolean;
}

type QuickTagFilter = 'ALL' | 'FAST' | 'FEATURED' | 'POPULAR' | 'URGENT';

export function CategoryRailExplorer({
  allServices = [],
  aiServices = [],
  videoServices = [],
  transcriptServices = [],
  slideServices = [],
  topContent,
}: CategoryRailExplorerProps) {
  const { addToCartAndOpen, openSideRail } = useApp();

  // Combine services gracefully with fallback support
  const masterServices: ServiceCardData[] = useMemo(() => {
    if (allServices && allServices.length > 0) {
      return allServices;
    }
    const combined = [
      ...aiServices,
      ...videoServices,
      ...transcriptServices,
      ...slideServices,
    ];
    // Deduplicate by ID
    const seen = new Set<string>();
    return combined.filter((s) => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }, [allServices, aiServices, videoServices, transcriptServices, slideServices]);

  // Subject categories definition
  const subjectCategories: SubjectCategory[] = useMemo(
    () => [
      {
        key: 'ALL',
        label: '🌟 Tất Cả Môn Học & Dịch Vụ',
        shortLabel: 'Tất cả',
        title: 'Cổng Dịch Vụ Học Thuật & Công Cụ Sinh Viên Đại Học',
        description:
          'Tổng hợp đầy đủ giải pháp từ LUK Services, tài khoản AI Pro, đến dịch vụ hỗ trợ đồ án, bài tập lớn và NCKH cho hơn 50+ môn học đại học.',
        gradient: 'linear-gradient(140deg, #3B82F6, #6366F1)',
        icon: Sparkles,
        iconBg: 'bg-blue-500/15 text-blue-500',
        filterFn: () => true,
      },
      {
        key: 'LUK_CORE',
        label: '🏆 Gói Trọng Tâm LUK',
        shortLabel: 'Gói LUK Services',
        title: 'Hệ Sinh Thái LUK Services: Edit • Slide • Trans • Debate',
        description:
          'Trọn bộ 4 trụ cột dịch vụ cao cấp: Edit Video Thuyết Trình & Recap, Slide Đồ Án Tốt Nghiệp, Gỡ Băng Transcript 99.5% và Tài Liệu Debate BP.',
        gradient: 'linear-gradient(140deg, #F43F5E, #FB7185)',
        icon: Award,
        iconBg: 'bg-rose-500/15 text-rose-500',
        filterFn: (s: ServiceCardData) =>
          s.category === 'VIDEO_EDITING' ||
          s.category === 'SLIDE_DESIGN' ||
          s.category === 'TRANSCRIPT_EDITING' ||
          s.category === 'DEBATE_RESOURCES',
      },
      {
        key: 'AI_ACCOUNTS',
        label: '🤖 Công Cụ AI Pro',
        shortLabel: 'Tài Khoản AI Pro',
        title: 'Hệ Sinh Thái AI Pro: CapCut, ChatGPT Plus & Gemini Advanced',
        description:
          'Nâng cấp tài khoản bản quyền chính chủ, mở khóa full tính năng VIP, kích hoạt siêu tốc 5 phút và bảo hành 1 đổi 1 trong suốt thời gian học.',
        gradient: 'linear-gradient(140deg, #6366F1, #8B5CF6)',
        icon: Zap,
        iconBg: 'bg-indigo-500/15 text-indigo-500',
        filterFn: (s: ServiceCardData) => s.category === 'AI_ACCOUNTS',
      },
      {
        key: 'ECONOMICS',
        label: '📈 Kinh Tế & Phân Tích Dữ Liệu',
        shortLabel: 'Kinh Tế & SPSS',
        title: 'Môn Học Kinh Tế: Kinh Tế Lượng, SPSS & Báo Cáo Tài Chính',
        description:
          'Hỗ trợ làm sạch dữ liệu, kiểm định Cronbach Alpha, hồi quy OLS/SEM/SmartPLS, mô hình dự phóng tài chính DCF/WACC chuẩn đại học (NEU, FTU, UEH, VNU...).',
        gradient: 'linear-gradient(140deg, #10B981, #059669)',
        icon: TrendingUp,
        iconBg: 'bg-emerald-500/15 text-emerald-500',
        filterFn: (s: ServiceCardData) => s.category === 'ECONOMICS',
      },
      {
        key: 'COMPUTER_SCIENCE',
        label: '💻 CNTT & Lập Trình',
        shortLabel: 'CNTT & Đồ Án Code',
        title: 'Môn Học CNTT: Kèm Đồ Án Web/App, Python & Sửa Bug Mã Nguồn',
        description:
          'Hỗ trợ xây dựng kiến trúc full-stack (Next.js, React, Node.js), giải bài tập lớn Python/C++/Java, sửa bug deploy và chuẩn bị phản biện hội đồng.',
        gradient: 'linear-gradient(140deg, #0EA5E9, #0284C7)',
        icon: Code2,
        iconBg: 'bg-sky-500/15 text-sky-500',
        filterFn: (s: ServiceCardData) => s.category === 'COMPUTER_SCIENCE',
      },
      {
        key: 'LAW_SOCIAL',
        label: '⚖️ Luật & Khoa Học Xã Hội',
        shortLabel: 'Luật & Chuẩn APA',
        title: 'Môn Học Luật & Xã Hội: Tiểu Luận, Case Study & Chuẩn Trích Dẫn APA',
        description:
          'Hỗ trợ định hướng lập luận pháp lý, case study thương mại, rà soát tỷ lệ trùng lặp Turnitin và chuẩn hóa 100% trích dẫn theo quy chuẩn APA 7th / Harvard.',
        gradient: 'linear-gradient(140deg, #8B5CF6, #7C3AED)',
        icon: Scale,
        iconBg: 'bg-purple-500/15 text-purple-500',
        filterFn: (s: ServiceCardData) => s.category === 'LAW_SOCIAL',
      },
      {
        key: 'MEDIA_DESIGN',
        label: '🎨 Truyền Thông & Media',
        shortLabel: 'Truyền Thông & Thiết Kế',
        title: 'Môn Học Truyền Thông: Thiết Kế Ấn Phẩm CLB & Media Đồ Án',
        description:
          'Thiết kế trọn bộ Avatar, Cover Facebook, Standee, Poster A3 hội thảo sinh viên, dựng video recap truyền thông và đồ họa báo cáo sắc nét.',
        gradient: 'linear-gradient(140deg, #EC4899, #DB2777)',
        icon: Palette,
        iconBg: 'bg-pink-500/15 text-pink-500',
        filterFn: (s: ServiceCardData) => s.category === 'MEDIA_DESIGN',
      },
      {
        key: 'DEBATE_RESOURCES',
        label: '🎓 Debate BP & NCKH',
        shortLabel: 'Debate & NCKH',
        title: 'Kho Học Liệu Debate Nghị Viện Anh & Nghiên Cứu Khoa Học',
        description:
          'Giáo trình tranh biện BP toàn diện, Motion Book 200+ đề thi tuyển chọn, mẫu đề cương NCKH định tính & định lượng chuẩn Bộ Giáo Dục.',
        gradient: 'linear-gradient(140deg, #6366F1, #3B82F6)',
        icon: BookOpen,
        iconBg: 'bg-blue-500/15 text-blue-500',
        filterFn: (s: ServiceCardData) => s.category === 'DEBATE_RESOURCES',
      },
    ],
    []
  );

  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickTag, setQuickTag] = useState<QuickTagFilter>('ALL');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid' | 'list'>('carousel');
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Custom Course Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);
  const [requestForm, setRequestForm] = useState({
    name: '',
    contact: '',
    university: '',
    subjectName: '',
    details: '',
    deadline: '',
  });

  const activeCategory = subjectCategories[selectedIdx] || subjectCategories[0];

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    subjectCategories.forEach((cat) => {
      counts[cat.key] = masterServices.filter(cat.filterFn).length;
    });
    return counts;
  }, [subjectCategories, masterServices]);

  // Filter services by Category, Search, and Quick Tag
  const filteredServices = useMemo(() => {
    let result = masterServices.filter(activeCategory.filterFn);

    // Apply Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          (s.deliveryFormat && s.deliveryFormat.toLowerCase().includes(q)) ||
          (s.turnaround && s.turnaround.toLowerCase().includes(q))
      );
    }

    // Apply Quick Tag
    if (quickTag === 'FAST') {
      result = result.filter(
        (s) =>
          s.turnaround?.toLowerCase().includes('5') ||
          s.turnaround?.toLowerCase().includes('ngay') ||
          s.turnaround?.toLowerCase().includes('10')
      );
    } else if (quickTag === 'FEATURED') {
      result = result.filter((s) => s.isFeatured);
    } else if (quickTag === 'POPULAR') {
      result = result.filter((s) => s.isPopular);
    } else if (quickTag === 'URGENT') {
      result = result.filter(
        (s) =>
          s.turnaround?.toLowerCase().includes('24') ||
          s.turnaround?.toLowerCase().includes('12') ||
          s.turnaround?.toLowerCase().includes('ngay')
      );
    }

    return result;
  }, [masterServices, activeCategory, searchQuery, quickTag]);

  // Listen to external navigation events from Navbar dropdown or search
  useEffect(() => {
    const handleCatEvent = (e: CustomEvent<{ key: string }>) => {
      const catKey = e.detail?.key;
      if (!catKey) return;

      // Map single LUK subcategories to LUK_CORE or their specific keys
      if (
        catKey === 'VIDEO_EDITING' ||
        catKey === 'SLIDE_DESIGN' ||
        catKey === 'TRANSCRIPT_EDITING'
      ) {
        const idx = subjectCategories.findIndex((c) => c.key === 'LUK_CORE');
        if (idx !== -1) handleSelect(idx);
      } else {
        const idx = subjectCategories.findIndex((c) => c.key === catKey);
        if (idx !== -1) handleSelect(idx);
      }
    };

    const handleHeroSearchEvent = (e: CustomEvent<{ query: string }>) => {
      if (e.detail?.query) {
        setSearchQuery(e.detail.query);
        setSelectedIdx(0); // switch to ALL so all matched services are shown
      }
    };

    window.addEventListener('luk-select-category' as any, handleCatEvent);
    window.addEventListener('luk-hero-search' as any, handleHeroSearchEvent);
    return () => {
      window.removeEventListener('luk-select-category' as any, handleCatEvent);
      window.removeEventListener('luk-hero-search' as any, handleHeroSearchEvent);
    };
  }, [subjectCategories]);

  // Check URL parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('cat');
      if (cat) {
        if (
          cat === 'VIDEO_EDITING' ||
          cat === 'SLIDE_DESIGN' ||
          cat === 'TRANSCRIPT_EDITING'
        ) {
          const idx = subjectCategories.findIndex((c) => c.key === 'LUK_CORE');
          if (idx !== -1) handleSelect(idx);
        } else {
          const idx = subjectCategories.findIndex((c) => c.key === cat);
          if (idx !== -1) handleSelect(idx);
        }
      }
    }
  }, [subjectCategories]);

  const handleSelect = (idx: number) => {
    if (idx === selectedIdx) return;
    setIsSwapping(true);
    setSelectedIdx(idx);
    setTimeout(() => {
      setIsSwapping(false);
    }, 180);

    const catalogEl = document.getElementById('services-catalog');
    if (catalogEl) {
      const rect = catalogEl.getBoundingClientRect();
      if (rect.top < 60 || rect.top > window.innerHeight * 0.8) {
        catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleAddToCart = async (serviceId: string) => {
    if (addingId) return;
    setAddingId(serviceId);
    try {
      await addToCartAndOpen(serviceId);
      setAddedId(serviceId);
      setTimeout(() => setAddedId(null), 2000);
    } catch {
      // ignore
    } finally {
      setAddingId(null);
    }
  };

  const handleCustomRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setIsRequestModalOpen(false);
      setRequestForm({
        name: '',
        contact: '',
        university: '',
        subjectName: '',
        details: '',
        deadline: '',
      });
    }, 2500);
  };

  return (
    <div className="w-full">
      <div className="ux u040">
        <div className="u040-main w-full" aria-live="polite">
          {/* Top interfaces: Rolling Banner, Keyhole Zoom Banner */}
          {topContent}

          {/* Academic Universal Services & Multi-Course Catalog */}
          <section id="services-catalog" className="u040-service-panel w-full scroll-mt-24">
            {/* 1. Header: Universal Academic Hub Title & Instant Search */}
            <div className="mb-6 rounded-3xl border border-sky-200/80 dark:border-white/10 bg-white/80 dark:bg-luk-card/70 backdrop-blur-xl p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 border border-blue-500/20 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>CỔNG DỊCH VỤ HỌC THUẬT &amp; MÔN HỌC ĐẠI HỌC • LUK HUB</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Khám Phá Dịch Vụ Theo Chuyên Ngành &amp; Môn Học
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-luk-muted leading-relaxed">
                    Hỗ trợ sinh viên toàn diện: từ 4 gói đặc quyền LUK (Edit • Slide • Trans • Debate), tài khoản AI Pro đến bài tập lớn, đồ án và NCKH cho hơn 50+ môn học đại học.
                  </p>
                </div>

                {/* Instant Search Bar */}
                <div className="w-full lg:w-80 relative">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3.5 h-4 w-4 text-slate-400 dark:text-luk-dim pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Tìm môn học, đồ án, SPSS, Python..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-2xl border border-sky-200/90 dark:border-luk-border bg-sky-50/60 dark:bg-luk-bg/80 pl-9 pr-9 py-2.5 text-xs text-slate-800 dark:text-luk-text placeholder-slate-400 dark:placeholder-luk-dim focus:border-blue-500 focus:bg-white dark:focus:bg-luk-card focus:outline-none transition shadow-inner"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
                        title="Xóa tìm kiếm"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-luk-dim mt-1.5 px-1">
                    <span>Tìm theo môn, mã môn hoặc công cụ</span>
                    <span>{filteredServices.length} kết quả</span>
                  </div>
                </div>
              </div>

              {/* 2. Expandable Subject Category Pills Bar */}
              <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-white/10">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-luk-dim">
                    Chọn nhóm môn học &amp; chuyên ngành:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:underline transition"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>+ Yêu cầu môn học riêng</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {subjectCategories.map((cat, i) => {
                    const isSelected = selectedIdx === i;
                    const IconComp = cat.icon;
                    const count = categoryCounts[cat.key] || 0;

                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => handleSelect(i)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-[1.02]'
                            : 'bg-white/95 dark:bg-luk-card text-slate-700 dark:text-luk-muted hover:text-blue-600 dark:hover:text-white hover:bg-sky-50 dark:hover:bg-luk-border border border-sky-200/80 dark:border-luk-border shadow-sm'
                        }`}
                      >
                        <span className={`w-4 h-4 flex items-center justify-center ${isSelected ? 'text-white' : ''}`}>
                          <IconComp className="h-4 w-4" />
                        </span>
                        <span>{cat.shortLabel}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-sky-100 dark:bg-luk-bg text-sky-700 dark:text-luk-dim'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Sub-filter Controls: Quick Tags + View Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-sky-200/70 dark:border-luk-border">
              {/* Quick Demand Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-luk-dim mr-1 hidden sm:inline">
                  Lọc nhanh:
                </span>
                <button
                  type="button"
                  onClick={() => setQuickTag('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    quickTag === 'ALL'
                      ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-white/80 dark:bg-luk-card/70 text-slate-600 dark:text-luk-muted border border-slate-200/80 dark:border-luk-border hover:bg-sky-50'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  onClick={() => setQuickTag('FAST')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
                    quickTag === 'FAST'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/80 dark:bg-luk-card/70 text-slate-600 dark:text-luk-muted border border-slate-200/80 dark:border-luk-border hover:bg-sky-50'
                  }`}
                >
                  <Zap className="h-3 w-3 text-amber-500" />
                  <span>Giao siêu tốc 5-15p</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickTag('FEATURED')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
                    quickTag === 'FEATURED'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/80 dark:bg-luk-card/70 text-slate-600 dark:text-luk-muted border border-slate-200/80 dark:border-luk-border hover:bg-sky-50'
                  }`}
                >
                  <Sparkles className="h-3 w-3 text-rose-500" />
                  <span>Nổi bật nhất</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickTag('POPULAR')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
                    quickTag === 'POPULAR'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/80 dark:bg-luk-card/70 text-slate-600 dark:text-luk-muted border border-slate-200/80 dark:border-luk-border hover:bg-sky-50'
                  }`}
                >
                  <Award className="h-3 w-3 text-emerald-500" />
                  <span>Phổ biến</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickTag('URGENT')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
                    quickTag === 'URGENT'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/80 dark:bg-luk-card/70 text-slate-600 dark:text-luk-muted border border-slate-200/80 dark:border-luk-border hover:bg-sky-50'
                  }`}
                >
                  <Clock className="h-3 w-3 text-blue-500" />
                  <span>Cần gấp 24h</span>
                </button>
              </div>

              {/* View Switcher + Left Drawer Shortcut */}
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center p-0.5 rounded-xl border border-sky-200/80 dark:border-luk-border bg-white/95 dark:bg-luk-card shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode('carousel')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      viewMode === 'carousel'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-luk-muted hover:text-blue-600 dark:hover:text-white'
                    }`}
                    title="Hiển thị dạng thẻ lướt kéo thả (Prompt #339)"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Lướt thẻ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-luk-muted hover:text-blue-600 dark:hover:text-white'
                    }`}
                    title="Hiển thị dạng lưới thẻ rộng"
                  >
                    <Grid3X3 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Lưới thẻ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-luk-muted hover:text-blue-600 dark:hover:text-white'
                    }`}
                    title="Hiển thị dạng danh sách chi tiết"
                  >
                    <List className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Danh sách</span>
                  </button>
                </div>

                {/* Quick Drawer Launcher */}
                <button
                  type="button"
                  onClick={openSideRail}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200/80 dark:border-luk-border bg-white/95 dark:bg-luk-card px-3 py-2 text-xs font-medium text-slate-700 dark:text-luk-muted hover:text-blue-600 dark:hover:text-white hover:bg-sky-50 transition cursor-pointer shadow-sm"
                  title="Mở thanh công cụ dịch vụ bên trái"
                >
                  <Layers className="h-3.5 w-3.5 text-blue-500" />
                  <span className="hidden md:inline">Thanh công cụ</span>
                </button>
              </div>
            </div>

            {/* Active Category Heading & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    {activeCategory.label}
                  </span>
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
                    {filteredServices.length} dịch vụ khả dụng
                  </span>
                </div>
                <h3 className={`text-slate-900 dark:text-luk-text font-black text-lg sm:text-xl mt-0.5 ${isSwapping ? 'swap' : ''}`}>
                  {activeCategory.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-luk-muted max-w-3xl leading-relaxed mt-0.5">
                  {activeCategory.description}
                </p>
              </div>

              <Link
                href={`/services?cat=${activeCategory.key}`}
                className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-3.5 py-2 text-xs font-bold transition group shrink-0"
              >
                <span>Xem tất cả {filteredServices.length} gói</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </Link>
            </div>

            {/* Stickman Video Director Banner (when Video or LUK_CORE or ALL is active) */}
            {(activeCategory.key === 'LUK_CORE' || activeCategory.key === 'ALL') && (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-3.5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30">
                    <img
                      src="/stickman/clapper-crayon.png"
                      alt="Stickman Director"
                      className="h-6 w-6 object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-500">
                        🎬 Stickman Video Director Studio
                      </span>
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-amber-400">
                        Tích hợp mới
                      </span>
                    </div>
                    <p className="text-[11.5px] text-slate-600 dark:text-luk-muted">
                      Đạo diễn video hoạt hình người que 60s, 6 cảnh storyboard, tự động hóa prompt Gemini Omni Flash &amp; dựng CapCut chuyên nghiệp.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600 dark:text-luk-muted">
                  <span className="rounded-full bg-white dark:bg-luk-card px-2 py-0.5 border border-slate-200 dark:border-luk-border">Classic B&amp;W</span>
                  <span className="rounded-full bg-white dark:bg-luk-card px-2 py-0.5 border border-slate-200 dark:border-luk-border">Tech &amp; Story</span>
                  <span className="rounded-full bg-white dark:bg-luk-card px-2 py-0.5 border border-slate-200 dark:border-luk-border">Prehistoric</span>
                </div>
              </div>
            )}

            {/* Empty State when Search Query finds nothing */}
            {filteredServices.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-sky-300 dark:border-luk-border p-10 text-center space-y-3 bg-white/50 dark:bg-luk-card/30">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                  <Search className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                  Chưa tìm thấy dịch vụ nào cho &quot;{searchQuery}&quot; trong chuyên ngành này
                </h4>
                <p className="text-xs text-slate-500 dark:text-luk-muted max-w-md mx-auto">
                  Bạn có thể chọn danh mục &quot;Tất Cả Môn Học&quot; hoặc gửi yêu cầu môn học riêng để đội ngũ học thuật LUK hỗ trợ ngay.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setQuickTag('ALL');
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-sky-200 dark:border-luk-border text-xs font-semibold hover:bg-sky-50 dark:hover:bg-luk-border transition"
                  >
                    Đặt lại bộ lọc
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                  >
                    Yêu cầu môn học của bạn
                  </button>
                </div>
              </div>
            ) : viewMode === 'carousel' ? (
              /* 1. Carousel Mode: Lucian UX/UI Prompt #339 Drag-and-Snap */
              <DragSnapCardCarousel
                services={filteredServices}
                categoryTitle={activeCategory.title}
                categoryDescription={activeCategory.description}
                categoryKey={activeCategory.key}
                onAddToCart={handleAddToCart}
                addingId={addingId}
                addedId={addedId}
              />
            ) : viewMode === 'grid' ? (
              /* 2. Responsive Grid Mode */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredServices.map((service) => {
                  const isJustAdded = addedId === service.id;
                  const isCurrentlyAdding = addingId === service.id;

                  return (
                    <div
                      key={service.id}
                      className="group relative flex flex-col justify-between rounded-3xl border border-sky-200/80 dark:border-white/10 bg-white dark:bg-luk-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10"
                    >
                      <div>
                        {/* Thumbnail */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-luk-bg mb-3.5">
                          <img
                            src={service.imageUrl}
                            alt={service.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            {service.isFeatured && (
                              <span className="rounded-full bg-rose-500/90 text-white text-[10px] font-bold px-2 py-0.5 shadow-sm backdrop-blur-sm">
                                Nổi bật
                              </span>
                            )}
                            <span className="rounded-full bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 backdrop-blur-sm">
                              {service.turnaround}
                            </span>
                          </div>
                        </div>

                        {/* Title & Desc */}
                        <Link href={`/services/${service.slug}`} className="block">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                            {service.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-luk-muted line-clamp-2 mt-1.5 leading-relaxed">
                          {service.shortDescription}
                        </p>
                      </div>

                      {/* Pricing & Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 dark:text-luk-dim block uppercase font-medium">
                            Báo giá từ
                          </span>
                          <span className="text-sm font-black text-slate-900 dark:text-white">
                            {service.startingPrice > 0 ? formatVND(service.startingPrice) : 'Liên hệ'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(service.id)}
                            disabled={isCurrentlyAdding}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                              isJustAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                            }`}
                          >
                            {isJustAdded ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Đã thêm</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="h-3.5 w-3.5" />
                                <span>{isCurrentlyAdding ? '...' : 'Thêm'}</span>
                              </>
                            )}
                          </button>

                          <Link
                            href={`/services/${service.slug}`}
                            className="p-1.5 rounded-xl border border-slate-200 dark:border-luk-border text-slate-500 hover:text-blue-600 hover:border-blue-400 transition"
                            title="Xem chi tiết"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* 3. Detailed Vertical List View */
              <div className="space-y-2.5">
                {filteredServices.map((service) => {
                  const isJustAdded = addedId === service.id;
                  const isCurrentlyAdding = addingId === service.id;

                  return (
                    <div
                      key={service.id}
                      className="u040-blk"
                      style={
                        {
                          '--c': activeCategory.gradient,
                        } as React.CSSProperties
                      }
                    >
                      <div className="u040-blk-thumb">
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </div>

                      <div className="u040-blk-info">
                        <div className="u040-blk-title-row">
                          <Link
                            href={`/services/${service.slug}`}
                            className="u040-blk-title"
                          >
                            {service.title}
                          </Link>
                          {service.isFeatured && (
                            <span className="u040-blk-tag hot">Nổi bật</span>
                          )}
                          <span className="u040-blk-tag">
                            {service.turnaround}
                          </span>
                        </div>
                        <p className="u040-blk-desc">
                          {service.shortDescription}
                        </p>
                      </div>

                      <div className="u040-blk-actions">
                        <div className="u040-blk-price">
                          <small>Báo giá từ</small>
                          <span>
                            {service.startingPrice > 0
                              ? formatVND(service.startingPrice)
                              : 'Liên hệ'}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="u040-blk-btn-cart"
                          disabled={isCurrentlyAdding}
                          onClick={() => handleAddToCart(service.id)}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-300" />
                              <span>Đã thêm</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="h-3.5 w-3.5" />
                              <span>
                                {isCurrentlyAdding ? '...' : 'Thêm giỏ'}
                              </span>
                            </>
                          )}
                        </button>

                        <Link
                          href={`/services/${service.slug}`}
                          className="u040-blk-btn-view"
                        >
                          <span>Chi tiết</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 4. Future Expansion CTA Card: "Yêu Cầu Môn Học Của Bạn" */}
            <div className="mt-8 rounded-3xl border border-sky-300/80 dark:border-white/10 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-sky-500/10 dark:bg-gradient-to-r dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-slate-900/40 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/15 px-3 py-1 rounded-full border border-blue-500/30">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>MỞ RỘNG MÔN HỌC THEO YÊU CẦU SINH VIÊN</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Môn học của bạn chưa có trong danh mục sẵn có?
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-luk-muted leading-relaxed">
                    LUK Services liên tục mở rộng hỗ trợ cho hơn 50+ môn học đại học: Kinh tế lượng, Thống kê, Lập trình Web/App, Thuật toán, Tiểu luận Pháp luật, Tranh biện tiếng Anh, Slide bảo vệ luận văn... Đội ngũ học thuật sẵn sàng đồng hành cùng bạn!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs px-5 py-3 shadow-lg shadow-blue-500/25 transition cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Gửi yêu cầu môn học riêng</span>
                  </button>

                  <a
                    href="https://zalo.me"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-200 dark:border-luk-border bg-white dark:bg-luk-card text-slate-700 dark:text-luk-text font-semibold text-xs px-4 py-3 hover:bg-sky-50 dark:hover:bg-luk-border transition"
                  >
                    <span>Tư vấn qua Zalo</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 5. Custom Course Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200">
          <div
            className="w-full max-w-lg rounded-3xl border border-sky-200 dark:border-white/15 bg-white dark:bg-[#0c1022] shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 space-y-4"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Yêu Cầu Hỗ Trợ Môn Học Của Bạn
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-luk-muted">
                  Nhận báo giá minh bạch &amp; phương án làm bài trong 10-15 phút.
                </p>
              </div>
            </div>

            {requestSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Đã tiếp nhận yêu cầu thành công!
                </h4>
                <p className="text-xs text-slate-500 dark:text-luk-muted max-w-sm mx-auto">
                  Chuyên viên học thuật LUK Services sẽ liên hệ bạn qua số điện thoại/Zalo để tư vấn lộ trình và gửi báo giá ưu đãi sinh viên.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCustomRequestSubmit} className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-luk-text mb-1">
                      Họ tên / Nickname *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="vd: Minh Quân"
                      value={requestForm.name}
                      onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                      className="w-full rounded-xl border border-sky-200 dark:border-luk-border bg-slate-50 dark:bg-luk-bg px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-luk-text mb-1">
                      Số điện thoại / Zalo *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="vd: 0988.xxx.xxx"
                      value={requestForm.contact}
                      onChange={(e) => setRequestForm({ ...requestForm, contact: e.target.value })}
                      className="w-full rounded-xl border border-sky-200 dark:border-luk-border bg-slate-50 dark:bg-luk-bg px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-luk-text mb-1">
                      Trường đại học *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="vd: NEU, FTU, FPT, UEH..."
                      value={requestForm.university}
                      onChange={(e) => setRequestForm({ ...requestForm, university: e.target.value })}
                      className="w-full rounded-xl border border-sky-200 dark:border-luk-border bg-slate-50 dark:bg-luk-bg px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-luk-text mb-1">
                      Tên môn học cần hỗ trợ *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="vd: Kinh tế lượng, Web Next.js, Luật..."
                      value={requestForm.subjectName}
                      onChange={(e) => setRequestForm({ ...requestForm, subjectName: e.target.value })}
                      className="w-full rounded-xl border border-sky-200 dark:border-luk-border bg-slate-50 dark:bg-luk-bg px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-luk-text mb-1">
                    Yêu cầu chi tiết &amp; dạng hỗ trợ *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Mô tả đề bài, yêu cầu giảng viên (làm slide, sửa code, chạy SPSS, viết tiểu luận, làm video...)"
                    value={requestForm.details}
                    onChange={(e) => setRequestForm({ ...requestForm, details: e.target.value })}
                    className="w-full rounded-xl border border-sky-200 dark:border-luk-border bg-slate-50 dark:bg-luk-bg px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-luk-text mb-1">
                    Hạn nộp bài (Deadline)
                  </label>
                  <input
                    type="text"
                    placeholder="vd: 23:59 ngày 15/11 hoặc Cần gấp trong 24h"
                    value={requestForm.deadline}
                    onChange={(e) => setRequestForm({ ...requestForm, deadline: e.target.value })}
                    className="w-full rounded-xl border border-sky-200 dark:border-luk-border bg-slate-50 dark:bg-luk-bg px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-luk-border text-xs font-semibold text-slate-600 dark:text-luk-muted hover:bg-slate-50 dark:hover:bg-luk-border transition"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/30 transition"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Gửi yêu cầu ngay</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
