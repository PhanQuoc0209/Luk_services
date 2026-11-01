import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getFallbackServiceBySlug, getFallbackServices } from '@/lib/fallback-data';
import { formatVND } from '@/lib/vietqr';
import { ServiceDetailActions } from './ServiceDetailActions';
import { ExpandableServiceDetails } from '@/components/services/ExpandableServiceDetails';
import { ServiceCard } from '@/components/home/ServiceCard';
import {
  Clock,
  PackageCheck,
  ShieldCheck,
  ChevronLeft,
  Star,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let service: any = null;
  let relatedServices: any[] = [];

  try {
    service = await prisma.service.findUnique({
      where: { slug },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (service) {
      relatedServices = await prisma.service.findMany({
        where: {
          category: service.category,
          isActive: true,
          NOT: { id: service.id },
        },
        take: 4,
      });
    }
  } catch (err: any) {
    console.error(`[LUK Services /services/${slug}] Database query notice:`, err?.message || err);
  }

  if (!service) {
    service = getFallbackServiceBySlug(slug);
  }

  if (!service) {
    notFound();
  }

  if (!service.reviews) {
    service.reviews = [];
  }

  if (!relatedServices || relatedServices.length === 0) {
    relatedServices = getFallbackServices(service.category)
      .filter((s) => s.slug !== service.slug)
      .slice(0, 4);
  }

  const categoryLabels: Record<string, string> = {
    AI_ACCOUNTS: 'Các AI Pro',
    VIDEO_EDITING: 'Edit Chuẩn LUK',
    TRANSCRIPT_EDITING: 'Transcript Chuẩn LUK',
    SLIDE_DESIGN: 'Slide Chuẩn LUK',
  };

  const reviewsCount = service.reviews.length;
  const avgRating =
    reviewsCount > 0
      ? (
          service.reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) /
          reviewsCount
        ).toFixed(1)
      : null;

  return (
    <div className="mx-auto max-w-[1536px] px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link
          href="/services"
          className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-white transition font-medium"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Danh mục dịch vụ</span>
        </Link>
        <span>/</span>
        <Link
          href={`/services?cat=${service.category}`}
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
        >
          {categoryLabels[service.category] || service.category}
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">
          {service.title}
        </span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image & Highlights & Specs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E1726] shadow-sm">
            <img
              src={service.imageUrl}
              alt={service.title}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E1726] p-4 space-y-1 shadow-xs">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold">
                <Clock className="h-4 w-4" />
                <span>Thời gian hoàn thiện</span>
              </div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                {service.turnaround}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tùy thuộc vào khối lượng thực tế
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E1726] p-4 space-y-1 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <PackageCheck className="h-4 w-4" />
                <span>Định dạng bàn giao</span>
              </div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                {service.deliveryFormat}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bàn giao bản gốc &amp; file hoàn thiện
              </p>
            </div>
          </div>

          {/* Expandable Service Details */}
          <ExpandableServiceDetails service={service} />

          {/* Customer Reviews Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E1726] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>Đánh giá từ sinh viên ({reviewsCount})</span>
              </h2>
              {avgRating && (
                <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-300 border border-amber-500/20">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>{avgRating} / 5.0</span>
                </div>
              )}
            </div>

            {reviewsCount > 0 ? (
              <div className="space-y-3">
                {service.reviews.map((rev: any) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {rev.authorName}
                        </span>
                        {rev.isDemo && (
                          <span className="rounded bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 text-[9px] font-mono text-slate-600 dark:text-slate-400">
                            XÁC THỰC
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3 w-3 ${
                              s <= rev.rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-slate-300 dark:text-white/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                      {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 dark:border-white/10 p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                <p>Chưa có đánh giá nào cho dịch vụ này.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Đánh giá sẽ mở sau khi hoàn tất đơn hàng nghiệm thu.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Purchase Card (Sticky) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E1726] p-6 space-y-6 shadow-xl">
            <div className="space-y-2">
              <span className="inline-block rounded-md bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/20">
                {categoryLabels[service.category] || service.category}
              </span>
              <h1 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                {service.title}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {service.shortDescription}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-[#0A0F1D] p-4 border border-slate-200 dark:border-white/10 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block uppercase font-bold">
                  Báo giá tham khảo
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {service.startingPrice > 0
                    ? formatVND(service.startingPrice)
                    : 'Liên hệ báo giá'}
                </span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Chưa thanh toán trước
              </span>
            </div>

            {/* Interactive Quantity & Add to Cart Client Component */}
            <ServiceDetailActions
              serviceId={service.id}
              serviceTitle={service.title}
            />

            <div className="border-t border-slate-100 dark:border-white/10 pt-4 space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Không trừ tiền trước — Admin liên hệ báo giá &amp; chốt yêu cầu</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Hỗ trợ gửi file đính kèm ở bước thanh toán &amp; duyệt nháp 1-1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Services Section */}
      {relatedServices.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Dịch vụ liên quan trong cùng chuyên ngành</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Các gói giải pháp thường được sinh viên chọn kèm để tối ưu kết quả đồ án
              </p>
            </div>
            <Link
              href={`/services?cat=${service.category}`}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedServices.map((rel) => (
              <ServiceCard key={rel.id} service={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
