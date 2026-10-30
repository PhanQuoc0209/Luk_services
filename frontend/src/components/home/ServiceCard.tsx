'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Check, Clock, Zap, ShieldCheck } from 'lucide-react';
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

export function ServiceCard({ service }: { service: ServiceCardData }) {
  const { refreshCart } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

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
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#131C2E] to-[#0C1424] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10">
      <div>
        {/* Realistic Card Image / Cover with zoom */}
        <Link
          href={`/services/${service.slug}`}
          className="relative block aspect-[16/10] w-full overflow-hidden bg-[#080E18]"
        >
          <img
            src={service.imageUrl}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            {isAiAccount ? (
              <span className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
                <Zap className="h-3 w-3" />
                AI Pro
              </span>
            ) : service.isFeatured ? (
              <span className="rounded-lg bg-amber-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">
                Chuẩn LUK
              </span>
            ) : null}

            {service.isPopular && (
              <span className="rounded-lg bg-rose-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">
                Hot
              </span>
            )}
          </div>

          {/* Turnaround / Delivery speed badge */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-lg bg-black/60 px-2.5 py-0.5 text-[11px] font-medium text-slate-200 backdrop-blur-md border border-white/10 z-10">
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

        {/* Content */}
        <div className="p-4 space-y-2">
          <Link href={`/services/${service.slug}`} className="block">
            <h3 className="text-sm font-bold text-slate-100 line-clamp-1 group-hover:text-blue-400 transition-colors duration-200">
              {service.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {service.shortDescription}
          </p>
        </div>
      </div>

      {/* Footer with Price and Add to Cart Button */}
      <div className="border-t border-white/10 p-4 pt-3 flex items-center justify-between gap-2 bg-black/20">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-medium tracking-wide">
            {isAiAccount ? 'Giá kích hoạt' : service.startingPrice > 0 ? 'Báo giá từ' : 'Hình thức'}
          </span>
          <span className="text-sm font-extrabold text-white">
            {service.startingPrice > 0 ? formatVND(service.startingPrice) : 'Liên hệ báo giá'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
            justAdded
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/20 active:scale-95'
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
              <span>{isAiAccount ? 'Mua ngay' : 'Thêm giỏ'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
