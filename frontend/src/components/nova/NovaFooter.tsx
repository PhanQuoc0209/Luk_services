'use client';

import React from 'react';
import Link from 'next/link';

export function NovaFooter() {
  const scrollTo = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      aria-label="Chân trang NOVA"
      className="bg-[#0A0F1A] text-slate-400 text-xs border-t border-white/10 py-16 sm:py-20 transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-14">
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Col 1: Brand & Positioning (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-6 h-6 text-nova-champagne">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
                </svg>
              </div>
              <span className="font-heading font-extrabold text-xl tracking-[0.25em] text-white">
                NOVA
              </span>
            </div>

            <p className="font-serif italic text-sm text-nova-champagne">
              Make more possible.
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Premium Student Service Platform — Đồng hành cùng sinh viên biến ý tưởng thành kết quả,
              học tập tự tin hơn và tiến gần hơn đến tương lai mong muốn.
            </p>

            <div className="pt-2 text-[11px] text-slate-500 uppercase tracking-widest">
              CREATE · LEARN · GROW
            </div>
          </div>

          {/* Col 2: Navigation (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('hero')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('services')}
                  className="hover:text-white transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('featured-work')}
                  className="hover:text-white transition-colors"
                >
                  Our Work
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('why-nova')}
                  className="hover:text-white transition-colors"
                >
                  About NOVA
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('how-it-works')}
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Directory (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2">
              Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-300 font-medium text-[11px] uppercase tracking-wider pt-0.5">
                CREATE
              </li>
              <li className="pl-2">
                <button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">
                  01. Video Editing
                </button>
              </li>
              <li className="pl-2">
                <button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">
                  02. Presentation &amp; Design
                </button>
              </li>
              <li className="pl-2">
                <button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">
                  03. Script &amp; Content Writing
                </button>
              </li>

              <li className="text-slate-300 font-medium text-[11px] uppercase tracking-wider pt-2">
                LEARN &amp; GROW
              </li>
              <li className="pl-2">
                <button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">
                  04. Tutoring &amp; Learning
                </button>
              </li>
              <li className="pl-2">
                <button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">
                  05. English Support
                </button>
              </li>
              <li className="pl-2">
                <button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">
                  06. CV &amp; Portfolio
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Standard (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2">
              Commitment
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p>• Đội ngũ chuyên trách trực tiếp</p>
              <p>• Đúng hạn &amp; chuẩn mực cao cấp</p>
              <p>• Bảo mật nội dung học thuật</p>
              <p>• Hỗ trợ chỉnh sửa theo quy trình</p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 NOVA Platform. All rights reserved. Built for university students.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Điều khoản dịch vụ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
