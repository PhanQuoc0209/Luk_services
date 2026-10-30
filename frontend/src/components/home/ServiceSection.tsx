'use client';

import React, { useState, useMemo } from 'react';
import { CategoryFilter } from './CategoryFilter';
import { ServiceCard, ServiceCardData } from './ServiceCard';
import { Layers, ArrowUpDown, Search, X } from 'lucide-react';

export function ServiceSection({
  initialServices,
}: {
  initialServices: ServiceCardData[];
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'popular'>('default');

  const processedServices = useMemo(() => {
    let list = [...initialServices];

    // Category filter
    if (selectedCategory !== 'ALL') {
      list = list.filter((s) => s.category === selectedCategory);
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sortBy === 'popular') {
      list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return list;
  }, [initialServices, selectedCategory, search, sortBy]);

  return (
    <div className="space-y-6">
      {/* Category Header with Search & Sort */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 tracking-tight">
              <Layers className="h-4 w-4 text-blue-400" />
              <span>Danh Mục Dịch Vụ & Tài Khoản AI Chuẩn LUK</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Chọn nhóm để lọc nhanh sản phẩm bạn cần, thêm vào giỏ hàng và thanh toán VietQR tiện lợi
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2.5">
            {/* Quick search input */}
            <div className="relative w-48 sm:w-60">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm AI, video, slide, transcript..."
                className="w-full rounded-full border border-white/10 bg-black/40 pl-9 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none transition shadow-inner"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-slate-300">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="default" className="bg-[#0B0F19] text-white">Mặc định</option>
                <option value="price_asc" className="bg-[#0B0F19] text-white">Giá thấp → cao</option>
                <option value="price_desc" className="bg-[#0B0F19] text-white">Giá cao → thấp</option>
                <option value="popular" className="bg-[#0B0F19] text-white">Bán chạy nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Bar (Muakey Style) */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Grid of Services (Muakey 4-Column Layout) */}
      {processedServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {processedServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#101726] p-12 text-center space-y-3">
          <Layers className="mx-auto h-8 w-8 text-slate-500" />
          <p className="text-sm font-semibold text-white">Không tìm thấy sản phẩm phù hợp</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Không có kết quả nào khớp với bộ lọc hoặc từ khóa tìm kiếm của bạn.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('ALL');
              setSearch('');
              setSortBy('default');
            }}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition cursor-pointer"
          >
            Xem tất cả
          </button>
        </div>
      )}
    </div>
  );
}
