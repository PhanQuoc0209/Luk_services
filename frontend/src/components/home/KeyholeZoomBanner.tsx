/* Lucian UX/UI Prompt #205 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#205 */
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Waves, ArrowDown } from 'lucide-react';

interface LetterItem {
  el: HTMLSpanElement;
  x: number;
  y: number;
  v: number;
  isSpace: boolean;
}

export function KeyholeZoomBanner() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wdRef = useRef<HTMLDivElement>(null);
  // Default fixed wave height - locked so visitors cannot tamper with it
  const DEFAULT_AMP = 34;
  const [stars, setStars] = useState<Array<{ id: number; left: string; top: string; delay: string }>>([]);

  const WORD = 'LUK SERVICES';
  const SIG = 34;

  const ampRef = useRef(DEFAULT_AMP);

  const pxRef = useRef<number | null>(null);
  const pulseRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const lettersRef = useRef<LetterItem[]>([]);

  useEffect(() => {
    // Generate 60 twinkling celestial stars across wide horizon
    const newStars = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${(Math.random() * 100).toFixed(1)}%`,
      top: `${(Math.random() * 75).toFixed(1)}%`,
      delay: `${(Math.random() * 3).toFixed(2)}s`,
    }));
    setStars(newStars);
  }, []);

  const measure = useCallback(() => {
    lettersRef.current.forEach((l) => {
      l.x = l.el.offsetLeft + l.el.offsetWidth / 2;
    });
  }, []);

  const g = (d: number, s: number) => Math.exp(-(d * d) / (2 * s * s));

  const tick = useCallback((now: number) => {
    rafRef.current = 0;
    const wd = wdRef.current;
    if (!wd) return;

    let moving = false;
    let pc: number | null = null;

    if (pulseRef.current !== null) {
      const k = (now - pulseRef.current) / 1100;
      if (k >= 1) {
        pulseRef.current = null;
      } else {
        pc = -60 + (wd.offsetWidth + 120) * k;
      }
    }

    const currentAmp = ampRef.current;
    const px = pxRef.current;

    lettersRef.current.forEach((l) => {
      if (l.isSpace) return;
      let tgt = 0;
      if (px !== null) tgt -= currentAmp * g(l.x - px, SIG);
      if (pc !== null) tgt -= currentAmp * 1.35 * g(l.x - pc, SIG * 1.2);

      l.v += (tgt - l.y) * 0.16;
      l.v *= 0.8;
      l.y += l.v;

      if (Math.abs(l.v) > 0.02 || Math.abs(tgt - l.y) > 0.05) {
        moving = true;
      }

      const t = Math.min(1, Math.max(0, -l.y / 50));
      l.el.style.setProperty('--y', `${l.y.toFixed(2)}px`);
      l.el.style.setProperty(
        '--sy',
        (1 + Math.max(-0.08, Math.min(0.14, -l.v * 0.02))).toFixed(3)
      );
      l.el.style.setProperty('--t', t.toFixed(3));
    });

    if (moving || pulseRef.current !== null || px !== null) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [SIG]);

  const kick = useCallback(() => {
    if (typeof window !== 'undefined') {
      const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!rafRef.current && !rm) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
  }, [tick]);

  const sendWave = useCallback(() => {
    measure();
    pulseRef.current = performance.now();
    kick();
  }, [measure, kick]);

  // Setup letters once on mount
  useEffect(() => {
    const wd = wdRef.current;
    if (!wd) return;

    wd.innerHTML = '';
    const letters: LetterItem[] = [];

    Array.from(WORD).forEach((ch) => {
      const isSpace = ch === ' ';
      const s = document.createElement('span');
      s.className = isSpace ? 'u205-space' : 'u205-l';
      s.textContent = isSpace ? '\u00A0' : ch;
      s.setAttribute('aria-hidden', 'true');
      wd.appendChild(s);
      letters.push({ el: s, x: 0, y: 0, v: 0, isSpace });
    });

    lettersRef.current = letters;
    measure();

    const handlePointerMove = (e: PointerEvent) => {
      if (!lettersRef.current[0] || lettersRef.current[0].x === 0) measure();
      const r = wd.getBoundingClientRect();
      pxRef.current = (e.clientX - r.left) * (wd.offsetWidth / (r.width || 1));
      kick();
    };

    const handlePointerLeave = () => {
      pxRef.current = null;
      kick();
    };

    wd.addEventListener('pointermove', handlePointerMove);
    wd.addEventListener('pointerleave', handlePointerLeave);

    const handleTriggerWave = () => {
      sendWave();
    };
    window.addEventListener('luk-trigger-wave', handleTriggerWave);

    // Initial introductory wave on load
    const timer = setTimeout(() => {
      sendWave();
    }, 450);

    return () => {
      clearTimeout(timer);
      wd.removeEventListener('pointermove', handlePointerMove);
      wd.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('luk-trigger-wave', handleTriggerWave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [WORD, measure, kick, sendWave]);

  const scrollToServices = () => {
    const catalog = document.getElementById('services-catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="ux u205-hero" ref={rootRef}>
      {/* Background Starry Night & Silhouetted Horizon */}
      {stars.map((s) => (
        <span
          key={s.id}
          className="u205-star"
          aria-hidden="true"
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
          }}
        />
      ))}

      {/* Glowing Celestial Body (Sun in Day, Moon in Night) & Horizon */}
      <span className="u205-moon" aria-hidden="true" />
      <span className="u205-hill" aria-hidden="true" />
      <div className="u205-sea" aria-hidden="true" />

      {/* Day / Morning Clouds */}
      <div className="u205-day-clouds" aria-hidden="true">
        <span className="u205-cloud u205-cloud-1" />
        <span className="u205-cloud u205-cloud-2" />
        <span className="u205-cloud u205-cloud-3" />
      </div>

      {/* Rippling Letter Wordmark (Prompt #205) */}
      <div
        ref={wdRef}
        className="u205-wd"
        role="img"
        aria-label="LUK SERVICES - Logo chữ gợn sóng tương tác"
      />

      {/* Subtitle */}
      <div className="u205-sub">
        <span>Không Gian Sáng Tạo Sinh Viên &bull; Edit Chuẩn &bull; Transcript 99.5% &bull; Slide Đồ Án &bull; AI Pro</span>
      </div>

      {/* Footer Controls: Locked wave height, action buttons */}
      <div className="u205-ft-wrap">
        <div className="u205-ft u205-ft-actions-only">
          <div className="u205-actions mx-auto">
            <button
              type="button"
              className="u205-go"
              onClick={sendWave}
              title="Gửi đợt sóng chữ từ trái sang phải"
            >
              <Waves className="h-4 w-4" />
              <span>Tạo sóng hiệu ứng</span>
            </button>

            <button
              type="button"
              className="u205-scroll-btn"
              onClick={scrollToServices}
              title="Cuộn xuống danh sách 20 dịch vụ"
            >
              <span>Xem 20 Dịch Vụ</span>
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
