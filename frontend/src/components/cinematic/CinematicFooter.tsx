'use client';

import React from 'react';
import Link from 'next/link';

export function CinematicFooter() {
  return (
    <footer className="w-full bg-black text-white border-t border-white/10 py-16 px-8 md:px-16 lg:px-20 z-10 relative">
      <div className="max-w-[1536px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="font-heading italic text-3xl text-white">LUK</span>
            <span className="text-xs uppercase tracking-widest text-white/60 font-body">
              Services
            </span>
          </div>
          <p className="text-xs text-white/60 font-body font-light max-w-sm">
            Nền tảng thương mại điện tử dịch vụ học thuật và sáng tạo cao cấp dành cho sinh viên.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-white/70 font-body">
          <Link href="/services?cat=VIDEO_EDITING" className="hover:text-white transition">
            Edit Video
          </Link>
          <Link href="/services?cat=SLIDE_DESIGN" className="hover:text-white transition">
            Slide Đồ Án
          </Link>
          <Link href="/services?cat=TRANSCRIPT_EDITING" className="hover:text-white transition">
            Transcript
          </Link>
          <Link href="/debate" className="hover:text-white transition">
            Debate BP
          </Link>
          <Link href="/services?cat=AI_ACCOUNTS" className="hover:text-white transition">
            Các AI Pro
          </Link>
          <Link href="/orders/track" className="hover:text-white transition">
            Theo Dõi Đơn
          </Link>
        </div>

        <div className="text-xs text-white/50 font-body">
          © 2026 LUK Services. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
