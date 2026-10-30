/* Lucian UX/UI Prompt #339 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#339 */
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Check, Sparkles } from 'lucide-react';
import { formatVND } from '@/lib/vietqr';
import { ServiceCardData } from './ServiceCard';

interface DragSnapCardCarouselProps {
  services: ServiceCardData[];
  categoryTitle: string;
  categoryDescription?: string;
  categoryKey: string;
  onAddToCart: (serviceId: string) => void;
  addingId: string | null;
  addedId: string | null;
}

export function DragSnapCardCarousel({
  services,
  categoryTitle,
  categoryDescription,
  categoryKey,
  onAddToCart,
  addingId,
  addedId,
}: DragSnapCardCarouselProps) {
  const trRef = useRef<HTMLDivElement>(null);
  const rwRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const pvRef = useRef<HTMLButtonElement>(null);
  const nxRef = useRef<HTMLButtonElement>(null);

  const [xPos, setXPos] = useState<number>(0);
  const [canPrev, setCanPrev] = useState<boolean>(false);
  const [canNext, setCanNext] = useState<boolean>(true);

  // Drag & fling state refs
  const xRef = useRef<number>(0);
  const twRef = useRef<number>(0);
  const dragRef = useRef<{
    sx: number;
    x0: number;
    k: number;
    h: [number, number][];
    hasMoved: boolean;
  } | null>(null);

  // Step width (card 290px + gap 16px = 306px)
  const CARD_WIDTH = 290;
  const GAP = 16;
  const STEP = CARD_WIDTH + GAP;

  const getMaxX = useCallback(() => {
    if (!trRef.current) return 0;
    const containerW = trRef.current.clientWidth;
    const totalW = services.length * STEP - GAP + 48; // 24px padding on both sides
    return Math.max(0, totalW - containerW);
  }, [services.length, STEP]);

  const paint = useCallback(() => {
    const rw = rwRef.current;
    const bar = barRef.current;
    const maxX = getMaxX();
    const currX = xRef.current;

    if (rw) {
      rw.style.transform = `translateX(${(-currX).toFixed(1)}px)`;
    }

    if (bar && services.length > 0) {
      const p = maxX > 0 ? currX / maxX : 0;
      const barW = Math.min(100, Math.max(15, (100 / services.length) * 2));
      bar.style.width = `${barW}%`;
      bar.style.transform = `translateX(${p * (services.length / 2 - 1) * 100}%)`;
    }

    setCanPrev(currX > 1);
    setCanNext(currX < maxX - 1);
    setXPos(currX);
  }, [getMaxX, services.length]);

  const glide = useCallback(
    (to: number) => {
      const maxX = getMaxX();
      const target = Math.max(0, Math.min(maxX, to));
      cancelAnimationFrame(twRef.current);

      const rm =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (rm) {
        xRef.current = target;
        paint();
        return;
      }

      const from = xRef.current;
      const t0 = performance.now();
      const d = Math.min(650, 260 + Math.abs(target - from) * 0.9);

      const anim = (now: number) => {
        const k = Math.min(1, (now - t0) / d);
        const e = 1 - Math.pow(1 - k, 3); // ease-out cubic
        xRef.current = from + (target - from) * e;
        paint();
        if (k < 1) {
          twRef.current = requestAnimationFrame(anim);
        }
      };

      twRef.current = requestAnimationFrame(anim);
    },
    [getMaxX, paint]
  );

  const snap = useCallback(
    (v: number) => {
      const target = xRef.current + v * 0.28;
      return Math.round(target / STEP) * STEP;
    },
    [STEP]
  );

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      const maxX = getMaxX();
      if (xRef.current > maxX) {
        xRef.current = maxX;
      }
      paint();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getMaxX, paint]);

  // Reset to start when services change
  useEffect(() => {
    xRef.current = 0;
    paint();
  }, [services, paint]);

  // Pointer drag & touch event listeners
  useEffect(() => {
    const tr = trRef.current;
    if (!tr) return;

    const onPointerDown = (e: PointerEvent) => {
      // Don't drag if clicking buttons or links directly
      const targetEl = e.target as HTMLElement;
      if (targetEl.closest('button, a, input')) return;

      cancelAnimationFrame(twRef.current);
      const bounds = tr.getBoundingClientRect();
      const k = bounds.width > 0 ? 1 : 1;

      dragRef.current = {
        sx: e.clientX,
        x0: xRef.current,
        k,
        h: [[performance.now(), e.clientX]],
        hasMoved: false,
      };

      tr.classList.add('is-drag');
      try {
        tr.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const deltaX = (drag.sx - e.clientX) * drag.k;
      if (Math.abs(deltaX) > 4) {
        drag.hasMoved = true;
      }

      const maxX = getMaxX();
      let nextX = drag.x0 + deltaX;

      // Rubber-band resistance
      if (nextX < 0) {
        nextX = nextX / 3;
      } else if (nextX > maxX) {
        nextX = maxX + (nextX - maxX) / 3;
      }

      xRef.current = nextX;
      paint();

      drag.h.push([performance.now(), e.clientX]);
      if (drag.h.length > 6) drag.h.shift();
    };

    const onPointerUp = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const h = drag.h;
      const a = h[0];
      const b = h[h.length - 1];
      const dt = (b[0] - a[0]) / 1000;
      const v = dt > 0.01 ? (-(b[1] - a[1]) * drag.k) / dt : 0;

      dragRef.current = null;
      tr.classList.remove('is-drag');

      try {
        tr.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      const clampedV = Math.max(-1800, Math.min(1800, v));
      glide(snap(clampedV));
    };

    tr.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      tr.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [getMaxX, glide, paint, snap]);

  const handlePrev = () => {
    glide(Math.round(xRef.current / STEP) * STEP - STEP);
  };

  const handleNext = () => {
    glide(Math.round(xRef.current / STEP) * STEP + STEP);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    }
  };

  return (
    <div className="ux u339" aria-label="Khám phá dịch vụ LUK Services">
      {/* 1. Header with Controls and Title */}
      <div className="u339-hd">
        <div className="u339-hd-title">
          <small className="flex items-center gap-1.5 font-bold">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Lướt Xem Dịch Vụ Theo Thẻ
          </small>
          <b>{categoryTitle}</b>
          {categoryDescription && <p>{categoryDescription}</p>}
        </div>

        <div className="u339-hd-ctrls">
          <Link
            href={`/services?cat=${categoryKey}`}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 mr-2 transition"
          >
            <span>Xem {services.length} gói</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <button
            ref={pvRef}
            type="button"
            className="u339-pv"
            aria-label="Thẻ trước"
            disabled={!canPrev}
            onClick={handlePrev}
            title="Thẻ trước (←)"
          >
            <svg viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M9 2.5L4.5 7 9 11.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            ref={nxRef}
            type="button"
            className="u339-nx"
            aria-label="Thẻ kế tiếp"
            disabled={!canNext}
            onClick={handleNext}
            title="Thẻ kế tiếp (→)"
          >
            <svg viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M5 2.5L9.5 7 5 11.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. Drag & Snap Track */}
      <div
        ref={trRef}
        className="u339-tr"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Danh sách thẻ dịch vụ, kéo ngang để xem tiếp hoặc dùng phím mũi tên"
      >
        <div ref={rwRef} className="u339-rw">
          {services.map((service) => {
            const isJustAdded = addedId === service.id;
            const isCurrentlyAdding = addingId === service.id;

            return (
              <div key={service.id} className="u339-cd">
                {/* Thumbnail */}
                <div className="u339-th">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    loading="lazy"
                    draggable={false}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="u339-th-overlay" />
                  {service.isFeatured ? (
                    <span className="u339-th-badge featured">Nổi bật</span>
                  ) : (
                    <span className="u339-th-badge">{service.turnaround}</span>
                  )}
                </div>

                {/* Card Content & Action Buttons */}
                <div className="u339-mt">
                  <b title={service.title}>{service.title}</b>
                  <p title={service.shortDescription}>
                    {service.shortDescription}
                  </p>

                  <div className="u339-price-row">
                    <span className="u339-price-label">Báo giá từ</span>
                    <span className="u339-price-val">
                      {formatVND(service.startingPrice)}
                    </span>
                  </div>

                  <div className="u339-actions">
                    <button
                      type="button"
                      className="u339-btn-cart"
                      disabled={isCurrentlyAdding}
                      onClick={() => onAddToCart(service.id)}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-300" />
                          <span>Đã thêm</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Thêm giỏ</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/services/${service.slug}`}
                      className="u339-btn-view"
                    >
                      <span>Chi tiết</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom Snap Progress Bar Indicator */}
      <div className="u339-pg" aria-hidden="true">
        <i ref={barRef} />
      </div>
    </div>
  );
}
