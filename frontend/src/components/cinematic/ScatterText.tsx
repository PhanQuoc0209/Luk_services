// Lucian UX/UI Prompt #360 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#360
'use client';

import React, { useRef, useEffect } from 'react';

interface ScatterTextProps {
  text?: string;
  className?: string;
}

interface LetterObj {
  el: HTMLSpanElement | null;
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  vr: number;
  free: number;
  drag: boolean;
}

export function ScatterText({ text = 'LUK SERVICES', className = '' }: ScatterTextProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const wd = wordRef.current;
    if (!root || !wd) return;

    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    // Clear previous children
    wd.innerHTML = '';

    const letters: LetterObj[] = Array.from(text).map((ch, i) => {
      const s = document.createElement('span');
      s.className = 'u360-l select-none cursor-grab inline-block';
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--h', String(20 + i * 36));
      wd.appendChild(s);
      return { el: s, x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0, free: 0, drag: false };
    });

    wd.setAttribute('aria-label', `Scatter the letters · ${text}`);

    function getScale() {
      const r = root!.getBoundingClientRect();
      return root!.offsetWidth / (r.width || 1);
    }

    function tick(now: number) {
      raf = 0;
      if (!root || !root.isConnected) return;
      const W = root.offsetWidth;
      const H = root.offsetHeight;
      let alive = false;

      letters.forEach((l) => {
        if (!l.el) return;
        if (l.drag) {
          alive = true;
          return;
        }

        if (now < l.free) {
          l.vy += 0.05;
          l.vx *= 0.985;
          l.vy *= 0.985;
          l.vr *= 0.98;

          const bx = l.el.offsetLeft + wd!.offsetLeft;
          const by = l.el.offsetTop + wd!.offsetTop;
          const w = l.el.offsetWidth;
          const h = l.el.offsetHeight;

          if ((bx + l.x < 10 && l.vx < 0) || (bx + l.x + w > W - 10 && l.vx > 0)) {
            l.vx *= -0.8;
          }
          if ((by + l.y < 10 && l.vy < 0) || (by + l.y + h > H - 10 && l.vy > 0)) {
            l.vy *= -0.75;
          }
        } else {
          l.vx += -l.x * 0.06;
          l.vy += -l.y * 0.06;
          l.vr += -l.r * 0.06;
          l.vx *= 0.8;
          l.vy *= 0.8;
          l.vr *= 0.8;
        }

        l.x += l.vx;
        l.y += l.vy;
        l.r += l.vr;

        if (
          now < l.free ||
          Math.abs(l.x) + Math.abs(l.y) + Math.abs(l.r) > 0.1 ||
          Math.abs(l.vx) + Math.abs(l.vy) > 0.05
        ) {
          alive = true;
        } else {
          l.x = l.y = l.r = 0;
        }

        l.el.style.transform = `translate(${l.x.toFixed(1)}px,${l.y.toFixed(1)}px) rotate(${l.r.toFixed(1)}deg)`;
      });

      if (alive) {
        raf = requestAnimationFrame(tick);
      }
    }

    function kick() {
      if (!raf) {
        raf = requestAnimationFrame(tick);
      }
    }

    function scatter() {
      if (rm) return;
      const now = performance.now();
      letters.forEach((l, i) => {
        const a = Math.random() * Math.PI * 2;
        const sp = 7 + Math.random() * 8;
        l.vx = Math.cos(a) * sp;
        l.vy = Math.sin(a) * sp - 4;
        l.vr = (Math.random() - 0.5) * 35;
        l.free = now + 1400 + i * 60;
      });
      kick();
    }

    function home() {
      letters.forEach((l) => {
        l.free = 0;
      });
      kick();
    }

    // Pointer events for dragging individual letters
    letters.forEach((l) => {
      if (!l.el) return;
      let sx = 0;
      let sy = 0;
      let px = 0;
      let py = 0;
      let lt = 0;
      let moved = false;

      const onPointerDown = (e: PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        l.drag = true;
        moved = false;
        l.el?.classList.add('cursor-grabbing', 'z-20');

        const k = getScale();
        sx = e.clientX * k - l.x;
        sy = e.clientY * k - l.y;
        px = e.clientX * k;
        py = e.clientY * k;
        lt = performance.now();

        try {
          l.el?.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        kick();
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!l.drag || !l.el) return;
        const k = getScale();
        const cx = e.clientX * k;
        const cy = e.clientY * k;
        const now = performance.now();
        const dt = Math.max(8, now - lt);

        l.vx = ((cx - px) / dt) * 16;
        l.vy = ((cy - py) / dt) * 16;
        px = cx;
        py = cy;
        lt = now;

        l.x = cx - sx;
        l.y = cy - sy;
        l.r = Math.max(-30, Math.min(30, l.vx * 2));

        if (Math.abs(l.x) + Math.abs(l.y) > 4) {
          moved = true;
        }

        l.el.style.transform = `translate(${l.x.toFixed(1)}px,${l.y.toFixed(1)}px) rotate(${l.r.toFixed(1)}deg)`;
      };

      const onPointerUp = () => {
        if (!l.drag) return;
        l.drag = false;
        l.el?.classList.remove('cursor-grabbing', 'z-20');
        l.free = performance.now() + (moved ? 1000 : 0);
        l.vr = l.vx * 1.5;
        kick();
      };

      l.el.addEventListener('pointerdown', onPointerDown);
      l.el.addEventListener('pointermove', onPointerMove);
      l.el.addEventListener('pointerup', onPointerUp);
      l.el.addEventListener('pointercancel', onPointerUp);
    });

    const onWordClick = () => {
      scatter();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scatter();
      }
    };

    wd.addEventListener('click', onWordClick);
    wd.addEventListener('keydown', onKeyDown);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      wd.removeEventListener('click', onWordClick);
      wd.removeEventListener('keydown', onKeyDown);
    };
  }, [text]);

  return (
    <div
      ref={rootRef}
      className={`u360 relative w-full max-w-4xl mx-auto min-h-[160px] sm:min-h-[190px] flex flex-col items-center justify-center select-none touch-none ${className}`}
    >
      <style jsx>{`
        .u360-l {
          position: relative;
          display: inline-block;
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: clamp(3rem, 9vw, 6.5rem);
          line-height: 0.9;
          letter-spacing: -0.04em;
          color: #ffffff;
          text-shadow: 0 4px 24px rgba(255, 255, 255, 0.25), 0 0 40px rgba(255, 255, 255, 0.15);
          will-change: transform;
          user-select: none;
          -webkit-user-select: none;
        }
      `}</style>

      {/* Main interactive word */}
      <div
        ref={wordRef}
        role="button"
        tabIndex={0}
        aria-label={`Tap to scatter letters: ${text}`}
        className="u360-wd flex items-center justify-center flex-wrap gap-x-1 sm:gap-x-2.5 cursor-pointer outline-none transition-transform hover:scale-[1.02] active:scale-[0.99]"
      />

      {/* Subtle Hint */}
      <div className="mt-3 flex items-center gap-2 text-[11px] font-body text-white/50 tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-ping" />
        <span>Chạm vào chữ hoặc ném các ký tự tự do để trải nghiệm vật lý 360°</span>
      </div>
    </div>
  );
}
