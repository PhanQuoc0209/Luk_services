'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BANNER_SLIDES = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&h=650&q=80',
    alt: 'Sinh viên làm việc nhóm và nghiên cứu dự án',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&h=650&q=80',
    alt: 'Biên tập video và sản xuất nội dung số',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&h=650&q=80',
    alt: 'Thuyết trình học thuật và bảo vệ đồ án',
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&h=650&q=80',
    alt: 'Hội thảo tranh biện sinh viên và diễn đàn học thuật',
  },
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const isHoveredRef = useRef(false);

  const total = BANNER_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto transition every 5 seconds, pauses when hovered
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHoveredRef.current) {
        nextSlide();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Touch swipe handling for mobile
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-luk-card rounded-2xl border border-luk-border select-none shadow-lg"
      onMouseEnter={() => (isHoveredRef.current = true)}
      onMouseLeave={() => (isHoveredRef.current = false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Aspect Ratio Container (Fits nicely beside sidebar & promo cards) */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[350px] w-full overflow-hidden">
        {BANNER_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Pure image - strictly NO slogan or text overlay */}
              <img
                src={slide.imageUrl}
                alt={slide.alt}
                className="h-full w-full object-cover object-center"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-luk-bg/75 border border-luk-border/60 text-white backdrop-blur-sm hover:bg-luk-bg hover:border-luk-blue transition shadow-md"
        aria-label="Ảnh trước"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-luk-bg/75 border border-luk-border/60 text-white backdrop-blur-sm hover:bg-luk-bg hover:border-luk-blue transition shadow-md"
        aria-label="Ảnh tiếp theo"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {BANNER_SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex
                ? 'w-7 h-2 bg-luk-blue shadow-sm'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Chuyển đến ảnh ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
