'use client';

import React from 'react';

export const CATEGORIES = [
  { key: 'ALL', label: 'Tất cả sản phẩm' },
  { key: 'AI_ACCOUNTS', label: '🤖 Các AI Pro' },
  { key: 'VIDEO_EDITING', label: '🎬 Edit Chuẩn LUK' },
  { key: 'TRANSCRIPT_EDITING', label: '📝 Transcript Chuẩn LUK' },
  { key: 'SLIDE_DESIGN', label: '📊 Slide Chuẩn LUK' },
] as const;

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.key;
        return (
          <button
            key={cat.key}
            type="button"
            onClick={() => onSelectCategory(cat.key)}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border-transparent'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
