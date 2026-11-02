'use client';

import React from 'react';
import Link from 'next/link';

export function CinematicFooter() {
  return (
    <footer className="w-full border-t border-black/10 dark:border-white/10 py-16 px-6 sm:px-10 lg:px-16 z-10 relative transition-colors duration-500">
      <div className="max-w-[1536px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="font-heading italic text-3xl">LUK GLOBAL</span>
            <span className="text-[10px] uppercase tracking-widest font-body opacity-60">
              SERVICES
            </span>
          </div>
          <p className="text-xs font-body font-light max-w-sm opacity-70">
            Nền tảng thương mại điện tử dịch vụ học thuật và sáng tạo cao cấp dành cho sinh viên.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-body opacity-80">
          <Link href="/#capabilities" className="hover:opacity-100 transition">
            Edit Video
          </Link>
          <Link href="/#capabilities" className="hover:opacity-100 transition">
            Slide Đồ Án
          </Link>
          <Link href="/#capabilities" className="hover:opacity-100 transition">
            Transcript
          </Link>
          <Link href="/#capabilities" className="hover:opacity-100 transition">
            Debate BP
          </Link>
          <Link href="/#capabilities" className="hover:opacity-100 transition">
            Các AI Pro
          </Link>
          <Link href="/orders/track" className="hover:opacity-100 transition">
            Theo Dõi Đơn
          </Link>
        </div>

        <div className="text-xs font-body opacity-50">
          © 2026 LUK Global Services. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
