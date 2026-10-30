'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, Minus, Plus, Check } from 'lucide-react';
import { useApp } from '@/components/providers/AppProvider';

export function ServiceDetailActions({
  serviceId,
  serviceTitle,
}: {
  serviceId: string;
  serviceTitle: string;
}) {
  const router = useRouter();
  const { refreshCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          quantity,
          itemNotes: note || undefined,
        }),
      });

      if (res.ok) {
        await refreshCart();
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2500);
      }
    } catch {
      // ignore
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          quantity,
          itemNotes: note || undefined,
        }),
      });

      if (res.ok) {
        await refreshCart();
        router.push('/checkout');
      }
    } catch {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity & Notes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-luk-text">Số lượng / Gói:</label>
          <div className="flex items-center rounded-lg border border-luk-border bg-luk-bg p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex h-7 w-7 items-center justify-center rounded text-luk-muted hover:text-white disabled:opacity-30"
              aria-label="Giảm số lượng"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-7 w-7 items-center justify-center rounded text-luk-muted hover:text-white"
              aria-label="Tăng số lượng"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-luk-muted block mb-1">
            Ghi chú sơ bộ cho yêu cầu (tùy chọn):
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Ví dụ: Cần slide thuyết trình 20 trang môn Marketing, nộp trước thứ 6..."
            className="w-full rounded-lg border border-luk-border bg-luk-bg p-2.5 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : 'border border-luk-border bg-luk-card text-white hover:border-luk-blue hover:text-blue-400'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="h-4 w-4" />
              <span>Đã thêm vào giỏ hàng!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              <span>Thêm vào giỏ</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isAdding}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-luk-blue py-2.5 text-xs font-semibold text-white hover:bg-luk-blueHover active:scale-95 transition shadow-md"
        >
          <span>Đặt ngay & Điền thông tin</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
