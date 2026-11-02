'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { BlurText } from './BlurText';

export function NovaHero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      const offset = 70;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="hero"
      aria-label="NOVA Hero"
      className="relative min-h-[92vh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden bg-nova-navy select-none"
    >
      {/* Background Visual Layer with Subtle Parallax */}
      <div
        className="absolute inset-0 w-full h-[115%] -top-[7.5%] will-change-transform transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(0, ${scrollY * 0.18}px, 0) scale(1.04)`,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2400&q=85"
          alt="Sinh viên đại học sáng tạo và làm việc nhóm tại không gian hiện đại"
          className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08] saturate-[1.05]"
          loading="eager"
        />

        {/* Cinematic Gradient Overlays: delicate contrast without a heavy black block */}
        <div className="absolute inset-0 bg-gradient-to-t from-nova-navy via-nova-navy/40 to-nova-navy/70 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-nova-navy/30 to-nova-navy/80 pointer-events-none" />
      </div>

      {/* Hero Ambient Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-nova-blue/25 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-[1280px] w-full mx-auto px-5 sm:px-8 lg:px-12 pt-28 pb-16 flex flex-col items-center text-center">
        {/* Eyebrow badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full nova-glass-champagne text-nova-champagne text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-8 transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-nova-champagne animate-pulse" />
          <span>YOUR STUDENT JOURNEY, REIMAGINED</span>
        </div>

        {/* Main Headline with BlurText & Serif Italic accent */}
        <h1 className="max-w-4xl text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-heading font-extrabold text-white tracking-[-0.02em] leading-[1.12] mb-6 sm:mb-8">
          <BlurText
            text="Biến ý tưởng thành hiện thực. Tạo nên hành trình của riêng bạn."
            italicIndices={[6, 7, 8, 9, 10]}
            italicClassName="font-serif italic font-normal text-nova-champagne text-[1.12em] tracking-normal"
            delayPerWord={65}
            initialDelay={200}
          />
        </h1>

        {/* Supporting text */}
        <p
          className={`max-w-2xl text-base sm:text-lg md:text-xl text-slate-300 font-body leading-relaxed mb-10 transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          NOVA đồng hành cùng sinh viên trong sáng tạo, học tập và phát triển sự nghiệp — giúp bạn
          làm tốt hơn những điều mình muốn.
        </p>

        {/* Two CTAs */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '1000ms' }}
        >
          {/* Primary CTA */}
          <button
            type="button"
            onClick={() => handleScrollTo('services')}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-nova-navy font-heading font-semibold text-sm sm:text-base tracking-wide shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:bg-nova-champagne hover:text-nova-navy transition-all duration-300 hover:shadow-[0_10px_35px_rgba(198,169,120,0.4)] active:scale-95"
          >
            <span>Khám phá dịch vụ</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Secondary CTA */}
          <button
            type="button"
            onClick={() => handleScrollTo('why-nova')}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full nova-glass text-white font-heading font-medium text-sm sm:text-base border border-white/15 hover:border-nova-champagne/50 hover:bg-white/10 transition-all duration-300 active:scale-95"
          >
            <span>Tìm hiểu NOVA</span>
          </button>
        </div>

        {/* Three Pillar Descriptor */}
        <div
          className={`mt-12 sm:mt-14 inline-flex items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-400 tracking-[0.25em] uppercase transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '1200ms' }}
        >
          <span className="text-white hover:text-nova-champagne transition-colors">CREATE</span>
          <span className="text-nova-champagne font-serif text-sm">·</span>
          <span className="text-white hover:text-nova-champagne transition-colors">LEARN</span>
          <span className="text-nova-champagne font-serif text-sm">·</span>
          <span className="text-white hover:text-nova-champagne transition-colors">GROW</span>
        </div>
      </div>

      {/* Bottom Scroll Indicator Hint */}
      <button
        type="button"
        onClick={() => handleScrollTo('brand-statement')}
        aria-label="Cuộn xuống nội dung tiếp theo"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer group"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-slate-400 group-hover:text-nova-champagne transition-colors">
          Khám phá
        </span>
        <div className="w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
          <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-nova-champagne transition-colors" />
        </div>
      </button>
    </section>
  );
}
