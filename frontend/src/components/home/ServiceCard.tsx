'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Check, Clock, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { formatVND } from '@/lib/vietqr';
import { useApp } from '../providers/AppProvider';

export interface ServiceCardData {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  startingPrice: number;
  turnaround: string;
  deliveryFormat: string;
  imageUrl: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  isDemo?: boolean;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80';

export function ServiceCard({ service }: { service: ServiceCardData }) {
  const { refreshCart } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(service.imageUrl || FALLBACK_IMAGE);

  const isAiAccount = service.category === 'AI_ACCOUNTS';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;
    setIsAdding(true);

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          quantity: 1,
        }),
      });

      if (res.ok) {
        await refreshCart();
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
      }
    } catch {
      // ignore
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E1726] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5">
      {/* Top Part: Image Cover + Content */}
      <div className="flex flex-col flex-1">
        {/* Cover Image Container */}
        <Link
          href={`/services/${service.slug}`}
          className="relative block aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-[#080E18]"
        >
          <img
            src={imgSrc}
            alt={service.title}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Top-Left Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            {isAiAccount ? (
              <span className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs flex items-center gap-1">
                <Zap className="h-3 w-3" />
                AI Pro
              </span>
            ) : service.isFeatured ? (
              <span className="rounded-lg bg-luk-red px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                Chuẩn LUK
              </span>
            ) : null}

            {service.isPopular && (
              <span className="rounded-lg bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                Hot
              </span>
            )}
          </div>

          {/* Top-Right Turnaround / Speed Badge */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-lg bg-black/70 px-2.5 py-0.5 text-[10.5px] font-semibold text-slate-100 backdrop-blur-md border border-white/10 z-10">
            {isAiAccount ? (
              <>
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span>Bảo hành 1:1</span>
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 text-blue-400" />
                <span>{service.turnaround}</span>
              </>
            )}
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
          <div>
            <Link href={`/services/${service.slug}`} className="block">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {service.title}
              </h3>
            </Link>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mt-1.5 min-h-[2rem]">
              {service.shortDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Price + Two Action Buttons (Thêm giỏ + Chi tiết) */}
      <div className="mt-auto border-t border-slate-100 dark:border-white/10 p-3.5 pt-3 flex items-center justify-between gap-2 bg-slate-50/70 dark:bg-black/20">
        <div className="min-w-0">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium tracking-wide">
            {isAiAccount ? 'Giá kích hoạt' : service.startingPrice > 0 ? 'Báo giá từ' : 'Hình thức'}
          </span>
          <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate block">
            {service.startingPrice > 0 ? formatVND(service.startingPrice) : 'Liên hệ'}
          </span>
        </div>

        {/* Dual Actions: Add to Cart + View Details */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href={`/services/${service.slug}`}
            className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:border-blue-400 transition"
          >
            <span>Chi tiết</span>
            <ArrowRight className="h-3 w-3" />
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-xs'
            }`}
            aria-label={`Thêm ${service.title} vào giỏ`}
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Đã thêm</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Thêm giỏ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
