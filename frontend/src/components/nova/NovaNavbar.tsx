'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, ArrowUpRight, User } from 'lucide-react';
import { useApp } from '../providers/AppProvider';

export function NovaNavbar() {
  const pathname = usePathname();
  const { user, cartCount, openCartDrawer } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape or resize
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navLinks = [
    { label: 'Home', href: isHome ? '#hero' : '/' },
    { label: 'Services', href: isHome ? '#services' : '/#services' },
    { label: 'Our Work', href: isHome ? '#featured-work' : '/#featured-work' },
    { label: 'About', href: isHome ? '#why-nova' : '/#why-nova' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#') && isHome) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleStartNow = (e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById('services');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 select-none ${
          isScrolled || !isHome
            ? 'nova-glass border-b border-white/10 shadow-lg text-white'
            : 'bg-transparent text-white'
        }`}
      >
        <div className="mx-auto max-w-[1440px] h-full px-5 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Logo Left */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-transform duration-200 active:scale-95"
            aria-label="NOVA Homepage"
          >
            {/* Minimalist 4-pointed star icon */}
            <div className="relative flex items-center justify-center w-7 h-7 text-nova-champagne transition-transform duration-300 group-hover:rotate-45">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 filter drop-shadow-[0_0_8px_rgba(198,169,120,0.5)]"
              >
                <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
              </svg>
            </div>
            <span className="font-heading font-extrabold text-xl tracking-[0.25em] text-white">
              NOVA
            </span>
          </Link>

          {/* Navigation Center (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="relative text-sm font-medium text-slate-300 hover:text-white transition-colors py-1 group"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-nova-champagne transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Bag trigger if items exist or accessible */}
            <button
              type="button"
              onClick={() => openCartDrawer()}
              className="relative p-2 text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/5 active:scale-95"
              aria-label={`Giỏ hàng ${cartCount} dịch vụ`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-nova-champagne text-nova-navy text-[10px] font-bold flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            {user ? (
              <Link
                href="/account"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition"
              >
                <User className="w-4 h-4 text-nova-champagne" />
                <span className="max-w-[100px] truncate">{user.name || user.email}</span>
              </Link>
            ) : null}

            {/* Main CTA: Bắt đầu ngay ↗ */}
            <a
              href={isHome ? '#services' : '/#services'}
              onClick={handleStartNow}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 nova-glass-champagne text-nova-champagne hover:bg-nova-champagne hover:text-nova-navy hover:shadow-[0_0_20px_rgba(198,169,120,0.35)] active:scale-95"
            >
              <span>Bắt đầu ngay</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Mobile Hamburger Right */}
          <div className="flex md:hidden items-center gap-3">
            <button
              type="button"
              onClick={() => openCartDrawer()}
              className="relative p-2 text-slate-300 hover:text-white active:scale-95"
              aria-label={`Giỏ hàng ${cartCount} dịch vụ`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-nova-champagne text-nova-navy text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-white transition-colors"
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 nova-glass border-b border-white/10 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="text-base font-medium text-slate-200 hover:text-nova-champagne py-1.5 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <a
                href={isHome ? '#services' : '/#services'}
                onClick={handleStartNow}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-nova-champagne text-nova-navy font-semibold text-xs tracking-wider uppercase shadow-md active:scale-98"
              >
                <span>Bắt đầu ngay</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              {user ? (
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs text-slate-300 hover:text-white"
                >
                  Tài khoản của tôi ({user.name || user.email})
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs text-slate-400 hover:text-white"
                >
                  Đăng nhập tài khoản
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
