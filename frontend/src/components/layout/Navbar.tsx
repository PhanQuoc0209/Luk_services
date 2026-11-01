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
  Video,
  FileAudio,
  Presentation,
  Bot,
  Sparkles,
  ArrowRight,
  Phone,
  BookOpen,
  Palette,
  Scale,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../providers/AppProvider';
import { triggerCurtain } from '../common/CurtainPageTransition';
import { DayNightSkySwitch } from '../common/DayNightSkySwitch';

export interface ServiceCategoryDropdownItem {
  key: string;
  label: string;
  badge: string;
  description: string;
  curtainTitle: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  hoverBorder: string;
}

export const LUK_6_CATEGORIES: ServiceCategoryDropdownItem[] = [
  {
    key: 'VIDEO_EDITING',
    label: 'Edit Video Chuẩn LUK',
    badge: '5 gói',
    description: 'Thuyết trình, recap sự kiện CLB, podcast, lọc âm studio',
    curtainTitle: 'EDIT VIDEO CHUẨN LUK',
    href: '/services?cat=VIDEO_EDITING',
    icon: Video,
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    hoverBorder: 'hover:border-blue-500/30 hover:bg-blue-500/5',
  },
  {
    key: 'SLIDE_DESIGN',
    label: 'Thiết Kế Slide Đồ Án',
    badge: '5 gói',
    description: 'Slide khóa luận, bảo vệ đồ án tốt nghiệp, pitch deck',
    curtainTitle: 'SLIDE THUYẾT TRÌNH LUK',
    href: '/services?cat=SLIDE_DESIGN',
    icon: Presentation,
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    hoverBorder: 'hover:border-amber-500/30 hover:bg-amber-500/5',
  },
  {
    key: 'ACADEMIC_RESEARCH',
    label: 'Viết Bài & Research NCKH',
    badge: 'Học thuật',
    description: 'Đề cương NCKH, tổng quan tài liệu, chuẩn trích dẫn APA',
    curtainTitle: 'VIẾT BÀI & RESEARCH NCKH',
    href: '/services?cat=TRANSCRIPT_EDITING',
    icon: BookOpen,
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    hoverBorder: 'hover:border-emerald-500/30 hover:bg-emerald-500/5',
  },
  {
    key: 'DEBATE_RESOURCES',
    label: 'Tài Liệu Debate BP & NCKH',
    badge: '12 tài liệu',
    description: 'Giáo trình tranh biện BP, case study, đề cương phản biện',
    curtainTitle: 'TÀI LIỆU DEBATE & NCKH',
    href: '/debate',
    icon: Scale,
    iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    hoverBorder: 'hover:border-purple-500/30 hover:bg-purple-500/5',
  },
  {
    key: 'POSTER_DESIGN',
    label: 'Thiết Kế Poster & Ấn Phẩm',
    badge: 'Đồ họa',
    description: 'Poster hội thảo NCKH, infographic đồ án, ấn phẩm CLB',
    curtainTitle: 'THIẾT KẾ POSTER & ẤN PHẨM',
    href: '/services?cat=SLIDE_DESIGN',
    icon: Palette,
    iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    hoverBorder: 'hover:border-rose-500/30 hover:bg-rose-500/5',
  },
  {
    key: 'AI_ACCOUNTS',
    label: 'Dịch Vụ Khác & AI Pro',
    badge: 'Kích hoạt 5m',
    description: 'Tài khoản CapCut Pro, ChatGPT-4o, Gemini 2TB, Canva Pro',
    curtainTitle: 'TÀI KHOẢN AI PRO CHÍNH CHỦ',
    href: '/services?cat=AI_ACCOUNTS',
    icon: Bot,
    iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    hoverBorder: 'hover:border-indigo-500/30 hover:bg-indigo-500/5',
  },
];

export const SECONDARY_NAV_ITEMS = [
  {
    id: 'featured',
    label: '⭐ Dịch vụ nổi bật',
    href: '/#services-catalog',
    badge: 'Hot',
    curtainTitle: 'DỊCH VỤ NỔI BẬT LUK',
  },
  {
    id: 'ai-pro',
    label: '🤖 Tài khoản AI Pro',
    href: '/services?cat=AI_ACCOUNTS',
    badge: '5 phút',
    curtainTitle: 'TÀI KHOẢN AI PRO',
  },
  {
    id: 'video',
    label: '🎬 Edit Video',
    href: '/services?cat=VIDEO_EDITING',
    badge: null,
    curtainTitle: 'EDIT VIDEO CHUẨN LUK',
  },
  {
    id: 'transcript',
    label: '📝 Transcript',
    href: '/services?cat=TRANSCRIPT_EDITING',
    badge: '99.5%',
    curtainTitle: 'TRANSCRIPT CHUẨN LUK',
  },
  {
    id: 'slide',
    label: '📊 Slide Đồ Án',
    href: '/services?cat=SLIDE_DESIGN',
    badge: null,
    curtainTitle: 'SLIDE ĐỒ ÁN CHUẨN LUK',
  },
  {
    id: 'track',
    label: '📦 Theo dõi đơn hàng',
    href: '/orders/track',
    badge: null,
    curtainTitle: 'TRA CỨU ĐƠN HÀNG',
  },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    cartCount,
    unreadCount,
    setUser,
    openCartDrawer,
    openSideRail,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const categoryBtnRef = useRef<HTMLButtonElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdowns on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(target) &&
        !categoryBtnRef.current?.contains(target)
      ) {
        setCategoryDropdownOpen(false);
      }
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(target)
      ) {
        setAccountMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCategoryDropdownOpen(false);
        setAccountMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseEnterCategories = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setCategoryDropdownOpen(true);
  };

  const handleMouseLeaveCategories = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setCategoryDropdownOpen(false);
    }, 200);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    triggerCurtain(`TÌM KIẾM: "${query.toUpperCase()}"`, () => {
      router.push(`/services?q=${encodeURIComponent(query)}`);
      setMobileMenuOpen(false);
    });
  };

  const handleSelectCategory = (cat: ServiceCategoryDropdownItem) => {
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);

    triggerCurtain(cat.curtainTitle, () => {
      if (cat.href.startsWith('/#')) {
        if (pathname === '/') {
          const el = document.getElementById(cat.href.replace('/#', ''));
          el?.scrollIntoView({ behavior: 'smooth' });
        } else {
          router.push(cat.href);
        }
      } else {
        router.push(cat.href);
      }
    });
  };

  const handleNavClick = (item: (typeof SECONDARY_NAV_ITEMS)[0]) => {
    setMobileMenuOpen(false);
    triggerCurtain(item.curtainTitle, () => {
      if (item.href.startsWith('/#')) {
        if (pathname === '/') {
          const id = item.href.replace('/#', '');
          const el = document.getElementById(id);
          el?.scrollIntoView({ behavior: 'smooth' });
        } else {
          router.push(item.href);
        }
      } else {
        router.push(item.href);
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
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-200">
      {/* ========================================================================= */}
      {/* 1. MAIN HEADER (h-16: 64px)                                               */}
      {/* ========================================================================= */}
      <div className="w-full bg-white/95 dark:bg-[#0A0F1D]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-200">
        <div className="mx-auto max-w-[1536px] px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6 h-16">
          
          {/* LEFT: Logo & Category Dropdown Trigger */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* LUK Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
              aria-label="LUK Services Trang chủ"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-luk-red font-black text-white text-sm shadow-md shadow-rose-600/20 group-hover:scale-105 transition-transform">
                LUK
              </span>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Services
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                  Student Marketplace
                </span>
              </div>
            </Link>

            {/* Category Dropdown Button (Desktop) */}
            <div
              className="relative hidden md:block"
              onMouseEnter={handleMouseEnterCategories}
              onMouseLeave={handleMouseLeaveCategories}
            >
              <button
                ref={categoryBtnRef}
                type="button"
                onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                  categoryDropdownOpen
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-blue-500/50 hover:bg-slate-200/60 dark:hover:bg-white/10'
                }`}
                aria-expanded={categoryDropdownOpen}
                aria-haspopup="true"
              >
                <span>Danh mục dịch vụ</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    categoryDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Floating Menu with the 6 Distinct Categories */}
              {categoryDropdownOpen && (
                <div
                  ref={categoryDropdownRef}
                  className="absolute top-full left-0 mt-2 w-[480px] rounded-2xl border border-slate-200 dark:border-white/10 bg-white/98 dark:bg-[#0E1726]/98 backdrop-blur-xl shadow-2xl p-3 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
                  role="menu"
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10 flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Hệ Sinh Thái 6 Dịch Vụ LUK
                    </span>
                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-500/20">
                      Học thuật & Đồ án
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {LUK_6_CATEGORIES.map((cat) => {
                      const IconComp = cat.icon;
                      return (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => handleSelectCategory(cat)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border border-transparent ${cat.hoverBorder} text-left transition group cursor-pointer`}
                        >
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${cat.iconBg} shrink-0 group-hover:scale-105 transition-transform`}
                          >
                            <IconComp className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                                {cat.label}
                              </p>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {cat.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between px-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryDropdownOpen(false);
                        openSideRail();
                      }}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Mở thanh trượt danh mục chi tiết</span>
                      <span>→</span>
                    </button>
                    <Link
                      href="/services"
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white flex items-center gap-1"
                    >
                      <span>Xem tất cả dịch vụ</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Search Input + Submit Button */}
          <div className="flex-1 max-w-xl mx-2 hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm dịch vụ, đề tài, tài khoản AI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50/80 dark:bg-[#111C44]/50 pl-10 pr-24 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:bg-white dark:focus:bg-[#0E1726] focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Tìm kiếm</span>
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Hotline, Theme Switch, Notifications, Cart, Auth */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Hotline Link */}
            <a
              href="tel:0988888888"
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:border-blue-400 transition text-xs font-semibold"
              title="Hotline hỗ trợ sinh viên 24/7"
            >
              <Phone className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>0988.888.888</span>
            </a>

            {/* Theme Toggle (DayNightSkySwitch Prompt #021) */}
            <div className="flex items-center">
              <DayNightSkySwitch size="sm" />
            </div>

            {/* Notification Bell */}
            <Link
              href="/account/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:border-blue-400 transition"
              aria-label="Thông báo"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-luk-red px-1 text-[10px] font-bold text-white shadow">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => openCartDrawer()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50/60 dark:bg-blue-600/10 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-600/20 transition text-xs font-bold cursor-pointer"
              aria-label="Mở giỏ hàng"
            >
              <div className="relative flex items-center">
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-black px-1 shadow">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Giỏ hàng</span>
            </button>

            {/* User Account / Auth */}
            <div className="relative" ref={accountMenuRef}>
              {user ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-800 dark:text-white hover:border-blue-400 transition"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="max-w-[80px] truncate hidden md:inline">
                      {user.name}
                    </span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </button>

                  {accountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E1726] p-1.5 shadow-2xl z-50 animate-in fade-in-0 slide-in-from-top-1">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10 mb-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-400/10 transition"
                        >
                          <Shield className="h-3.5 w-3.5" />
                          <span>Quản trị hệ thống</span>
                        </Link>
                      )}

                      <Link
                        href="/account/orders"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                      >
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                        <span>Đơn hàng của tôi</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/login"
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-white transition"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm active:scale-95 transition"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 md:hidden"
              aria-label="Menu di động"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SECONDARY NAVBAR (h-11: 44px) - QUICK NAVIGATION                       */}
      {/* ========================================================================= */}
      <div className="w-full bg-slate-50/95 dark:bg-[#0E1726]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/5 shadow-xs transition-colors duration-200">
        <div className="mx-auto max-w-[1536px] px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-4 h-11">
          {/* Quick links list (horizontal scroll on mobile) */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
            {SECONDARY_NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href.split('?')[0]);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick SLA / Student Guarantee pill on desktop */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Kích hoạt 5 phút</span>
            </span>
            <span className="text-slate-300 dark:text-white/10">•</span>
            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Zap className="h-3.5 w-3.5" />
              <span>Bảo hành 1:1</span>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE MENU DRAWER                                                     */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-white/10 bg-white/98 dark:bg-[#0A0F1D]/98 backdrop-blur-xl px-4 py-4 shadow-2xl animate-in slide-in-from-top-2 space-y-4">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ, tài khoản AI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#111C44]/60 pl-9 pr-20 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-2.5 rounded-lg bg-blue-600 text-white text-[11px] font-semibold"
            >
              Tìm
            </button>
          </form>

          {/* Category Accordion */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
              className="flex w-full items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white"
            >
              <span>📂 6 Danh mục dịch vụ LUK</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  mobileCategoryOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {mobileCategoryOpen && (
              <div className="grid grid-cols-1 gap-1 pl-2 pt-1 border-l-2 border-blue-500/30">
                {LUK_6_CATEGORIES.map((cat) => {
                  const IconComp = cat.icon;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => handleSelectCategory(cat)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      <IconComp className="h-4 w-4 text-blue-500" />
                      <span>{cat.label}</span>
                      <span className="ml-auto text-[10px] text-slate-400">{cat.badge}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick links list */}
          <div className="space-y-1 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
              Điều hướng nhanh
            </p>
            {SECONDARY_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item)}
                className="flex w-full items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Hotline & Auth buttons in mobile */}
          <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-2">
            <a
              href="tel:0988888888"
              className="flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <Phone className="h-3.5 w-3.5 text-blue-600" />
              <span>Hotline sinh viên: 0988.888.888</span>
            </a>

            {!user && (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-white"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-sm"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
