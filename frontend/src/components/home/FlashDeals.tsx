'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Clock, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { formatVND } from '@/lib/vietqr';
import { useApp } from '../providers/AppProvider';

interface FlashDealItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  startingPrice: number;
  originalPrice: number;
  discountPercent: number;
  turnaround: string;
  imageUrl: string;
}

export function FlashDeals({ deals }: { deals: FlashDealItem[] }) {
  const { refreshCart } = useApp();
  const [addingId, setAddingId] = useState<string | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Live Countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 28,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 5, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = async (serviceId: string) => {
    if (addingId) return;
    setAddingId(serviceId);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, quantity: 1 }),
      });
      if (res.ok) {
        await refreshCart();
        setJustAddedId(serviceId);
        setTimeout(() => setJustAddedId(null), 2000);
      }
    } catch {
      // ignore
    } finally {
      setAddingId(null);
    }
  };

  if (!deals || deals.length === 0) return null;

  return (
    <section id="flash-deals" className="rounded-3xl border border-rose-500/20 bg-gradient-to-b from-[#180A12] via-[#0F1424] to-[#0A0E18] p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Flash Sale Header with Live Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 font-black text-white shadow-lg shadow-rose-500/25 animate-pulse">
            <Flame className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white">
                GIÁ SỐC HÔM NAY — DEAL SINH VIÊN
              </h2>
              <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 text-[10px] font-black uppercase text-rose-400 tracking-wider">
                Hot Deal
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Số lượng ưu đãi giới hạn cho các tài khoản AI Pro và gói dịch vụ chuẩn LUK
            </p>
          </div>
        </div>

        {/* Live Countdown Box */}
        <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-2xl self-start sm:self-auto shadow-inner">
          <Clock className="h-4 w-4 text-rose-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs text-slate-300 font-medium">Kết thúc trong:</span>
          <div className="flex items-center gap-1 font-mono font-black text-xs text-white">
            <span className="rounded-lg bg-white/10 border border-white/10 px-2 py-0.5 shadow-sm">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-rose-400 font-bold">:</span>
            <span className="rounded-lg bg-white/10 border border-white/10 px-2 py-0.5 shadow-sm">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-rose-400 font-bold">:</span>
            <span className="rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 px-2 py-0.5 shadow-sm">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Flash Deal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {deals.map((item) => {
          const isJustAdded = justAddedId === item.id;
          const isAdding = addingId === item.id;

          return (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#121A2C] overflow-hidden hover:border-rose-500/40 hover:-translate-y-1.5 transition-all duration-300 ease-out shadow-lg hover:shadow-rose-500/10"
            >
              <div>
                {/* Thumbnail with Discount Badge */}
                <Link href={`/services/${item.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-black/40">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-md">
                    -{item.discountPercent}%
                  </div>
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md border border-white/10">
                    <Clock className="h-3 w-3 text-rose-400" />
                    <span>{item.turnaround}</span>
                  </div>
                </Link>

                {/* Details */}
                <div className="p-4 space-y-1.5">
                  <Link href={`/services/${item.slug}`} className="block">
                    <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-rose-400 transition-colors duration-200">
                      {item.title}
                    </h3>
                  </Link>
                </div>
              </div>

              {/* Price Row & Add Button */}
              <div className="p-4 pt-0 border-t border-white/10 mt-2 space-y-3 bg-black/20">
                <div className="flex items-baseline justify-between pt-3">
                  <div>
                    <span className="text-sm font-extrabold text-rose-400 block leading-none">
                      {formatVND(item.startingPrice)}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through mt-0.5 block">
                      {formatVND(item.originalPrice)}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                    Tiết kiệm {formatVND(item.originalPrice - item.startingPrice)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddToCart(item.id)}
                  disabled={isAdding}
                  className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                    isJustAdded
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 shadow-md shadow-rose-600/25'
                  }`}
                >
                  {isJustAdded ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Đã thêm</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Thêm vào giỏ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
