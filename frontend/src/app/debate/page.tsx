import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ServiceCard } from '@/components/home/ServiceCard';
import { DebateClient } from './DebateClient';
import { BookOpen, Sparkles, Award, ArrowLeft, Library, ShoppingBag } from 'lucide-react';

export const revalidate = 0;

export default async function DebatePage() {
  const [debateResources, debateServices] = await Promise.all([
    prisma.debateResource.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.service.findMany({
      where: {
        category: 'DEBATE_RESOURCES',
        isActive: true,
      },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="rounded-2xl border border-luk-border bg-luk-card p-6 md:p-8 space-y-4">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs text-luk-muted hover:text-luk-text transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Quay lại tất cả dịch vụ</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-luk-redSubtle px-2.5 py-0.5 text-xs font-semibold text-luk-red">
              LUK Global Debate Resources Hub
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white">
              Thư Viện Tài Liệu & Hồ Sơ Phân Tích Tranh Biện (British Parliamentary)
            </h1>
            <p className="text-xs md:text-sm text-luk-muted leading-relaxed">
              Tài liệu tổng hợp theo tiêu chuẩn các giải tranh biện sinh viên cấp quốc gia & khu vực: cấu trúc case files, motion breakdown, rebuttal models và context briefing chuyên sâu. Tìm kiếm và tải tài liệu miễn phí hoặc đặt gói nghiên cứu riêng.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-luk-bg p-4 rounded-xl border border-luk-border shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Format chuẩn BP</p>
              <p className="text-[11px] text-luk-dim">Anh ngữ & Tiếng Việt</p>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Searchable & Filterable Resource Library */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Library className="h-5 w-5 text-luk-blueLight" />
            <span>Thư viện Case Files & Motion Bank ({debateResources.length})</span>
          </h2>
          <span className="text-xs text-luk-dim">
            Tải trực tiếp & Lưu trữ tài liệu nghiên cứu
          </span>
        </div>

        <DebateClient initialResources={debateResources} />
      </section>

      {/* 2. Specialized Marketplace Services for Debate */}
      <section className="space-y-4 border-t border-luk-border pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-purple-400" />
              <span>Gói Dịch Vụ Nghiên Cứu Motion & Huấn Luyện Đội Thi</span>
            </h2>
            <p className="text-xs text-luk-muted mt-0.5">
              Đặt phân tích motion chuyên sâu và đào tạo chiến thuật riêng cho giải đấu sắp diễn ra
            </p>
          </div>
        </div>

        {debateServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {debateServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-luk-border bg-luk-card p-8 text-center text-xs text-luk-muted">
            Hiện chưa có gói dịch vụ nào trong danh mục này.
          </div>
        )}
      </section>

      {/* Debate FAQ / Support */}
      <div className="rounded-xl border border-luk-border bg-luk-card p-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-luk-text flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span>Bạn cần đặt nghiên cứu Motion đặc thù cho giải đấu?</span>
        </h3>
        <p className="text-xs text-luk-muted leading-relaxed">
          Nếu đội thi của bạn cần phân tích các motion đặc thù hoặc case study chuyên ngành trước các vòng đấu loại, hãy thêm mục &quot;Gói Nghiên cứu Chuyên sâu Motion Giải Đấu&quot; vào giỏ hàng và đính kèm danh sách đề bài hoặc chủ đề tại trang checkout. Đội ngũ LUK Services sẽ gửi phân tích đa chiều trong vòng 24–48h.
        </p>
      </div>
    </div>
  );
}
