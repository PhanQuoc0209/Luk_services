'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Bell,
  Search,
  Menu,
  X,
  Shield,
  FileText,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  SearchCode,
  Flame,
  Bot,
  Video,
  FileAudio,
  Presentation,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../providers/AppProvider';
import { ExpandingTopBarSearch } from './ExpandingTopBarSearch';
import { triggerCurtain } from '../common/CurtainPageTransition';
import { DayNightSkySwitch } from '../common/DayNightSkySwitch';

export interface NavTabItem {
  id: string;
  label: string;
  curtainTitle: string;
  href?: string;
  catKey?: string;
}

export const NAV_TABS: NavTabItem[] = [
  { id: 'home', label: 'Trang chủ', curtainTitle: 'TRANG CHỦ LUK SERVICES', href: '/' },
  { id: 'ai', label: 'Các AI Pro', curtainTitle: 'HỆ SINH THÁI AI PRO', catKey: 'AI_ACCOUNTS' },
  { id: 'video', label: 'Edit Video', curtainTitle: 'EDIT VIDEO CHUẨN LUK', catKey: 'VIDEO_EDITING' },
  { id: 'transcript', label: 'Transcript', curtainTitle: 'TRANSCRIPT CHUẨN LUK', catKey: 'TRANSCRIPT_EDITING' },
  { id: 'slide', label: 'Slide Đồ Án', curtainTitle: 'SLIDE THUYẾT TRÌNH LUK', catKey: 'SLIDE_DESIGN' },
  { id: 'debate', label: 'Debate BP', curtainTitle: 'KHO TÀI LIỆU DEBATE & NCKH', href: '/debate' },
  { id: 'track', label: 'Theo dõi đơn', curtainTitle: 'TRA CỨU TIẾN ĐỘ ĐƠN HÀNG', href: '/orders/track' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    cartCount,
    unreadCount,
    setUser,
    theme,
    toggleTheme,
    openCartDrawer,
    isSideRailOpen,
    toggleSideRail,
  } = useApp();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  // Prompt #321 sliding pill navigation states
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const markerRef = useRef<HTMLSpanElement>(null);

  const updateMarker = (idx: number) => {
    const el = tabRefs.current[idx];
    const mk = markerRef.current;
    if (el && mk) {
      mk.style.left = `${el.offsetLeft}px`;
      mk.style.width = `${el.offsetWidth}px`;
    }
  };

  useEffect(() => {
    if (pathname === '/debate') {
      setActiveTabIdx(5);
    } else if (pathname === '/orders/track') {
      setActiveTabIdx(6);
    } else if (pathname === '/') {
      if (typeof window !== 'undefined') {
        const cat = new URLSearchParams(window.location.search).get('cat');
        if (cat === 'AI_ACCOUNTS') setActiveTabIdx(1);
        else if (cat === 'VIDEO_EDITING') setActiveTabIdx(2);
        else if (cat === 'TRANSCRIPT_EDITING') setActiveTabIdx(3);
        else if (cat === 'SLIDE_DESIGN') setActiveTabIdx(4);
        else setActiveTabIdx(0);
      }
    }
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateMarker(activeTabIdx);
    }, 80);
    return () => clearTimeout(timer);
  }, [activeTabIdx]);

  const handleTabClick = (tab: NavTabItem, idx: number) => {
    setActiveTabIdx(idx);
    updateMarker(idx);

    triggerCurtain(tab.curtainTitle, () => {
      if (tab.catKey) {
        window.dispatchEvent(
          new CustomEvent('luk-select-category', { detail: { key: tab.catKey } })
        );
        if (pathname === '/') {
          const el = document.getElementById('services-catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          router.push(`/?cat=${tab.catKey}#services-catalog`);
        }
      } else if (tab.href) {
        if (tab.href === '/' && pathname === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          router.push(tab.href);
        }
      }
    });
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setAccountMenuOpen(false);
      window.location.href = '/';
    } catch {
      // ignore
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none transition-all duration-300">
      <div className="mx-auto max-w-[1536px] px-3 sm:px-6 lg:px-8 pt-2.5 sm:pt-3">
        <div
          className={`ux u027 ${
            isSearchOpen ? 'is-open' : ''
          } pointer-events-auto rounded-2xl sm:rounded-full border border-sky-200/80 dark:border-white/15 bg-white/85 dark:bg-[#0c1022]/85 backdrop-blur-xl shadow-[0_16px_36px_-10px_rgba(37,99,235,0.18)] dark:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.7)] transition-all duration-300 hover:border-sky-300 dark:hover:border-white/25`}
        >
          {/* Main Top Bar */}
          <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-5 relative">
            {/* 1. Left: Brand Wordmark (Fades & steps aside when search is open) - Click to toggle Side Category Rail Toolbar */}
            <button
              type="button"
              onClick={toggleSideRail}
              className={`u027-logo group text-left cursor-pointer transition focus:outline-none p-1 rounded-2xl ${
                isSideRailOpen
                  ? 'opacity-100 ring-2 ring-blue-500/50 bg-sky-50/80 dark:bg-white/5'
                  : 'hover:bg-sky-50/50 dark:hover:bg-white/5'
              }`}
              aria-label={
                isSideRailOpen
                  ? 'Đóng thanh công cụ dịch vụ LUK'
                  : 'Mở thanh công cụ dịch vụ LUK'
              }
              aria-expanded={isSideRailOpen}
              title="Bấm để mở danh mục dịch vụ LUK"
            >
              <span className="u027-logo-badge group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all">
                LUK
              </span>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-luk-text leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Services
                  </span>
                  <span
                    className={`inline-flex items-center justify-center h-4 w-4 rounded-full text-[10px] transition-all duration-200 ${
                      isSideRailOpen
                        ? 'bg-blue-600 text-white rotate-180'
                        : 'bg-sky-100 dark:bg-luk-card text-sky-700 dark:text-luk-muted group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-sky-200/60 dark:group-hover:bg-blue-500/10'
                    }`}
                  >
                    ▾
                  </span>
                </div>
                <span className="text-[9.5px] font-semibold uppercase tracking-wider text-sky-600 dark:text-luk-muted group-hover:text-sky-700 dark:group-hover:text-luk-text/80 transition-colors">
                  Student Hub
                </span>
              </div>
            </button>

          {/* 2. Main Navigation Links - Prompt #321 Capsule Pills with Sliding Marker */}
          <nav className="u027-nav hidden lg:flex items-center" aria-label="Main menu">
            <div className="u321-ls" role="navigation" aria-label="Menu dịch vụ">
              <span className="u321-mk" ref={markerRef} aria-hidden="true" />
              {NAV_TABS.map((tab, i) => {
                const isSelected = activeTabIdx === i;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    className={`u321-ln ${isSelected ? 'is-on' : ''}`}
                    aria-current={isSelected ? 'page' : undefined}
                    onClick={() => handleTabClick(tab, i)}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* 3. Expanding Top-Bar Search (Prompt #027) */}
          <ExpandingTopBarSearch
            isOpen={isSearchOpen}
            onOpenChange={setIsSearchOpen}
          />

          {/* 4. Right Controls: Theme Switch (#021), Notifications, Cart, Account */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Toggle: Lucian Prompt #021 Day-Night Sky Switch */}
            <DayNightSkySwitch size="sm" />

            {/* Notifications */}
            <Link
              href="/account/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-sky-200/80 dark:border-luk-border bg-white dark:bg-luk-card text-slate-600 dark:text-luk-muted hover:text-blue-600 dark:hover:text-luk-text hover:border-sky-400 dark:hover:border-luk-borderLight transition shadow-sm"
              aria-label="Thông báo"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-luk-red px-1 text-[10px] font-bold text-white shadow">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Cart Button with Count Badge -> Opens Prompt #240 Cart Drawer */}
            <button
              type="button"
              onClick={() => openCartDrawer()}
              className="flex items-center gap-2 rounded-xl border border-sky-200/80 dark:border-luk-border bg-white dark:bg-luk-card px-3 py-2 text-xs font-semibold text-slate-800 dark:text-luk-text hover:border-sky-400 dark:hover:border-luk-borderLight transition shadow-sm cursor-pointer"
              aria-label="Giỏ hàng"
            >
              <div className="relative">
                <ShoppingBag className="h-4 w-4 text-blue-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Giỏ hàng</span>
            </button>

            {/* User Account / Auth */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="flex items-center gap-2 rounded-xl border border-sky-200/80 dark:border-luk-border bg-white dark:bg-luk-card px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-luk-text hover:border-sky-400 dark:hover:border-luk-borderLight transition shadow-sm"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600/30 text-blue-400 font-bold text-[10px]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[85px] truncate hidden sm:inline">
                      {user.name}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-luk-muted" />
                  </button>

                  {accountMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 rounded-2xl border border-luk-border bg-luk-card p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-luk-border mb-1">
                        <p className="text-xs font-semibold text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-luk-muted truncate">
                          {user.email}
                        </p>
                      </div>

                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-amber-400 hover:bg-amber-400/10 transition"
                        >
                          <Shield className="h-3.5 w-3.5" />
                          Quản trị hệ thống
                        </Link>
                      )}

                      <Link
                        href="/account/orders"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-luk-text hover:bg-luk-bg transition"
                      >
                        <FileText className="h-3.5 w-3.5 text-luk-muted" />
                        Đơn hàng của tôi
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-400/10 transition"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/login"
                    className="rounded-xl border border-luk-border bg-luk-card px-3 py-1.5 text-xs font-medium text-luk-text hover:border-luk-borderLight hover:text-white transition"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="hidden sm:inline-block rounded-xl bg-luk-blue px-3 py-1.5 text-xs font-medium text-white hover:bg-luk-blueHover active:scale-95 transition"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-luk-border bg-luk-card text-luk-muted hover:text-white lg:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#0c1022]/95 backdrop-blur-xl px-4 py-4 rounded-b-2xl lg:hidden animate-in slide-in-from-top-2 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (mobileSearchQuery.trim()) {
                window.location.href = `/services?q=${encodeURIComponent(
                  mobileSearchQuery.trim()
                )}`;
                setMobileMenuOpen(false);
              }
            }}
            className="relative"
          >
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-luk-dim" />
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-luk-border bg-luk-bg pl-9 pr-3 py-2 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
            />
          </form>

          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-luk-dim px-2 mb-1">
              Menu điều hướng dịch vụ
            </p>
            {NAV_TABS.map((tab, idx) => {
              const isSelected = activeTabIdx === idx;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    handleTabClick(tab, idx);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-luk-text hover:bg-luk-bg'
                  }`}
                >
                  <span>{tab.label}</span>
                  <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-luk-dim" />
                </button>
              );
            })}
          </div>

          <div className="border-t border-luk-border pt-3 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-luk-dim px-2 mb-1">
              4 Nhóm dịch vụ trọng tâm
            </p>
            <Link
              href="/services?cat=AI_ACCOUNTS"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-indigo-400 hover:bg-luk-bg"
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Các AI Pro (CapCut, ChatGPT, Gemini)</span>
            </Link>
            <Link
              href="/services?cat=VIDEO_EDITING"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-blue-400 hover:bg-luk-bg"
            >
              <Video className="h-3.5 w-3.5" />
              <span>Edit Chuẩn LUK</span>
            </Link>
            <Link
              href="/services?cat=TRANSCRIPT_EDITING"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-luk-bg"
            >
              <FileAudio className="h-3.5 w-3.5" />
              <span>Transcript Chuẩn LUK</span>
            </Link>
            <Link
              href="/services?cat=SLIDE_DESIGN"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-amber-400 hover:bg-luk-bg"
            >
              <Presentation className="h-3.5 w-3.5" />
              <span>Slide Chuẩn LUK</span>
            </Link>
          </div>

          {/* Mobile Theme Toggle (Prompt #021) */}
          <div className="pt-2 border-t border-luk-border flex items-center justify-between px-3 py-1.5">
            <span className="text-xs font-medium text-luk-muted">
              Chế độ hiển thị (Sáng / Tối)
            </span>
            <DayNightSkySwitch size="sm" />
          </div>

          {!user && (
            <div className="flex gap-2 border-t border-luk-border pt-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 rounded-xl border border-luk-border bg-luk-bg py-2 text-center text-xs font-medium text-luk-text"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 rounded-xl bg-luk-blue py-2 text-center text-xs font-medium text-white"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      )}
        </div>
      </div>
    </header>
  );
}
