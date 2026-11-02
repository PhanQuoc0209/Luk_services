'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/providers/AppProvider';
import { formatVND } from '@/lib/vietqr';
import { ArrowRight, ShoppingBag, X, Trash2 } from 'lucide-react';

const FREE_THRESHOLD = 200000; // 200,000 VND for free bonus revisions & discount

export function CartDrawer() {
  const {
    isCartOpen,
    closeCartDrawer,
    cartItems,
    cartSubtotal,
    cartCount,
    updateCartItemQuantity,
    removeCartItemById,
  } = useApp();

  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (isCartOpen) {
      setTimeout(() => {
        closeBtnRef.current?.focus({ preventScroll: true });
      }, 150);
    }
  }, [isCartOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCartDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCartDrawer]);

  // Crucial: NEVER render into DOM if closed! (Prevents spilling onto page bottom)
  if (!isCartOpen) {
    return null;
  }

  const isUnlocked = cartSubtotal >= FREE_THRESHOLD;
  const progressPercent = Math.min(100, (cartSubtotal / FREE_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_THRESHOLD - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in-0 duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={closeCartDrawer}
      />

      {/* Slide-in Panel */}
      <aside
        className="relative w-full max-w-md bg-[#0f172a] text-white p-6 shadow-2xl z-10 flex flex-col justify-between border-l border-white/10 h-full animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="Giỏ hàng dịch vụ"
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-sky-400" />
              <h3 className="font-heading italic text-2xl text-white tracking-tight">
                Giỏ Hàng Dịch Vụ
              </h3>
              <span className="bg-sky-500/20 text-sky-300 text-xs px-2 py-0.5 rounded-full font-bold">
                {cartCount}
              </span>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeCartDrawer}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
              aria-label="Đóng giỏ hàng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Promotion / Free Revision Threshold */}
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 mb-4 text-xs font-body">
            <div className="flex justify-between items-center mb-1.5 text-white/80">
              <span>{isUnlocked ? '🎉 Đạt mốc ưu đãi duyệt 1-1!' : 'Ưu đãi sinh viên:'}</span>
              <span className="font-semibold text-sky-300">
                {isUnlocked ? 'Đã mở khóa' : `Còn ${formatVND(remaining)}`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-2 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-white/50 text-xs space-y-2">
              <ShoppingBag className="w-8 h-8 opacity-40" />
              <p>Giỏ hàng của bạn đang trống</p>
            </div>
          ) : (
            cartItems.map((item) => {
              const price = item.service?.startingPrice || 0;
              return (
                <div
                  key={item.id}
                  className="bg-white/5 rounded-xl p-3.5 border border-white/10 flex items-start gap-3 justify-between"
                >
                  <div className="flex-1 space-y-1">
                    <h5 className="font-heading italic text-lg text-white leading-snug line-clamp-1">
                      {item.service?.title}
                    </h5>
                    <div className="text-[11px] text-white/50">
                      ⚡ {item.service?.turnaround}
                    </div>
                    <div className="text-xs font-semibold text-sky-300 pt-1">
                      {price > 0 ? formatVND(price * item.quantity) : 'Báo giá'}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => removeCartItemById(item.id)}
                      className="text-white/40 hover:text-red-400 transition"
                      aria-label="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center bg-white/10 rounded-full px-2 py-0.5 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          item.quantity > 1 &&
                          updateCartItemQuantity(item.id, item.quantity - 1)
                        }
                        className="hover:text-sky-300"
                      >
                        −
                      </button>
                      <span className="font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          item.quantity < 9 &&
                          updateCartItemQuantity(item.id, item.quantity + 1)
                        }
                        className="hover:text-sky-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/70">Tạm tính ({cartCount} món)</span>
              <span className="font-heading italic text-2xl text-white">
                {formatVND(cartSubtotal)}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={closeCartDrawer}
              className="w-full bg-white text-black font-semibold text-sm py-3 rounded-full flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition shadow-lg"
            >
              <span>Tiến hành đặt dịch vụ</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
