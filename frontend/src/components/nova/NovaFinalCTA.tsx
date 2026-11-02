'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export function NovaFinalCTA() {
  const handleScrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="final-cta"
      aria-label="Khởi đầu cùng NOVA"
      className="relative bg-nova-navy text-white py-32 sm:py-44 overflow-hidden select-none"
    >
      {/* Cinematic Background Visual with Atmosphere */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2000&q=85"
          alt="Không gian sáng tạo và sinh viên tiến bước cùng tương lai"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-[1.1] hover:scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nova-navy via-nova-navy/70 to-nova-navy/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-nova-navy via-transparent to-nova-navy" />
      </div>

      {/* Ambient Champagne Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-nova-champagne/15 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1000px] mx-auto px-5 sm:px-8 text-center flex flex-col items-center">
        <ScrollReveal>
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full nova-glass-champagne text-nova-champagne text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-nova-champagne" />
            <span>YOUR NEXT STEP STARTS HERE</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-extrabold tracking-tight text-white leading-[1.15] mb-6">
            Điều bạn muốn làm tiếp theo,{' '}
            <span className="font-serif italic font-normal text-nova-champagne block sm:inline">
              hãy bắt đầu cùng NOVA.
            </span>
          </h2>

          {/* Supporting Text */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-body leading-relaxed mb-10">
            Dù bạn đang có một ý tưởng, một mục tiêu học tập hay một kế hoạch cho tương lai,
            NOVA luôn sẵn sàng đồng hành.
          </p>

          {/* Big CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleScrollToServices}
              className="group inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full bg-nova-champagne text-nova-navy font-heading font-bold text-sm sm:text-base tracking-wide shadow-[0_10px_35px_rgba(198,169,120,0.35)] hover:bg-white transition-all duration-300 active:scale-95"
            >
              <span>Khám phá dịch vụ</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Three Descriptor */}
          <div className="mt-12 text-xs font-semibold text-slate-400 tracking-[0.25em] uppercase">
            <span>CREATE</span>
            <span className="mx-3 text-nova-champagne font-serif">·</span>
            <span>LEARN</span>
            <span className="mx-3 text-nova-champagne font-serif">·</span>
            <span>GROW</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
