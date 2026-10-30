'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Video, Film, X, Clapperboard, Lightbulb } from 'lucide-react';

export function StickmanDirectorBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [speechIdx, setSpeechIdx] = useState(0);

  const directorQuotes = [
    '🎬 "Cắt! Cảnh 1 diễn rất tự nhiên! Đạo diễn người que đã khóa phong cách nhân vật!"',
    '💡 "Tạo kịch bản 60s, 6 cảnh chuẩn nhịp visual metaphor cho thuyết trình & TikTok!"',
    '🎥 "Tự động dựng video hoạt hình người que với phong cách tối giản đen trắng hoặc màu sắc!"',
    '⚡ "Biên tập chuẩn phòng thu, ghép voiceover AI và phụ đề chuẩn xác từng giây!"',
  ];

  const handleNextQuote = () => {
    setSpeechIdx((prev) => (prev + 1) % directorQuotes.length);
  };

  return (
    <>
      {/* Floating Stickman Director Companion Pill */}
      <aside
        aria-label="Đạo diễn Người Que LUK Studio"
        className="fixed bottom-5 right-5 z-40 flex flex-col items-end select-none"
      >
        {isOpen ? (
          <div className="mb-2.5 w-80 max-w-[calc(100vw-32px)] rounded-2xl border border-luk-border bg-luk-card/95 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-start justify-between gap-2 border-b border-luk-border pb-2.5 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  <Film className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-luk-text flex items-center gap-1.5">
                    <span>Stickman Video Director</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-600 text-white font-medium">
                      AI Skill
                    </span>
                  </h4>
                  <p className="text-[11px] text-luk-muted">
                    Đạo diễn video hoạt hình người que LUK Studio
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-luk-muted hover:text-luk-text hover:bg-luk-bg transition"
                aria-label="Đóng bảng đạo diễn"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Hand-drawn Clapper & Speech Bubble */}
            <div
              onClick={handleNextQuote}
              className="group cursor-pointer rounded-xl border border-luk-border bg-luk-bg/80 p-3 transition hover:border-blue-500/40"
              title="Nhấn để xem câu thoại phân cảnh tiếp theo"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <img
                  src="/stickman/clapper-crayon.png"
                  alt="Clapper"
                  className="h-5 w-5 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                  Storyboard Note #{speechIdx + 1}
                </span>
              </div>
              <p className="text-xs font-medium text-luk-text leading-relaxed">
                {directorQuotes[speechIdx]}
              </p>
              <span className="mt-1 block text-[10px] text-luk-muted group-hover:text-blue-400">
                👉 Nhấn để đổi phân cảnh đạo diễn
              </span>
            </div>

            {/* 4 Director Styles Showcase */}
            <div className="mt-3 pt-2.5 border-t border-luk-border flex flex-wrap gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 font-medium">
                1. Classic B&W
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                2. Modern Tech
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                3. Prehistoric Cave
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                4. Cozy Story
              </span>
            </div>
          </div>
        ) : null}

        {/* Launcher Button with Animated Stickman Clapper Icon */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="group flex items-center gap-2.5 rounded-full border border-luk-border bg-luk-card/90 px-3.5 py-2 shadow-xl backdrop-blur-md transition hover:scale-105 hover:border-amber-400/50 hover:bg-luk-card"
          title="Mở trợ lý Đạo diễn Người Que LUK Studio"
        >
          <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-500">
            <img
              src="/stickman/clapper-crayon.png"
              alt="Stickman Director"
              className="h-4 w-4 object-contain group-hover:rotate-12 transition-transform"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="text-xs font-bold text-luk-text">
            Stickman Director
          </span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </aside>
    </>
  );
}
