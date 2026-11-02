'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export function NovaFeaturedWork() {
  const projects = {
    featured: {
      category: 'Presentation & Design',
      title: 'Ideas Worth Presenting',
      subtitle:
        'Hệ thống slide pitch deck đồ án tốt nghiệp chuẩn bị cho hội đồng chuyên môn quốc tế. Kết hợp visual hierarchy rõ ràng và phong cách đồ họa tối giản sang trọng.',
      tag: 'Concept Project',
      year: '2026',
      imageUrl:
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=85',
    },
    secondary1: {
      category: 'Video Editing',
      title: 'Stories in Motion',
      subtitle:
        'Dựng phim ngắn và highlight reel cho chiến dịch sinh viên thường niên. Tiết tấu âm nhạc đồng bộ, xử lý âm thanh trong trẻo và title motion ấn tượng.',
      tag: 'Concept Project',
      year: '2026',
      imageUrl:
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    },
    secondary2: {
      category: 'CV & Portfolio',
      title: 'Your Next Chapter',
      subtitle:
        'Hồ sơ năng lực cá nhân và portfolio tương tác ứng tuyển chương trình thực tập sinh toàn cầu. Tối ưu hóa dự án trọng tâm và định vị bản sắc cá nhân.',
      tag: 'Concept Project',
      year: '2026',
      imageUrl:
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    },
  };

  return (
    <section
      id="featured-work"
      aria-label="Các dự án nổi bật của NOVA"
      className="relative bg-nova-ivory text-nova-navy py-28 sm:py-36 overflow-hidden border-t border-slate-200/70"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-nova-champagne" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-nova-slate">
                Featured Work
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-nova-navy leading-tight">
              Những ý tưởng{' '}
              <span className="font-serif italic font-normal text-nova-blue">
                xứng đáng được nhìn thấy.
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <p className="max-w-md text-sm sm:text-base text-nova-slate leading-relaxed font-body">
              Khám phá các sản phẩm sáng tạo và giải pháp mà NOVA có thể đồng hành cùng bạn thực hiện.
            </p>
          </ScrollReveal>
        </div>

        {/* Editorial Portfolio Showcase Grid */}
        <div className="space-y-8 sm:space-y-12">
          {/* 1. Large Featured Project */}
          <ScrollReveal delay={100}>
            <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-sm group">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Visual */}
                <div className="lg:col-span-8 relative min-h-[340px] sm:min-h-[460px] overflow-hidden bg-slate-950">
                  <img
                    src={projects.featured.imageUrl}
                    alt={projects.featured.title}
                    className="w-full h-full object-cover object-center filter brightness-[0.9] group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-nova-navy text-[10px] font-bold tracking-widest uppercase shadow-sm">
                    {projects.featured.tag}
                  </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-4 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs font-semibold uppercase tracking-widest text-nova-slate block">
                      {projects.featured.category} · {projects.featured.year}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-heading font-bold text-nova-navy tracking-tight">
                      {projects.featured.title}
                    </h3>
                    <p className="text-sm text-nova-slate leading-relaxed pt-2">
                      {projects.featured.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-serif italic text-nova-blue">Editorial Slide Standard</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-nova-navy group-hover:text-nova-blue uppercase tracking-wider transition-colors">
                      Chi tiết <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* 2 & 3. Secondary Projects with Different Proportions */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12">
            {/* Secondary 1 */}
            <ScrollReveal delay={200} className="md:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-sm flex flex-col justify-between h-full group">
                <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-950">
                  <img
                    src={projects.secondary1.imageUrl}
                    alt={projects.secondary1.title}
                    className="w-full h-full object-cover object-center filter brightness-[0.88] group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-nova-navy text-[10px] font-bold tracking-widest uppercase">
                    {projects.secondary1.tag}
                  </div>
                </div>

                <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-nova-slate block mb-1">
                      {projects.secondary1.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-nova-navy mb-2">
                      {projects.secondary1.title}
                    </h3>
                    <p className="text-sm text-nova-slate leading-relaxed">
                      {projects.secondary1.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-serif italic text-nova-blue">Short Film &amp; Recap</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-nova-navy group-hover:text-nova-blue uppercase tracking-wider transition-colors">
                      Xem concept <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Secondary 2 */}
            <ScrollReveal delay={300} className="md:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-sm flex flex-col justify-between h-full group">
                <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-950">
                  <img
                    src={projects.secondary2.imageUrl}
                    alt={projects.secondary2.title}
                    className="w-full h-full object-cover object-center filter brightness-[0.88] group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-nova-navy text-[10px] font-bold tracking-widest uppercase">
                    {projects.secondary2.tag}
                  </div>
                </div>

                <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-nova-slate block mb-1">
                      {projects.secondary2.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-nova-navy mb-2">
                      {projects.secondary2.title}
                    </h3>
                    <p className="text-sm text-nova-slate leading-relaxed">
                      {projects.secondary2.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-serif italic text-nova-blue">Career Identity &amp; Portfolio</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-nova-navy group-hover:text-nova-blue uppercase tracking-wider transition-colors">
                      Xem concept <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
