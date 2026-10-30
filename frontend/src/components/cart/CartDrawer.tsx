/* Lucian UX/UI Prompt #240 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#240 */
'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/providers/AppProvider';
import { formatVND } from '@/lib/vietqr';
import { ArrowRight, ShoppingBag } from 'lucide-react';

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
    flashItemId,
    cartLoading,
  } = useApp();

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

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

  const isUnlocked = cartSubtotal >= FREE_THRESHOLD;
  const progressPercent = Math.min(100, (cartSubtotal / FREE_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_THRESHOLD - cartSubtotal);

  return (
    <div className={`ux u240 ${isCartOpen ? 'is-open' : ''}`}>
      {/* Background Overlay */}
      <div
        className="u240-ov"
        aria-hidden="true"
        onClick={closeCartDrawer}
      />

      {/* Slide-in Drawer */}
      <aside
        ref={drawerRef}
        className="u240-dr"
        role="dialog"
        aria-modal="true"
        aria-label="Giỏ hàng dịch vụ"
        aria-hidden={!isCartOpen}
      >
        {/* Header */}
        <div className="u240-dh">
          <b>
            <span>Giỏ hàng</span>
            <i className="u240-ct">{cartCount}</i>
          </b>
          <button
            ref={closeBtnRef}
            type="button"
            className="u240-x"
            aria-label="Đóng giỏ hàng"
            onClick={closeCartDrawer}
          >
            <svg viewBox="0 0 11 11" aria-hidden="true">
              <path
                d="M2 2l7 7M9 2L2 9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Free Shipping / Sinh viên Promotion Bar */}
        <div className={`u240-fs ${isUnlocked ? 'is-ok' : ''}`} aria-live="polite">
          <span className="u240-fm">
            {isUnlocked ? (
              <span>🎉 Bạn đã mở khóa <b>Ưu đãi duyệt nháp 1-1 & Voucher 20K</b>!</span>
            ) : (
              <span>
                Thêm <b>{formatVND(remaining)}</b> để mở khóa ưu đãi duyệt nháp & voucher 20K
              </span>
            )}
          </span>
          <div className="u240-bar">
            <i style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Items List */}
        <div className="u240-ls">
          {cartItems.length === 0 ? (
            <div className="u240-empty">
              <ShoppingBag className="h-10 w-10 mx-auto text-luk-dim mb-3 opacity-40" />
              <p>Giỏ hàng của bạn đang trống</p>
              <Link
                href="/services"
                onClick={closeCartDrawer}
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline mt-2 font-semibold"
              >
                <span>Khám phá dịch vụ ngay</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            cartItems.map((item) => {
              const isFlash = flashItemId === item.id || flashItemId === item.serviceId;
              const price = item.service.startingPrice || 0;

              return (
                <div
                  key={item.id}
                  className={`u240-it ${isFlash ? 'is-fl' : ''}`}
                >
                  <div>
                    <div className="u240-in">
                      {/* Thumbnail */}
                      <span className="u240-th">
                        <img
                          src={item.service.imageUrl}
                          alt={item.service.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </span>

                      {/* Info */}
                      <div className="u240-tx">
                        <b title={item.service.title}>{item.service.title}</b>
                        <small>{item.service.turnaround || 'Dịch vụ sinh viên'}</small>

                        {/* Quantity Stepper */}
                        <div className="u240-qt">
                          <button
                            type="button"
                            className="u240-mn"
                            aria-label="Giảm số lượng"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateCartItemQuantity(item.id, item.quantity - 1);
                              } else {
                                removeCartItemById(item.id);
                              }
                            }}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            className="u240-pl"
                            aria-label="Tăng số lượng"
                            onClick={() => {
                              if (item.quantity < 9) {
                                updateCartItemQuantity(item.id, item.quantity + 1);
                              }
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="u240-pr">
                        <span className="u240-lp">
                          {price > 0 ? formatVND(price * item.quantity) : 'Báo giá'}
                        </span>
                        <button
                          type="button"
                          className="u240-rm"
                          aria-label={`Xóa ${item.service.title}`}
                          title="Xóa khỏi giỏ"
                          onClick={() => removeCartItemById(item.id)}
                        >
                          <svg viewBox="0 0 12 12" aria-hidden="true">
                            <path
                              d="M2.5 3.5h7M4.8 3.5V2.3h2.4v1.2M3.5 3.5l.5 6.2h4l.5-6.2"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.3"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout */}
        {cartItems.length > 0 && (
          <div className="u240-ft">
            <div className="u240-sm">
              <span>Tạm tính ({cartCount} món)</span>
              <b className="u240-tt">{formatVND(cartSubtotal)}</b>
            </div>

            <Link
              href="/checkout"
              onClick={closeCartDrawer}
              className="u240-ck"
            >
              <span>Tiến hành đặt dịch vụ</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
