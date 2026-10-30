'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Download,
  Filter,
  Layers,
  Sparkles,
  FileText,
  FileCheck,
  Award,
  Globe,
  Tag,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export interface DebateResourceItem {
  id: string;
  title: string;
  slug: string;
  topic: string;
  format: string;
  difficulty: string;
  language: string;
  tags: string;
  description: string;
  downloadUrl?: string | null;
  fileSize?: string | null;
  author?: string | null;
  isPremium: boolean;
  downloadsCount: number;
}

interface DebateClientProps {
  initialResources: DebateResourceItem[];
}

const TOPICS = [
  'ALL',
  'Kinh tế & Thương mại',
  'Chính trị & Quan hệ Quốc tế',
  'Xã hội & Đạo đức',
  'Công nghệ & AI',
  'Môi trường & Phát triển bền vững',
];

const FORMATS = ['ALL', 'PDF Case File', 'Slide PPTX', 'Notion Template', 'DOCX Brief'];

const DIFFICULTIES = ['ALL', 'Cơ bản (Novice)', 'Trung cấp (Open)', 'Nâng cao (Championship)'];

const LANGUAGES = ['ALL', 'Tiếng Việt', 'Tiếng Anh', 'Song ngữ'];

export function DebateClient({ initialResources }: DebateClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [selectedFormat, setSelectedFormat] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');

  const filteredResources = useMemo(() => {
    return initialResources.filter((item) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchTags = item.tags.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }

      // Topic filter
      if (selectedTopic !== 'ALL' && item.topic !== selectedTopic) {
        return false;
      }

      // Format filter
      if (selectedFormat !== 'ALL' && item.format !== selectedFormat) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'ALL' && item.difficulty !== selectedDifficulty) {
        return false;
      }

      // Language filter
      if (selectedLanguage !== 'ALL' && item.language !== selectedLanguage) {
        return false;
      }

      return true;
    });
  }, [
    initialResources,
    searchQuery,
    selectedTopic,
    selectedFormat,
    selectedDifficulty,
    selectedLanguage,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('ALL');
    setSelectedFormat('ALL');
    setSelectedDifficulty('ALL');
    setSelectedLanguage('ALL');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedTopic !== 'ALL' ||
    selectedFormat !== 'ALL' ||
    selectedDifficulty !== 'ALL' ||
    selectedLanguage !== 'ALL';

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-luk-border bg-luk-card p-5 space-y-4">
        {/* Search row */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-luk-dim" />
          <input
            type="text"
            placeholder="Tìm kiếm theo chủ đề, motion, từ khóa (VD: AI, kinh tế vĩ mô, BP, rebuttal)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-luk-border bg-luk-bg pl-10 pr-4 py-2.5 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none transition"
          />
        </div>

        {/* Filter selectors grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Topic */}
          <div>
            <label className="text-[11px] font-semibold text-luk-dim block mb-1">Chủ đề (Topic)</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full rounded-lg border border-luk-border bg-luk-bg px-3 py-1.5 text-xs text-luk-text focus:border-luk-blue focus:outline-none"
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'Tất cả chủ đề' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="text-[11px] font-semibold text-luk-dim block mb-1">Định dạng file</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full rounded-lg border border-luk-border bg-luk-bg px-3 py-1.5 text-xs text-luk-text focus:border-luk-blue focus:outline-none"
            >
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f === 'ALL' ? 'Tất cả định dạng' : f}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-[11px] font-semibold text-luk-dim block mb-1">Cấp độ (Difficulty)</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full rounded-lg border border-luk-border bg-luk-bg px-3 py-1.5 text-xs text-luk-text focus:border-luk-blue focus:outline-none"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d === 'ALL' ? 'Tất cả cấp độ' : d}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="text-[11px] font-semibold text-luk-dim block mb-1">Ngôn ngữ</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full rounded-lg border border-luk-border bg-luk-bg px-3 py-1.5 text-xs text-luk-text focus:border-luk-blue focus:outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l === 'ALL' ? 'Tất cả ngôn ngữ' : l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status & Reset */}
        <div className="flex items-center justify-between text-xs text-luk-muted border-t border-luk-border/60 pt-3">
          <span>
            Tìm thấy <strong className="text-white font-bold">{filteredResources.length}</strong> tài liệu phù hợp
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Xóa tất cả bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Grid of Resource Cards */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => {
            const tagList = res.tags
              ? res.tags.split(',').map((t) => t.trim()).filter(Boolean)
              : [];

            return (
              <div
                key={res.id}
                className="flex flex-col justify-between rounded-xl border border-luk-border bg-luk-card p-5 hover:border-luk-borderLight hover:shadow-lg transition space-y-4"
              >
                <div className="space-y-3">
                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="rounded bg-blue-500/10 px-2 py-0.5 font-bold text-luk-blueLight border border-blue-500/20">
                      {res.topic}
                    </span>
                    <span className="rounded bg-luk-bg px-2 py-0.5 font-medium text-luk-dim border border-luk-border">
                      {res.format}
                    </span>
                    <span className="rounded bg-purple-500/10 px-2 py-0.5 font-semibold text-purple-400 border border-purple-500/20">
                      {res.difficulty}
                    </span>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                      {res.title}
                    </h3>
                    <p className="text-[11px] text-luk-dim mt-0.5">
                      Biên soạn: {res.author || 'LUK Debate Society'}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-luk-muted line-clamp-3 leading-relaxed">
                    {res.description}
                  </p>

                  {/* Tags */}
                  {tagList.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {tagList.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-luk-bg px-1.5 py-0.5 text-[10px] text-luk-dim border border-luk-border/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="border-t border-luk-border/60 pt-3 flex items-center justify-between">
                  <div className="text-[11px] text-luk-dim space-y-0.5">
                    <div>Dung lượng: <span className="text-luk-text">{res.fileSize || '3.5 MB'}</span></div>
                    <div>Lượt tải: <span className="text-emerald-400 font-medium">{res.downloadsCount}</span></div>
                  </div>

                  <a
                    href={`/api/debate/${res.id}/download`}
                    download
                    className="flex items-center gap-1.5 rounded-lg bg-luk-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-luk-blueHover active:scale-95 transition shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Tải về</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-luk-border bg-luk-card p-12 text-center space-y-3">
          <BookOpen className="mx-auto h-10 w-10 text-luk-dim" />
          <h3 className="text-sm font-bold text-white">Không tìm thấy tài liệu phù hợp</h3>
          <p className="text-xs text-luk-muted max-w-sm mx-auto">
            Hãy thử thay đổi từ khóa tìm kiếm hoặc đặt lại các bộ lọc chủ đề, định dạng, cấp độ.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-xl border border-luk-border bg-luk-bg px-4 py-2 text-xs font-semibold text-white hover:bg-luk-card transition"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
