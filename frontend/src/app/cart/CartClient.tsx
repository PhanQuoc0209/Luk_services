'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, FileEdit } from 'lucide-react';
import { formatVND } from '@/lib/vietqr';
import { useApp } from '@/components/providers/AppProvider';

interface CartItemData {
  id: string;
  serviceId: string;
  quantity: number;
  itemNotes: string | null;
  service: {
    id: string;
    title: string;
    slug: string;
    category: string;
    startingPrice: number;
    turnaround: string;
    imageUrl: string;
  };
}

export function CartClient() {
  const router = useRouter();
  const { refreshCart } = useApp();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setItems(data.cart?.items || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: string, newQty: number) => {
    setUpdatingId(itemId);
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (res.ok) {
        if (newQty <= 0) {
          setItems((prev) => prev.filter((i) => i.id !== itemId));
        } else {
          setItems((prev) =>
            prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
          );
        }
        await refreshCart();
      }
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    setUpdatingId(itemId);
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
        await refreshCart();
      }
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  };

  const handleNoteChange = async (itemId: string, note: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, itemNotes: note } : i))
    );
    try {
      await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: items.find((i) => i.id === itemId)?.quantity || 1, itemNotes: note }),
      });
    } catch {
      // ignore
    }
  };

  const estimatedTotal = items.reduce(
    (sum, item) => sum + item.service.startingPrice * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-luk-blue border-t-transparent" />
        <p className="mt-3 text-xs text-luk-muted">Đang tải giỏ hàng của bạn...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-luk-card border border-luk-border text-luk-muted">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="text-lg font-bold text-white">Giỏ hàng của bạn đang trống</h1>
        <p className="text-xs text-luk-muted max-w-md mx-auto">
          Bạn chưa chọn dịch vụ nào. Khám phá các gói AI Pro, Edit Video, Transcript hoặc Thiết kế Slide để bắt đầu.
        </p>
        <div className="pt-2">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-luk-blue px-4 py-2.5 text-xs font-semibold text-white hover:bg-luk-blueHover shadow-md transition"
          >
            <span>Khám phá dịch vụ ngay</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-luk-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-luk-blueLight" />
            <span>Giỏ hàng dịch vụ ({items.length})</span>
          </h1>
          <p className="text-xs text-luk-muted mt-1">
            Xem lại các dịch vụ đã chọn trước khi điền thông tin chi tiết và gửi yêu cầu báo giá
          </p>
        </div>
        <Link
          href="/services"
          className="hidden sm:flex items-center gap-1.5 text-xs text-luk-muted hover:text-luk-text transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Tiếp tục chọn thêm dịch vụ</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-luk-border bg-luk-card p-4 space-y-4 transition"
            >
              <div className="flex gap-4">
                <Link
                  href={`/services/${item.service.slug}`}
                  className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-luk-bg border border-luk-border"
                >
                  <img
                    src={item.service.imageUrl}
                    alt={item.service.title}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/services/${item.service.slug}`}
                      className="text-sm font-semibold text-white hover:text-blue-400 transition truncate"
                    >
                      {item.service.title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      disabled={updatingId === item.id}
                      className="text-luk-dim hover:text-red-400 transition p-1"
                      aria-label="Xóa mục này"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs text-luk-muted">
                    Thời gian cam kết: <span className="text-white font-medium">{item.service.turnaround}</span>
                  </p>

                  <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center rounded-lg border border-luk-border bg-luk-bg p-0.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updatingId === item.id || item.quantity <= 1}
                        className="flex h-6 w-6 items-center justify-center rounded text-luk-muted hover:text-white disabled:opacity-30"
                        aria-label="Giảm"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updatingId === item.id}
                        className="flex h-6 w-6 items-center justify-center rounded text-luk-muted hover:text-white"
                        aria-label="Tăng"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-luk-dim block">Tạm tính</span>
                      <span className="text-sm font-bold text-white">
                        {formatVND(item.service.startingPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specific item note */}
              <div className="border-t border-luk-border/60 pt-3">
                <div className="flex items-center gap-1.5 text-[11px] text-luk-muted mb-1">
                  <FileEdit className="h-3 w-3 text-luk-blueLight" />
                  <span>Ghi chú riêng cho dịch vụ này (tùy chọn):</span>
                </div>
                <input
                  type="text"
                  defaultValue={item.itemNotes || ''}
                  onBlur={(e) => handleNoteChange(item.id, e.target.value)}
                  placeholder="Ví dụ: Link drive tài liệu thô, yêu cầu đặc biệt..."
                  className="w-full rounded-md border border-luk-border bg-luk-bg px-3 py-1.5 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
                />
              </div>
            </div>
          ))}

          <Link
            href="/services"
            className="sm:hidden flex items-center justify-center gap-1.5 text-xs text-luk-muted hover:text-luk-text py-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Tiếp tục chọn thêm dịch vụ</span>
          </Link>
        </div>

        {/* Right: Summary & Checkout Button */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
          <div className="rounded-xl border border-luk-border bg-luk-card p-5 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-luk-border pb-3">
              Tóm tắt đơn dịch vụ
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-luk-muted">
                <span>Số lượng dịch vụ</span>
                <span className="text-white font-medium">{items.length} mục</span>
              </div>
              <div className="flex justify-between text-luk-muted">
                <span>Tổng giá ước tính</span>
                <span className="text-white font-medium">{formatVND(estimatedTotal)}</span>
              </div>
              <div className="flex justify-between text-luk-muted">
                <span>Phí xem xét & báo giá</span>
                <span className="text-emerald-400 font-medium">Miễn phí 0₫</span>
              </div>
            </div>

            <div className="rounded-lg bg-luk-bg p-3 border border-luk-border space-y-1">
              <span className="text-[10px] text-luk-dim uppercase font-bold block">Tổng tiền dự kiến</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-white">{formatVND(estimatedTotal)}</span>
                <span className="text-[10px] text-luk-dim">*Chờ admin báo giá chuẩn</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push('/checkout')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-luk-blue py-3 text-xs font-semibold text-white hover:bg-luk-blueHover active:scale-95 transition shadow-lg"
            >
              <span>Tiến hành gửi thông tin & Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="border-t border-luk-border pt-3 space-y-2 text-[11px] text-luk-dim leading-relaxed">
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  Thêm vào giỏ không kích hoạt thanh toán. Bạn chỉ thanh toán sau khi admin xem xét file và gửi báo giá chính xác.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
