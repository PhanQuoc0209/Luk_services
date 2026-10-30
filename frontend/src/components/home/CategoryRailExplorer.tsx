/* Lucian UX/UI Prompt #040 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#040 */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Check, Sparkles, LayoutGrid, List } from 'lucide-react';
import { formatVND } from '@/lib/vietqr';
import { useApp } from '../providers/AppProvider';
import { ServiceCardData } from './ServiceCard';
import { DragSnapCardCarousel } from './DragSnapCardCarousel';

interface CategoryItem {
  key: string;
  label: string;
  title: string;
  badge?: string;
  description: string;
  gradient: string;
  svgPath: React.ReactNode;
  services: ServiceCardData[];
}

interface CategoryRailExplorerProps {
  aiServices: ServiceCardData[];
  videoServices: ServiceCardData[];
  transcriptServices: ServiceCardData[];
  slideServices: ServiceCardData[];
  topContent?: React.ReactNode;
}

export function CategoryRailExplorer({
  aiServices,
  videoServices,
  transcriptServices,
  slideServices,
  topContent,
}: CategoryRailExplorerProps) {
  const { addToCartAndOpen, openSideRail } = useApp();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'list'>('carousel');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories: CategoryItem[] = [
    {
      key: 'AI_ACCOUNTS',
      label: 'Các AI Pro',
      title: 'Tài Khoản AI Pro: CapCut, ChatGPT & Gemini',
      badge: '5',
      description:
        'Nâng cấp tài khoản bản quyền chính chủ, mở khóa full tính năng VIP, kích hoạt siêu tốc 5 phút và bảo hành 1 đổi 1.',
      gradient: 'linear-gradient(140deg, #6366F1, #8B5CF6)',
      svgPath: (
        <>
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4M8 15h.01M16 15h.01" />
        </>
      ),
      services: aiServices,
    },
    {
      key: 'VIDEO_EDITING',
      label: 'Edit Chuẩn LUK',
      title: 'Edit Chuẩn LUK: Video Thuyết Trình & Recap Sự Kiện',
      badge: '5',
      description:
        'Biên tập highlight reel sự kiện CLB, video thuyết trình đồ án, lọc tạp âm và chèn phụ đề song ngữ chuẩn đại học.',
      gradient: 'linear-gradient(140deg, #3B82F6, #06B6D4)',
      svgPath: (
        <>
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </>
      ),
      services: videoServices,
    },
    {
      key: 'TRANSCRIPT_EDITING',
      label: 'Transcript LUK',
      title: 'Transcript Chuẩn LUK: Gỡ Băng & Dịch Phụ Đề Song Ngữ',
      badge: '5',
      description:
        'Gỡ băng phỏng vấn sâu NCKH định tính chính xác 99.5%, dịch phụ đề song ngữ SRT và auto-caption chữ nhảy style TikTok.',
      gradient: 'linear-gradient(140deg, #10B981, #059669)',
      svgPath: (
        <>
          <path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M2 15h10M2 19h6M2 11h14" />
        </>
      ),
      services: transcriptServices,
    },
    {
      key: 'SLIDE_DESIGN',
      label: 'Slide Chuẩn LUK',
      title: 'Slide Chuẩn LUK: Slide Thuyết Trình & Pitch Deck',
      badge: '5',
      description:
        'Thiết kế slide bảo vệ khóa luận tốt nghiệp, slide bài tập nhóm và pitch deck gọi vốn cuộc thi khởi nghiệp sinh viên.',
      gradient: 'linear-gradient(140deg, #F59E0B, #EA580C)',
      svgPath: (
        <>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </>
      ),
      services: slideServices,
    },
  ];

  useEffect(() => {
    const handleCatEvent = (e: CustomEvent<{ key: string }>) => {
      const idx = categories.findIndex((c) => c.key === e.detail.key);
      if (idx !== -1) {
        handleSelect(idx);
      }
    };
    window.addEventListener('luk-select-category' as any, handleCatEvent);
    return () =>
      window.removeEventListener('luk-select-category' as any, handleCatEvent);
  }, [categories]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('cat');
      if (cat) {
        const idx = categories.findIndex((c) => c.key === cat);
        if (idx !== -1) {
          handleSelect(idx);
        }
      }
    }
  }, [categories]);

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

  const activeCategory = categories[selectedIdx] || categories[0];

  return (
    <div className="w-full">
      <div className="ux u040">
        {/* Main Column: Full-Width Services aligned directly with website name */}
        <div className="u040-main w-full" aria-live="polite">
          {/* Top interfaces: Rolling Banner, Keyhole Zoom Banner, Horizontal Track Showcase */}
          {topContent}

          {/* Active Category Services Panel */}
          <section id="services-catalog" className="u040-service-panel w-full">
            {/* 4 Pillars Category Bar + Shortcut to Left Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-5 pb-3 border-b border-sky-200/70 dark:border-luk-border">
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat, i) => {
                  const isSelected = selectedIdx === i;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => handleSelect(i)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md shadow-blue-500/30'
                          : 'bg-white/95 dark:bg-luk-card/80 text-slate-700 dark:text-luk-muted hover:text-blue-600 dark:hover:text-luk-text hover:bg-sky-50 dark:hover:bg-luk-card border border-sky-200/80 dark:border-luk-border shadow-sm'
                      }`}
                    >
                      <span className="w-4 h-4 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                          {cat.svgPath}
                        </svg>
                      </span>
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-sky-100 dark:bg-luk-bg text-sky-700 dark:text-luk-dim'
                        }`}
                      >
                        {cat.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                {/* View Mode Toggle: Carousel (Prompt #339) vs Vertical List */}
                <div className="inline-flex items-center p-0.5 rounded-xl border border-sky-200/80 dark:border-luk-border bg-white/95 dark:bg-luk-card shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode('carousel')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      viewMode === 'carousel'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-luk-muted hover:text-blue-600 dark:hover:text-luk-text'
                    }`}
                    title="Hiển thị dạng thẻ lướt kéo thả (Prompt #339)"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Lướt thẻ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      viewMode === 'list'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-luk-muted hover:text-blue-600 dark:hover:text-luk-text'
                    }`}
                    title="Hiển thị dạng danh sách dọc"
                  >
                    <List className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Danh sách</span>
                  </button>
                </div>

                {/* Quick Launcher for Left Toolbar Drawer */}
                <button
                  type="button"
                  onClick={openSideRail}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200/80 dark:border-luk-border bg-white/95 dark:bg-luk-card px-3 py-2 text-xs font-medium text-slate-700 dark:text-luk-muted hover:text-blue-600 dark:hover:text-white hover:bg-sky-50 transition cursor-pointer shadow-sm"
                  title="Mở thanh công cụ dịch vụ bên trái"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  <span className="hidden md:inline">Thanh công cụ</span>
                </button>
              </div>
            </div>

            {/* Stickman Video Director Studio Highlight Banner when Video Editing is selected */}
            {activeCategory.key === 'VIDEO_EDITING' && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-3.5 backdrop-blur-sm">
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
                    <p className="text-[11.5px] text-luk-muted">
                      Đạo diễn video hoạt hình người que 60s, 6 cảnh storyboard, tự động hóa prompt Gemini Omni Flash &amp; dựng CapCut chuyên nghiệp.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-luk-muted">
                  <span className="rounded-full bg-luk-card px-2 py-0.5 border border-luk-border">Classic B&amp;W</span>
                  <span className="rounded-full bg-luk-card px-2 py-0.5 border border-luk-border">Tech &amp; Story</span>
                  <span className="rounded-full bg-luk-card px-2 py-0.5 border border-luk-border">Prehistoric</span>
                </div>
              </div>
            )}

            {viewMode === 'carousel' ? (
              /* Lucian UX/UI Prompt #339: Drag-and-snap card carousel */
              <DragSnapCardCarousel
                services={activeCategory.services}
                categoryTitle={activeCategory.title}
                categoryDescription={activeCategory.description}
                categoryKey={activeCategory.key}
                onAddToCart={handleAddToCart}
                addingId={addingId}
                addedId={addedId}
              />
            ) : (
              /* Vertical List View */
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-luk-border pb-4 mb-4">
                  <div>
                    <small className="flex items-center gap-1.5 text-blue-400 font-bold">
                      <Sparkles className="h-3.5 w-3.5" />
                      Hệ Sinh Thái Dịch Vụ Trọng Tâm
                    </small>
                    <h3
                      className={`text-luk-text font-bold text-xl ${
                        isSwapping ? 'swap' : ''
                      }`}
                    >
                      {activeCategory.title}
                    </h3>
                    <p className="text-xs text-luk-muted max-w-2xl leading-relaxed mt-0.5">
                      {activeCategory.description}
                    </p>
                  </div>

                  <Link
                    href={`/services?cat=${activeCategory.key}`}
                    className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-3.5 py-2 text-xs font-semibold transition group shrink-0"
                  >
                    <span>Xem tất cả {activeCategory.services.length} gói</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {activeCategory.services.map((service) => {
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
                        {/* Service Thumbnail */}
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

                        {/* Service Info */}
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

                        {/* Price & Quick Actions */}
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
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
