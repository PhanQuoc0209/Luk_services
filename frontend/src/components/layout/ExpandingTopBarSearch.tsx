/* Lucian UX/UI Prompt #027 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#027 */
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface SearchOptionItem {
  title: string;
  category: string;
  gradient: string;
  slug: string;
  keywords: string[];
}

const SEARCH_DATA: SearchOptionItem[] = [
  {
    title: 'Tài Khoản CapCut Pro Chính Chủ',
    category: 'AI Pro · Giao ngay 5p',
    gradient: 'linear-gradient(140deg,#3B82F6,#6366F1)',
    slug: 'tai-khoan-capcut-pro-chinh-chu',
    keywords: ['capcut', 'pro', 'edit video', 'tiktok', 'auto caption'],
  },
  {
    title: 'Tài Khoản ChatGPT Plus / Team (GPT-4o & Canvas)',
    category: 'AI Pro · Giao ngay 5p',
    gradient: 'linear-gradient(140deg,#10B981,#059669)',
    slug: 'tai-khoan-chatgpt-plus-team',
    keywords: ['chatgpt', 'gpt4o', 'gpt-4o', 'openai', 'canvas', 'plus'],
  },
  {
    title: 'Tài Khoản Google Gemini Advanced + 2TB Drive',
    category: 'AI Pro · Giao ngay 5p',
    gradient: 'linear-gradient(140deg,#8B5CF6,#6366F1)',
    slug: 'tai-khoan-gemini-advanced-2tb',
    keywords: ['gemini', 'advanced', 'google', '2tb', 'drive'],
  },
  {
    title: 'Tài Khoản Canva Pro Sinh Viên Trọn Đời',
    category: 'AI Pro · Giao ngay 5p',
    gradient: 'linear-gradient(140deg,#EC4899,#F43F5E)',
    slug: 'tai-khoan-canva-pro-vinh-vien',
    keywords: ['canva', 'pro', 'thiet ke', 'slide', 'poster'],
  },
  {
    title: 'Tài Khoản Claude Pro (Anthropic AI - Context 200K)',
    category: 'AI Pro · Giao ngay 10p',
    gradient: 'linear-gradient(140deg,#F59E0B,#EF4444)',
    slug: 'tai-khoan-claude-pro-anthropic',
    keywords: ['claude', 'pro', 'anthropic', 'sonnet', 'viet luan'],
  },
  {
    title: 'Edit Video Recap & Sự Kiện CLB',
    category: 'Edit Chuẩn LUK · 1-2 ngày',
    gradient: 'linear-gradient(140deg,#EF4444,#F97316)',
    slug: 'edit-video-recap-su-kien-clb',
    keywords: ['recap', 'su kien', 'clb', 'highlight', 'video'],
  },
  {
    title: 'Edit Video Thuyết Trình & Bài Giảng',
    category: 'Edit Chuẩn LUK · 1-2 ngày',
    gradient: 'linear-gradient(140deg,#3B82F6,#0EA5E9)',
    slug: 'edit-video-thuyet-trinh-bai-giang',
    keywords: ['thuyet trinh', 'bai giang', 'dong bo slide', 'loc am'],
  },
  {
    title: 'Dựng Video Giới Thiệu Bản Thân & CV Video',
    category: 'Edit Chuẩn LUK · 2 ngày',
    gradient: 'linear-gradient(140deg,#8B5CF6,#A855F7)',
    slug: 'dung-video-gioi-thieu-cv',
    keywords: ['cv video', 'gioi thieu', 'portfolio', 'hoc bong'],
  },
  {
    title: 'Gỡ Băng Phỏng Vấn Nghiên Cứu Khoa Học (NCKH)',
    category: 'Transcript Chuẩn LUK · 24 giờ',
    gradient: 'linear-gradient(140deg,#10B981,#14B8A6)',
    slug: 'go-bang-phong-van-nckh',
    keywords: ['transcript', 'go bang', 'phong van', 'nckh', 'dinh tinh'],
  },
  {
    title: 'Dịch & Viết Phụ Đề Song Ngữ Anh - Việt (SRT/VTT)',
    category: 'Transcript Chuẩn LUK · 24 giờ',
    gradient: 'linear-gradient(140deg,#6366F1,#8B5CF6)',
    slug: 'dich-viet-phu-de-song-ngu',
    keywords: ['phu de', 'dich', 'anh viet', 'srt', 'vtt', 'song ngu'],
  },
  {
    title: 'Thiết Kế Slide Thuyết Trình Học Thuật',
    category: 'Slide Chuẩn LUK · 1-2 ngày',
    gradient: 'linear-gradient(140deg,#F59E0B,#D97706)',
    slug: 'thiet-ke-slide-thuyet-trinh-hoc-thuat',
    keywords: ['slide', 'thuyet trinh', 'hoc thuat', 'powerpoint', 'khoa luan'],
  },
  {
    title: 'Thiết Kế Pitch Deck Cuộc Thi & Khởi Nghiệp',
    category: 'Slide Chuẩn LUK · 2-3 ngày',
    gradient: 'linear-gradient(140deg,#8B5CF6,#EC4899)',
    slug: 'thiet-ke-pitch-deck-cuoc-thi-khoi-nghiep',
    keywords: ['pitch deck', 'goi von', 'khoi nghiep', 'canva'],
  },
];

const RECENT_KEYWORDS = ['CapCut Pro', 'ChatGPT Plus', 'Edit Video', 'Slide thuyết trình', 'Transcript NCKH'];

export function ExpandingTopBarSearch({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState<SearchOptionItem[]>([]);
  const [act, setAct] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const goBtnRef = useRef<HTMLButtonElement>(null);
  const listId = useRef(`u027-${Math.random().toString(36).slice(2, 7)}`).current;

  // Filter items matching search query
  const performSearch = useCallback((q: string) => {
    const trimmed = q.trim().toLowerCase();
    if (!trimmed) {
      setShown(SEARCH_DATA.slice(0, 4));
      setAct(-1);
      return;
    }

    const filtered = SEARCH_DATA.filter((d) => {
      const matchTitle = d.title.toLowerCase().includes(trimmed);
      const matchCat = d.category.toLowerCase().includes(trimmed);
      const matchKeywords = d.keywords.some((k) => k.toLowerCase().includes(trimmed));
      return matchTitle || matchCat || matchKeywords;
    }).slice(0, 4);

    setShown(filtered);
    setAct(filtered.length > 0 ? 0 : -1);
  }, []);

  const openSearch = () => {
    onOpenChange(true);
    performSearch(query);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 120);
  };

  const closeSearch = () => {
    onOpenChange(false);
    setQuery('');
    setAct(-1);
    goBtnRef.current?.focus();
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeSearch();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelectService = (slug: string) => {
    router.push(`/services/${slug}`);
    closeSearch();
  };

  const handleSubmitSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (act >= 0 && shown[act]) {
      handleSelectService(shown[act].slug);
    } else if (query.trim()) {
      router.push(`/services?q=${encodeURIComponent(query.trim())}`);
      closeSearch();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSearch();
    } else if (e.key === 'ArrowDown' && shown.length > 0) {
      e.preventDefault();
      setAct((prev) => (prev + 1) % shown.length);
    } else if (e.key === 'ArrowUp' && shown.length > 0) {
      e.preventDefault();
      setAct((prev) => (prev - 1 + shown.length) % shown.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmitSearch();
    }
  };

  // Helper to highlight matching letters in title
  const renderHighlightedTitle = (title: string, highlight: string) => {
    if (!highlight.trim()) return title;
    const parts = title.split(new RegExp(`(${highlight.trim()})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.trim().toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      ref={containerRef}
      className={`u027-search-area ${isOpen ? 'is-open' : ''}`}
    >
      {/* Search Field (Expands smoothly on .is-open) */}
      <div className="u027-field">
        <button
          ref={goBtnRef}
          className="u027-go"
          type="button"
          aria-label="Mở tìm kiếm"
          aria-expanded={isOpen}
          onClick={() => (isOpen ? inputRef.current?.focus() : openSearch())}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.2 4.2" />
          </svg>
        </button>

        <input
          ref={inputRef}
          className="u027-in"
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-activedescendant={act >= 0 ? `${listId}-${act}` : undefined}
          placeholder="Tìm dịch vụ: CapCut, ChatGPT, Edit video, Slide, Transcript..."
          tabIndex={isOpen ? 0 : -1}
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            performSearch(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />

        <button
          className="u027-x"
          type="button"
          aria-label="Đóng tìm kiếm"
          tabIndex={isOpen ? 0 : -1}
          onClick={closeSearch}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7l10 10M17 7L7 17" />
          </svg>
        </button>
      </div>

      {/* Autocomplete Popup */}
      <div className="u027-pop">
        <p className="u027-sec">Tìm kiếm gần đây</p>
        <div className="u027-recent">
          {RECENT_KEYWORDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setQuery(k);
                performSearch(k);
                inputRef.current?.focus();
              }}
            >
              {k}
            </button>
          ))}
        </div>

        <p className="u027-sec">Gợi ý dịch vụ</p>
        <ul
          id={listId}
          className="u027-list"
          role="listbox"
          aria-label="Kết quả tìm kiếm gợi ý"
        >
          {shown.length === 0 ? (
            <li className="u027-empty">Không tìm thấy dịch vụ cho ‘{query}’</li>
          ) : (
            shown.map((item, i) => (
              <li
                key={item.slug}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === act}
                className="u027-opt"
                style={{ transitionDelay: `${i * 35}ms` }}
                onClick={() => handleSelectService(item.slug)}
              >
                <i style={{ '--c': item.gradient } as React.CSSProperties} aria-hidden="true">
                  {item.title.charAt(0)}
                </i>
                <span>
                  <b>{renderHighlightedTitle(item.title, query)}</b>
                  <small>{item.category}</small>
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
