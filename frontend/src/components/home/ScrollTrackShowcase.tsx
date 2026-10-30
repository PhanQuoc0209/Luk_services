/* Lucian UX/UI Prompt #241 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#241 */
'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface PanelItem {
  num: string;
  title: string;
  desc: string;
  bg: string;
  href: string;
  ctaText: string;
  shape: React.ReactNode;
}

const PANELS: PanelItem[] = [
  {
    num: '01',
    title: 'Hệ Sinh Thái AI Pro',
    desc: 'CapCut Pro, ChatGPT Plus (GPT-4o), Gemini Advanced 2TB, Canva Pro bản quyền chính chủ.',
    bg: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    href: '/services?cat=AI_ACCOUNTS',
    ctaText: 'Xem 5 gói AI Pro',
    shape: (
      <svg className="u241-sh" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="14" fill="#fff" />
        <circle cx="48" cy="18" r="6" fill="#fff" opacity="0.8" />
        <circle cx="16" cy="46" r="6" fill="#fff" opacity="0.8" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Edit Video Chuẩn LUK',
    desc: 'Biên tập video thuyết trình, highlight recap sự kiện CLB, lọc âm & phụ đề chuẩn phòng thu.',
    bg: 'linear-gradient(135deg, #0284C7, #2563EB)',
    href: '/services?cat=VIDEO_EDITING',
    ctaText: 'Xem 5 gói Video',
    shape: (
      <svg className="u241-sh" viewBox="0 0 64 64" aria-hidden="true">
        <path
          d="M32 56V30M32 34c-10 0-16-8-16-16 10 0 16 6 16 16zM32 30c8 0 14-6 14-14-8 0-14 6-14 14z"
          fill="none"
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Transcript Chuẩn LUK',
    desc: 'Gỡ băng phỏng vấn NCKH, dịch phụ đề song ngữ Anh - Việt định dạng SRT/VTT đồng bộ âm thanh.',
    bg: 'linear-gradient(135deg, #059669, #10B981)',
    href: '/services?cat=TRANSCRIPT_EDITING',
    ctaText: 'Xem 5 gói Transcript',
    shape: (
      <svg className="u241-sh" viewBox="0 0 64 64" aria-hidden="true">
        <path
          d="M32 60V8M32 26l-14-10M32 40l14-12"
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Slide Chuẩn LUK',
    desc: 'Thiết kế slide khóa luận tốt nghiệp, bảo vệ đồ án chuyên đề, pitch deck khởi nghiệp chuẩn học thuật.',
    bg: 'linear-gradient(135deg, #EA580C, #F59E0B)',
    href: '/services?cat=SLIDE_DESIGN',
    ctaText: 'Xem 5 gói Slide',
    shape: (
      <svg className="u241-sh" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="24" cy="38" r="14" fill="#fff" />
        <circle cx="42" cy="28" r="11" fill="#fff" opacity="0.7" />
      </svg>
    ),
  },
];

export function ScrollTrackShowcase() {
  const scRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<HTMLDivElement>(null);
  const vpRef = useRef<HTMLDivElement>(null);
  const trRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const dotRefs = useRef<(HTMLElement | null)[]>([]);

  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const sc = scRef.current;
    const run = runRef.current;
    const vp = vpRef.current;
    const tr = trRef.current;
    const bar = barRef.current;

    if (!sc || !run || !vp || !tr || !bar) return;

    let dist = 0;
    let raf = 0;

    const measure = () => {
      dist = Math.max(0, tr.scrollWidth - vp.clientWidth);
      run.style.height = `${380 + dist}px`;
    };

    const draw = () => {
      raf = 0;
      const y = Math.min(dist, sc.scrollTop);
      const p = dist ? y / dist : 0;

      tr.style.transform = `translateX(${-y.toFixed(1)}px)`;

      panelRefs.current.forEach((el) => {
        if (!el) return;
        const c = el.offsetLeft - y;
        const f = c / 334;

        const numEl = el.querySelector<HTMLElement>('.u241-n');
        if (numEl) {
          numEl.style.transform = `translateX(${(f * 26).toFixed(1)}px)`;
        }

        const shEl = el.querySelector<HTMLElement>('.u241-sh');
        if (shEl) {
          shEl.style.transform = `translateX(${(f * -18).toFixed(1)}px) rotate(${(
            f * -14
          ).toFixed(1)}deg)`;
        }
      });

      bar.style.transform = `scaleX(${p.toFixed(3)})`;
      const cur = Math.round(p * (PANELS.length - 1));
      setActiveDot(cur);
    };

    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(draw);
      }
    };

    sc.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);

    measure();
    draw();

    return () => {
      sc.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ux u241">
      <div
        ref={scRef}
        className="u241-sc"
        tabIndex={0}
        role="region"
        aria-label="4 Trụ cột dịch vụ LUK, cuộn chuột để di chuyển ngang"
      >
        <div ref={runRef} className="u241-run">
          <div className="u241-pin">
            {/* Header info */}
            <div className="u241-header">
              <p className="u241-k">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span>4 Trụ cột dịch vụ trọng tâm LUK</span>
              </p>
              <span className="u241-k-tag">Cuộn để xem toàn bộ</span>
            </div>

            {/* Viewport for horizontal track */}
            <div ref={vpRef} className="u241-vp">
              <div ref={trRef} className="u241-tr">
                {PANELS.map((panel, idx) => (
                  <section
                    key={panel.num}
                    ref={(el) => {
                      panelRefs.current[idx] = el;
                    }}
                    className="u241-p"
                    style={{ background: panel.bg }}
                  >
                    <span className="u241-n" aria-hidden="true">
                      {panel.num}
                    </span>
                    <b>{panel.title}</b>
                    <span>{panel.desc}</span>
                    {panel.shape}

                    <Link href={panel.href} className="u241-p-cta">
                      <span>{panel.ctaText}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </section>
                ))}
              </div>
            </div>

            {/* Bottom Progress Bar & Step Dots */}
            <div className="u241-ft">
              <div className="u241-bar" aria-hidden="true">
                <i ref={barRef} />
              </div>
              <div className="u241-dots" aria-hidden="true">
                {PANELS.map((_, idx) => (
                  <i
                    key={idx}
                    ref={(el) => {
                      dotRefs.current[idx] = el;
                    }}
                    className={idx === activeDot ? 'on' : ''}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ending Notice */}
        <div className="u241-after">
          <span>Khám phá 20 gói dịch vụ chi tiết trong thanh Side Rail bên dưới</span>
        </div>
      </div>
    </div>
  );
}
