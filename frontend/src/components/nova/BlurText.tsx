'use client';

import React, { useEffect, useRef, useState } from 'react';

interface BlurTextProps {
  text: string;
  className?: string;
  italicIndices?: number[]; // Words to style in serif italic
  italicClassName?: string;
  delayPerWord?: number; // ms
  initialDelay?: number; // ms
}

export function BlurText({
  text,
  className = '',
  italicIndices = [],
  italicClassName = 'font-serif italic font-normal text-nova-champagne',
  delayPerWord = 70,
  initialDelay = 100,
}: BlurTextProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLHeadingElement | HTMLSpanElement>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        setHasAnimated(true);
        return;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {words.map((word, idx) => {
        const isItalic = italicIndices.includes(idx);
        const delay = initialDelay + idx * delayPerWord;

        return (
          <span
            key={`${word}-${idx}`}
            className={`inline-block mr-[0.28em] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isItalic ? italicClassName : ''
            }`}
            style={{
              opacity: hasAnimated ? 1 : 0,
              filter: hasAnimated ? 'blur(0px)' : 'blur(10px)',
              transform: hasAnimated ? 'translateY(0px)' : 'translateY(24px)',
              transitionDelay: `${delay}ms`,
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}
