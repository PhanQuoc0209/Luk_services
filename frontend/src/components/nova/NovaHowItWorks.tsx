'use client';

import React from 'react';
import { ScrollReveal } from './ScrollReveal';

export function NovaHowItWorks() {
  const steps = [
    {
      step: '01',
      action: 'Choose',
      description: 'Chọn dịch vụ phù hợp với nhu cầu của bạn.',
      details: 'Khám phá các giải pháp trong nhóm Create, Learn hoặc Grow.',
    },
    {
      step: '02',
      action: 'Share',
      description: 'Gửi yêu cầu và chia sẻ những thông tin cần thiết.',
      details: 'Đính kèm tài liệu, deadline, phong cách và yêu cầu cụ thể.',
    },
    {
      step: '03',
      action: 'Create',
      description: 'Đội ngũ NOVA tiếp nhận và trực tiếp thực hiện.',
      details: 'Đội ngũ in-house triển khai kỹ lưỡng, cập nhật tiến độ minh bạch.',
    },
    {
      step: '04',
      action: 'Receive',
      description: 'Nhận kết quả, kiểm tra và hoàn thiện theo quy trình.',
      details: 'Xem duyệt sản phẩm, hỗ trợ chỉnh sửa chu đáo đến khi hài lòng.',
    },
  ];

  return (
    <section
      id="how-it-works"
      aria-label="Quy trình làm việc tại NOVA"
      className="relative bg-nova-navy text-white py-28 sm:py-36 overflow-hidden border-t border-white/10"
    >
      {/* Background Subtle Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-nova-blue/20 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-20 sm:mb-24">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-nova-champagne" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-nova-champagne">
                How It Works
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-white leading-tight mb-4">
              Đơn giản hóa hành trình của bạn.
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-body leading-relaxed">
              Chỉ với vài bước, NOVA sẽ giúp bạn biến nhu cầu thành kết quả.
            </p>
          </ScrollReveal>
        </div>

        {/* Desktop: Horizontal Progression with Connecting Line */}
        <div className="hidden lg:grid grid-cols-4 gap-8 relative">
          {/* Thin connecting line across all 4 steps */}
          <div
            className="absolute top-8 left-12 right-12 h-[1px] bg-gradient-to-r from-nova-champagne/40 via-white/20 to-nova-champagne/40 z-0 pointer-events-none"
            aria-hidden="true"
          />

          {steps.map((item, index) => (
            <ScrollReveal key={item.step} delay={index * 120} className="relative z-10">
              <div className="space-y-4">
                {/* Giant Champagne Number */}
                <div className="flex items-baseline gap-2">
                  <span className="font-serif italic text-6xl text-nova-champagne leading-none">
                    {item.step}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-nova-champagne" />
                </div>

                {/* Step Action & Content */}
                <div className="pt-2">
                  <h3 className="text-xl font-heading font-bold text-white tracking-wide uppercase mb-2">
                    {item.action}
                  </h3>
                  <p className="text-sm font-medium text-slate-200 leading-relaxed mb-1.5">
                    {item.description}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile / Tablet: Vertical Progression */}
        <div className="lg:hidden space-y-10 relative">
          {/* Vertical connecting line */}
          <div
            className="absolute top-6 bottom-6 left-6 w-[1px] bg-nova-champagne/30 z-0 pointer-events-none"
            aria-hidden="true"
          />

          {steps.map((item, index) => (
            <ScrollReveal key={item.step} delay={index * 100} className="relative z-10 flex gap-6">
              <div className="shrink-0 w-12 flex flex-col items-center">
                <span className="font-serif italic text-4xl text-nova-champagne leading-none bg-nova-navy py-1">
                  {item.step}
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wide">
                  {item.action}
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {item.description}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.details}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
