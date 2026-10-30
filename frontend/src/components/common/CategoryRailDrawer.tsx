/* Lucian UX/UI Prompt #040 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#040 */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X, Sparkles, BookOpen, SearchCode, ArrowRight } from 'lucide-react';
import { useApp } from '../providers/AppProvider';
import { triggerCurtain } from './CurtainPageTransition';

interface CategoryRailItem {
  key: string;
  label: string;
  title: string;
  badge?: string;
  description: string;
  gradient: string;
  svgPath: React.ReactNode;
}

const RAIL_CATEGORIES: CategoryRailItem[] = [
  {
    key: 'AI_ACCOUNTS',
    label: 'Các AI Pro',
    title: 'HỆ SINH THÁI AI PRO',
    badge: '5',
    description: 'CapCut Pro, ChatGPT Plus, Gemini Advanced, Canva Pro chính chủ.',
    gradient: 'linear-gradient(140deg, #6366F1, #8B5CF6)',
    svgPath: (
      <>
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4M8 15h.01M16 15h.01" />
      </>
    ),
  },
  {
    key: 'VIDEO_EDITING',
    label: 'Edit Chuẩn LUK',
    title: 'EDIT VIDEO CHUẨN LUK',
    badge: '5',
    description: 'Video thuyết trình, highlight recap sự kiện, lọc âm chuẩn phòng thu.',
    gradient: 'linear-gradient(140deg, #3B82F6, #06B6D4)',
    svgPath: (
      <>
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </>
    ),
  },
  {
    key: 'TRANSCRIPT_EDITING',
    label: 'Transcript LUK',
    title: 'TRANSCRIPT CHUẨN LUK',
    badge: '5',
    description: 'Gỡ băng phỏng vấn NCKH 99.5%, dịch phụ đề song ngữ SRT đồng bộ âm thanh.',
    gradient: 'linear-gradient(140deg, #10B981, #059669)',
    svgPath: (
      <>
        <path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M2 15h10M2 19h6M2 11h14" />
      </>
    ),
  },
  {
    key: 'SLIDE_DESIGN',
    label: 'Slide Chuẩn LUK',
    title: 'SLIDE THUYẾT TRÌNH LUK',
    badge: '5',
    description: 'Thiết kế slide khóa luận tốt nghiệp, bảo vệ đồ án, pitch deck học thuật.',
    gradient: 'linear-gradient(140deg, #F59E0B, #EA580C)',
    svgPath: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </>
    ),
  },
];

export function CategoryRailDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const { isSideRailOpen, closeSideRail } = useApp();

  const [isWide, setIsWide] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [hlTop, setHlTop] = useState(0);

  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement>(null);

  // Sync selected index with active category param or event
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cat = new URLSearchParams(window.location.search).get('cat');
      if (cat) {
        const idx = RAIL_CATEGORIES.findIndex((c) => c.key === cat);
        if (idx !== -1) setSelectedIdx(idx);
      }
    }
  }, [pathname]);

  // Update highlight pill position
  const updateHl = (idx: number) => {
    const btn = itemRefs.current[idx];
    if (btn && btn.parentElement) {
      setHlTop(btn.parentElement.offsetTop);
    }
  };

  useEffect(() => {
    updateHl(selectedIdx);
  }, [selectedIdx, isWide, isSideRailOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSideRailOpen) {
        closeSideRail();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSideRailOpen, closeSideRail]);

  const handleSelect = (category: CategoryRailItem, idx: number) => {
    setSelectedIdx(idx);
    updateHl(idx);
    closeSideRail();

    // Trigger Lucian UX/UI Prompt #321 Curtain Transition
    triggerCurtain(category.title, () => {
      window.dispatchEvent(
        new CustomEvent('luk-select-category', { detail: { key: category.key } })
      );

      if (pathname === '/') {
        const el = document.getElementById('services-catalog');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        router.push(`/?cat=${category.key}#services-catalog`);
      }
    });
  };

  const handleGoHome = () => {
    closeSideRail();
    triggerCurtain('TRANG CHỦ LUK SERVICES', () => {
      if (pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push('/');
      }
    });
  };

  return (
    <>
      {/* 1. Backdrop */}
      {isSideRailOpen && (
        <div
          className="u040-drawer-backdrop"
          onClick={closeSideRail}
          aria-hidden="true"
        />
      )}

      {/* 2. Slide-out Drawer Wrapping Prompt #040 Rail */}
      <div
        className={`u040-drawer-wrap ${isSideRailOpen ? 'is-open' : ''}`}
        ref={railRef}
        role="dialog"
        aria-modal="true"
        aria-label="Thanh công cụ dịch vụ LUK"
      >
        <div className={`ux u040 ${isWide ? 'is-wide' : ''}`}>
          <nav className="u040-rail" aria-label="Thanh công cụ dịch vụ">
            {/* Top Logo & Title Button */}
            <div className="flex items-center justify-between gap-1 w-full">
              <button
                type="button"
                onClick={handleGoHome}
                className="u040-top flex-1 text-left cursor-pointer focus:outline-none"
                title="Về đầu trang LUK Services"
              >
                <span className="u040-logo" aria-hidden="true">
                  LUK
                </span>
                <span className="u040-name">LUK Services</span>
              </button>

              {/* Close Button on Desktop/Mobile */}
              <button
                type="button"
                onClick={closeSideRail}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-luk-muted hover:text-white hover:bg-white/10 transition mr-1"
                aria-label="Đóng thanh công cụ"
                title="Đóng (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Expand / Collapse toggle button */}
            <button
              className="u040-tog"
              type="button"
              aria-expanded={isWide}
              aria-label={isWide ? 'Thu gọn thanh công cụ' : 'Mở rộng thanh công cụ'}
              onClick={() => setIsWide(!isWide)}
              title={isWide ? 'Thu gọn' : 'Mở rộng'}
            >
              <svg viewBox="0 0 16 16">
                <path d="M6 3.5L10.5 8 6 12.5" />
              </svg>
            </button>

            {/* 4 Core Pillars Navigation List */}
            <ul className="u040-nav">
              <li
                className="u040-hl"
                role="presentation"
                style={{ '--y': `${hlTop}px` } as React.CSSProperties}
              />
              {RAIL_CATEGORIES.map((cat, i) => {
                const isSelected = selectedIdx === i;
                return (
                  <li key={cat.key}>
                    <button
                      ref={(el) => {
                        itemRefs.current[i] = el;
                      }}
                      className="u040-it"
                      type="button"
                      style={{ '--i': i } as React.CSSProperties}
                      aria-current={isSelected ? 'page' : undefined}
                      onClick={() => handleSelect(cat, i)}
                      title={cat.description}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        {cat.svgPath}
                      </svg>
                      <span>{cat.label}</span>
                      {cat.badge && (
                        <em
                          className="u040-bd"
                          aria-label={`Số lượng: ${cat.badge}`}
                        >
                          {cat.badge}
                        </em>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Extra Shortcuts (Visible when expanded) */}
            {isWide && (
              <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    closeSideRail();
                    triggerCurtain('KHO TÀI LIỆU DEBATE & NCKH', () => {
                      router.push('/debate');
                    });
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs text-luk-muted hover:text-white hover:bg-white/5 transition text-left"
                >
                  <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="truncate">Kho Debate BP & NCKH</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeSideRail();
                    triggerCurtain('TRA CỨU TIẾN ĐỘ ĐƠN HÀNG', () => {
                      router.push('/orders/track');
                    });
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs text-luk-muted hover:text-white hover:bg-white/5 transition text-left"
                >
                  <SearchCode className="h-3.5 w-3.5 text-blue-400" />
                  <span className="truncate">Theo dõi đơn hàng</span>
                </button>
              </div>
            )}

            {/* 24/7 Live Support Footer */}
            <div
              className="u040-me mt-auto cursor-pointer"
              title="Hệ thống LUK Services luôn trực tuyến hỗ trợ sinh viên"
              onClick={() => {
                closeSideRail();
                const el = document.getElementById('services-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="u040-me-text">
                LUK Support
                <small>Trực tuyến 24/7</small>
              </span>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
