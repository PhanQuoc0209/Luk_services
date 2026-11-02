'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatVND } from '@/lib/vietqr';
import { useApp } from '@/components/providers/AppProvider';

export interface ServiceItemData {
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
}

interface CinematicCatalogSectionProps {
  services: ServiceItemData[];
}

const CATEGORY_TABS = [
  { key: 'ALL', label: 'Tất cả dịch vụ' },
  { key: 'VIDEO_EDITING', label: 'Edit Video Chuẩn LUK' },
  { key: 'SLIDE_DESIGN', label: 'Slide Đồ Án' },
  { key: 'TRANSCRIPT_EDITING', label: 'Transcript & Phụ Đề' },
  { key: 'DEBATE_RESOURCES', label: 'Tài Liệu Debate BP' },
  { key: 'AI_ACCOUNTS', label: 'Tài Khoản AI Pro' },
];

export function CinematicCatalogSection({ services }: CinematicCatalogSectionProps) {
  const { addToCartAndOpen } = useApp();
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchCat = selectedCat === 'ALL' || s.category === selectedCat;
      const matchSearch =
        !searchQuery.trim() ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [services, selectedCat, searchQuery]);

  const handleAddToCart = async (serviceId: string) => {
    if (addingId) return;
    setAddingId(serviceId);
    try {
      await addToCartAndOpen(serviceId);
    } catch {
      // ignore
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section
      id="services-catalog"
      className="relative w-full bg-black text-white px-8 md:px-16 lg:px-20 py-24 border-t border-white/10 z-10"
    >
      <div className="max-w-[1536px] mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-sm font-body text-white/80 mb-3 tracking-wider">
              // Student Service Catalog
            </p>
            <h2 className="font-heading italic text-white text-5xl md:text-6xl tracking-[-2px] leading-tight">
              Khám Phá Toàn Bộ Dịch Vụ
            </h2>
            <p className="mt-2 text-sm text-white/80 font-body font-light max-w-xl">
              Chọn gói giải pháp phù hợp cho đồ án, bài tập lớn và nhu cầu học tập của bạn.
              Cam kết bảo mật, giao đúng hẹn và hỗ trợ sinh viên 24/7.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="liquid-glass rounded-full w-full px-5 py-2.5 text-xs text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/40"
            />
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = selectedCat === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedCat(tab.key)}
                className={`px-4 py-2 rounded-full text-xs font-medium font-body transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'liquid-glass text-white/80 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="liquid-glass rounded-[1.25rem] p-5 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300"
            >
              <div>
                {/* Thumbnail */}
                <Link
                  href={`/services/${item.slug}`}
                  className="block aspect-[16/10] w-full rounded-2xl overflow-hidden bg-white/5 mb-4 relative"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5 liquid-glass rounded-full px-2.5 py-0.5 text-[10px] text-white font-body">
                    {item.turnaround}
                  </div>
                </Link>

                {/* Title & Desc */}
                <Link href={`/services/${item.slug}`} className="block">
                  <h3 className="font-heading italic text-white text-2xl tracking-[-0.5px] leading-snug hover:text-white/80 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
                <p className="mt-2 text-xs text-white/70 font-body font-light line-clamp-2 leading-relaxed">
                  {item.shortDescription}
                </p>
              </div>

              {/* Price & Add to Cart */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-white/50 block font-body uppercase">
                    Báo giá từ
                  </span>
                  <span className="font-heading italic text-white text-xl">
                    {item.startingPrice > 0 ? formatVND(item.startingPrice) : 'Liên hệ'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/services/${item.slug}`}
                    className="liquid-glass rounded-full px-3 py-1.5 text-xs text-white/80 hover:text-white font-body"
                  >
                    Chi tiết
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item.id)}
                    disabled={addingId === item.id}
                    className="bg-white text-black font-body font-semibold text-xs px-3.5 py-1.5 rounded-full hover:bg-white/90 active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    {addingId === item.id ? 'Đang thêm...' : 'Thêm giỏ'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
