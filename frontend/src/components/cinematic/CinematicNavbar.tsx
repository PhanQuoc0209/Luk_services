'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/providers/AppProvider';

const NAV_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Edit Video', href: '/services?cat=VIDEO_EDITING' },
  { label: 'Slide Đồ Án', href: '/services?cat=SLIDE_DESIGN' },
  { label: 'Transcript', href: '/services?cat=TRANSCRIPT_EDITING' },
  { label: 'Debate BP', href: '/debate' },
  { label: 'Các AI Pro', href: '/services?cat=AI_ACCOUNTS' },
  { label: 'Theo dõi đơn', href: '/orders/track' },
];

export function CinematicNavbar() {
  const { cartCount, openCartDrawer } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-6 sm:px-8 lg:px-16 pointer-events-none">
      <div className="mx-auto max-w-[1536px] flex items-center justify-between pointer-events-auto">
        {/* Left: 48x48 liquid-glass circle with italic serif lowercase "a" / "L" */}
        <Link
          href="/"
          className="liquid-glass w-12 h-12 rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform"
          aria-label="LUK Services"
        >
          <span className="font-heading italic text-2xl leading-none select-none">
            a
          </span>
        </Link>

        {/* Center: liquid-glass pill (desktop only) */}
        <nav
          className="hidden lg:flex items-center liquid-glass rounded-full px-2 py-1.5 gap-1"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3.5 py-2 text-sm font-medium text-white/90 font-body hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* White pill button: Claim a Spot + ArrowUpRight icon */}
          <Link
            href="/services"
            className="ml-1 inline-flex items-center gap-1.5 bg-white text-black font-body font-semibold text-sm px-4 py-2 rounded-full whitespace-nowrap hover:bg-white/90 active:scale-95 transition-all shadow-md"
          >
            <span>Claim a Spot</span>
            <svg
              className="w-4 h-4 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </Link>
        </nav>

        {/* Right: 48x48 liquid-glass circle (Cart Drawer Button with Live Badge) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openCartDrawer()}
            className="liquid-glass w-12 h-12 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:scale-105 active:scale-95 transition-transform relative cursor-pointer"
            aria-label="Giỏ hàng"
          >
            <svg
              className="w-5 h-5 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white text-black font-body text-[10px] font-bold px-1 shadow">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden liquid-glass w-12 h-12 rounded-full flex items-center justify-center text-white/90 hover:text-white cursor-pointer"
            aria-label="Menu"
          >
            <svg
              className="w-5 h-5 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 liquid-glass-strong rounded-3xl p-5 space-y-3 pointer-events-auto border border-white/10 animate-in fade-in-0 zoom-in-95">
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-white/90 font-body hover:text-white hover:bg-white/5 rounded-xl transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-white text-black font-body font-semibold text-sm py-2.5 rounded-full"
            >
              Claim a Spot — Đặt Dịch Vụ
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
