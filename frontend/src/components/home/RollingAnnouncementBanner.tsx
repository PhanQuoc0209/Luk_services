/* Lucian UX/UI Prompt #073 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#073 */
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

export interface AnnouncementItem {
  tag: string;
  title: string;
  desc: string;
  href: string;
}

const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    tag: 'ƯU ĐÃI AI',
    title: 'Hệ sinh thái AI Pro bản quyền cho sinh viên',
    desc: 'Kích hoạt 5 phút · CapCut Pro, ChatGPT Plus, Gemini Advanced, Canva Pro',
    href: '/services?cat=AI_ACCOUNTS',
  },
  {
    tag: 'CHẤT LƯỢNG',
    title: 'Dịch vụ học thuật & đồ án Chuẩn LUK',
    desc: 'Edit video thuyết trình, transcript NCKH & thiết kế slide tốt nghiệp',
    href: '/services',
  },
  {
    tag: 'CAM KẾT',
    title: 'Chính sách bảo hành & hỗ trợ 1-1',
    desc: 'Bảo hành 1 đổi 1 suốt thời gian dùng · Duyệt nháp góp ý đến khi hài lòng',
    href: '/orders/track',
  },
  {
    tag: 'TÀI LIỆU',
    title: 'Kho tài liệu Debate BP & NCKH mở rộng',
    desc: 'Tải miễn phí case study, giáo trình tranh biện và mẫu đề cương đại học',
    href: '/debate',
  },
  {
    tag: '🎬 ĐẠO DIỄN AI',
    title: 'Stickman Video Director Studio — Đạo diễn video hoạt hình người que',
    desc: 'Tự động hóa kịch bản, storyboard 6 cảnh 60s, vẽ nhân vật hoạt họa & lồng tiếng sinh động',
    href: '/services?cat=VIDEO_EDITING',
  },
];

const DUR = 3800; // Duration per announcement in ms

export function RollingAnnouncementBanner({
  announcements = DEFAULT_ANNOUNCEMENTS,
}: {
  announcements?: AnnouncementItem[];
}) {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [isClosed, setIsClosed] = useState(false);
  const [paused, setPaused] = useState(false);

  const curRef = useRef(0);
  curRef.current = cur;
  const pausedRef = useRef(false);
  pausedRef.current = paused;
  const isClosedRef = useRef(false);
  isClosedRef.current = isClosed;

  const barRefs = useRef<(HTMLElement | null)[]>([]);
  const bellRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const show = useCallback(
    (nextIdx: number) => {
      const p = curRef.current;
      const next = (nextIdx + announcements.length) % announcements.length;
      setPrev(p);
      setCur(next);

      // Clean up previous item up animation after 600ms
      setTimeout(() => {
        setPrev(null);
      }, 600);

      // Reset segment bar progress
      barRefs.current.forEach((bar, k) => {
        if (bar) {
          bar.style.setProperty('--f', k < next ? '1' : '0');
        }
      });
    },
    [announcements.length]
  );

  const handleNext = () => {
    show(curRef.current + 1);
  };

  const handleClose = () => {
    setIsClosed(true);
    setTimeout(() => {
      bellRef.current?.focus({ preventScroll: true });
    }, 300);
  };

  const handleReopen = () => {
    setIsClosed(false);
    show(0);
    setTimeout(() => {
      closeBtnRef.current?.focus({ preventScroll: true });
    }, 200);
  };

  // Main timer loop with requestAnimationFrame
  useEffect(() => {
    let animId: number;
    let last = performance.now();
    let elapsed = 0;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let rm = mediaQuery.matches;

    const onMediaChange = (e: MediaQueryListEvent) => {
      rm = e.matches;
    };
    mediaQuery.addEventListener('change', onMediaChange);

    const loop = (now: number) => {
      const dt = now - last;
      last = now;

      if (!pausedRef.current && !isClosedRef.current && !rm) {
        elapsed += dt;
        const currentBar = barRefs.current[curRef.current];
        if (currentBar) {
          currentBar.style.setProperty(
            '--f',
            Math.min(1, elapsed / DUR).toFixed(3)
          );
        }

        if (elapsed >= DUR) {
          elapsed = 0;
          show(curRef.current + 1);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      mediaQuery.removeEventListener('change', onMediaChange);
    };
  }, [show]);

  return (
    <div className={`ux u073 ${isClosed ? 'is-closed' : ''}`}>
      {/* 1. Foldable Announcement Strip */}
      <div
        className="u073-ban"
        ref={bannerRef}
        inert={isClosed ? true : undefined}
      >
        <div>
          <div
            className="u073-bar"
            role="region"
            aria-label="Announcements"
            aria-roledescription="rotating banner"
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={(e) => {
              if (!e.currentTarget.contains(document.activeElement)) {
                setPaused(false);
              }
            }}
            onFocus={() => setPaused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setPaused(false);
              }
            }}
          >
            {/* Tag badge */}
            <span className="u073-tag">{announcements[cur]?.tag || 'NEW'}</span>

            {/* Rolling Messages */}
            <div className="u073-msgs" aria-live="polite">
              {announcements.map((item, idx) => {
                const isOn = idx === cur;
                const isUp = idx === prev && idx !== cur;

                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className={`u073-m ${isOn ? 'on' : ''} ${isUp ? 'up' : ''}`}
                    aria-hidden={!isOn}
                    tabIndex={isOn && !isClosed ? 0 : -1}
                  >
                    <b>{item.title}</b>
                    <span>{item.desc}</span>
                  </Link>
                );
              })}
            </div>

            {/* Progress Segment Bars */}
            <span className="u073-segs" aria-hidden="true">
              {announcements.map((_, idx) => (
                <i
                  key={idx}
                  ref={(el) => {
                    barRefs.current[idx] = el;
                  }}
                />
              ))}
            </span>

            {/* Next Button */}
            <button
              className="u073-b u073-nx"
              type="button"
              aria-label="Thông báo tiếp theo"
              title="Thông báo kế tiếp"
              tabIndex={isClosed ? -1 : 0}
              onClick={handleNext}
            >
              <svg viewBox="0 0 14 14">
                <path d="M5 3l4 4-4 4" />
              </svg>
            </button>

            {/* Close Button */}
            <button
              ref={closeBtnRef}
              className="u073-b u073-x"
              type="button"
              aria-label="Đóng thông báo"
              title="Đóng thông báo"
              tabIndex={isClosed ? -1 : 0}
              onClick={handleClose}
            >
              <svg viewBox="0 0 14 14">
                <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Reopen Bell Button (Visible when closed) */}
      <div className="u073-bell-holder">
        <button
          ref={bellRef}
          className="u073-bell"
          type="button"
          tabIndex={isClosed ? 0 : -1}
          aria-label="Mở lại thông báo"
          title="Xem thông báo mới"
          onClick={handleReopen}
        >
          <svg viewBox="0 0 17 17">
            <path d="M4 11.5V8a4.5 4.5 0 0 1 9 0v3.5l1 1H3zM7 14.5a1.6 1.6 0 0 0 3 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}
