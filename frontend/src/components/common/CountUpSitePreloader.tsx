/* Lucian UX/UI Prompt #256 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#256 */
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

export function CountUpSitePreloader() {
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSnap, setIsSnap] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startLoad = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // Snap closed
    setIsSnap(true);
    setIsOpen(false);
    setProgress(0);

    // Check reduced motion
    const rm =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (rm) {
      setProgress(100);
      setIsOpen(true);
      setIsSnap(false);
      return;
    }

    // Force brief reflow after snapping
    setTimeout(() => {
      setIsSnap(false);
      let v = 0;

      const step = () => {
        // Fast, smooth loading progress without long hesitations
        v = Math.min(100, v + 16 + Math.floor(Math.random() * 8));
        setProgress(v);

        if (v < 100) {
          timerRef.current = setTimeout(step, 22);
        } else {
          // Brief pause before split reveal, then immediately trigger wave on logo
          timerRef.current = setTimeout(() => {
            setIsOpen(true);
            setTimeout(() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('luk-trigger-wave'));
              }
            }, 120);
          }, 60);
        }
      };

      step();
    }, 40);
  }, []);

  useEffect(() => {
    // Run preloader on mount
    startLoad();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startLoad]);

  return (
    <div
      className={`ux u256-site-preloader ${isOpen ? 'is-open' : ''} ${isSnap ? 'is-snap' : ''}`}
      aria-hidden={isOpen}
    >
      {/* Loading Split Screens */}
      <div
        className="u256-ld"
        role="progressbar"
        aria-label="Đang tải dữ liệu LUK Services"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        {/* Top Half */}
        <div className="u256-hf u256-a">
          {/* Brand Wordmark at top */}
          <div className="u256-bn">
            <span className="u256-badge">LUK</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white leading-tight">
                LUK Services
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                Student Hub
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Half */}
        <div className="u256-hf u256-b" />

        {/* Progress bar without percentage number */}
        <div className="u256-ct">
          <small className="flex items-center gap-1.5 animate-pulse">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Đang kết nối hệ sinh thái LUK Services...
          </small>
          <div className="u256-br mt-2.5">
            <i style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Floating Replay Button */}
      <button
        type="button"
        className="u256-re"
        onClick={startLoad}
        aria-label="Tải lại hiệu ứng mở trang"
        title="Xem lại hiệu ứng mở trang LUK Services"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Reload</span>
      </button>
    </div>
  );
}
