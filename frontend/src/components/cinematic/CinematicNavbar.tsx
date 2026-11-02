'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/components/providers/AppProvider';
import { DayNightSwitch } from './DayNightSwitch';

interface NavItem {
  label: string;
  categoryKey?: string;
  href: string;
}

const NAV_LINKS: NavItem[] = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Edit Video', categoryKey: 'VIDEO_EDITING', href: '/#capabilities' },
  { label: 'Slide Đồ Án', categoryKey: 'SLIDE_DESIGN', href: '/#capabilities' },
  { label: 'Transcript', categoryKey: 'TRANSCRIPT_EDITING', href: '/#capabilities' },
  { label: 'Debate BP', categoryKey: 'DEBATE_RESOURCES', href: '/#capabilities' },
  { label: 'Theo dõi đơn', href: '/orders/track' },
];

export function CinematicNavbar() {
  const pathname = usePathname();
  const { cartCount, openCartDrawer } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.categoryKey && pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('capabilities');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      window.dispatchEvent(
        new CustomEvent('luk-open-capability', { detail: { categoryKey: item.categoryKey } })
      );
    }
  };

  const handleClaimSpot = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('capabilities');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-8 lg:px-16 pointer-events-none">
      <div className="mx-auto max-w-[1536px] flex items-center justify-between pointer-events-auto">
        {/* Left: 48x48 liquid-glass circle with italic serif letter */}
        <Link
          href="/"
          className="liquid-glass w-12 h-12 rounded-full flex items-center justify-center text-slate-900 dark:text-white hover:scale-105 active:scale-95 transition-transform"
          aria-label="LUK Services"
        >
          <span className="font-heading italic text-2xl leading-none select-none">
            L
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
              onClick={(e) => handleNavClick(e, link)}
              className="px-3.5 py-2 text-sm font-medium text-slate-800 dark:text-white/90 font-body hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* White/Dark pill button: Claim a Spot + ArrowUpRight icon */}
          <Link
            href="/#capabilities"
            onClick={handleClaimSpot}
            className="ml-1 inline-flex items-center gap-1.5 bg-slate-900 !text-white dark:bg-white dark:!text-black font-body font-semibold text-sm px-4 py-2 rounded-full whitespace-nowrap hover:opacity-90 active:scale-95 transition-all shadow-md"
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

        {/* Right: Day-Night Switch + Cart Drawer Button */}
        <div className="flex items-center gap-3">
          {/* Day-Night Switch from Uiverse.io by EddyBel */}
          <DayNightSwitch className="mr-1" />

          {/* Cart Drawer Button with Live Badge */}
          <button
            type="button"
            onClick={() => openCartDrawer()}
            className="liquid-glass w-12 h-12 rounded-full flex items-center justify-center text-slate-800 dark:text-white/90 hover:text-slate-950 dark:hover:text-white hover:scale-105 active:scale-95 transition-transform relative cursor-pointer"
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
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-900 !text-white dark:bg-white dark:!text-black font-body text-[10px] font-bold px-1 shadow">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden liquid-glass w-12 h-12 rounded-full flex items-center justify-center text-slate-800 dark:text-white/90 hover:text-slate-950 dark:hover:text-white cursor-pointer"
            aria-label="Menu"
          >
            <svg
              className="w-5 h-5 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
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

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 mx-auto max-w-sm liquid-glass-strong rounded-2xl p-4 shadow-2xl border border-black/10 dark:border-white/10 pointer-events-auto space-y-2 backdrop-blur-2xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => {
                handleNavClick(e, link);
                setMobileMenuOpen(false);
              }}
              className="block px-4 py-2 text-sm text-slate-800 dark:text-white/90 hover:text-black dark:hover:text-white font-body"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#capabilities"
            onClick={(e) => {
              handleClaimSpot(e);
              setMobileMenuOpen(false);
            }}
            className="block text-center bg-slate-900 !text-white dark:bg-white dark:!text-black font-semibold text-xs py-2.5 rounded-full mt-2"
          >
            Claim a Spot →
          </Link>
        </div>
      )}
    </header>
  );
}
