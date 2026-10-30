import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getFallbackServiceBySlug } from '@/lib/fallback-data';
import { formatVND } from '@/lib/vietqr';
import { ServiceDetailActions } from './ServiceDetailActions';
import { ExpandableServiceDetails } from '@/components/services/ExpandableServiceDetails';
import { Clock, PackageCheck, ShieldCheck, ChevronLeft, Layers, Star, MessageSquare } from 'lucide-react';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let service: any = null;

  try {
    service = await prisma.service.findUnique({
      where: { slug },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  } catch (err: any) {
    console.error(`[LUK Services /services/${slug}] Notice: Database query failed, checking fallback catalog:`, err?.message || err);
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

  const categoryLabels: Record<string, string> = {
    AI_ACCOUNTS: 'Các AI Pro',
    VIDEO_EDITING: 'Edit Chuẩn LUK',
    TRANSCRIPT_EDITING: 'Transcript Chuẩn LUK',
    SLIDE_DESIGN: 'Slide Chuẩn LUK',
  };

  const reviewsCount = service.reviews.length;
  const avgRating = reviewsCount > 0
    ? (service.reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / reviewsCount).toFixed(1)
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-luk-muted">
        <Link href="/services" className="flex items-center gap-1 hover:text-luk-text transition">
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Danh mục dịch vụ</span>
        </Link>
        <span>/</span>
        <span className="text-blue-400 font-medium">{categoryLabels[service.category] || service.category}</span>
        <span>/</span>
        <span className="text-luk-text truncate max-w-xs">{service.title}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image & Highlights */}
        <div className="lg:col-span-7 space-y-6">
          <div className="overflow-hidden rounded-2xl border border-luk-border bg-luk-card">
            <img
              src={service.imageUrl}
              alt={service.title}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-luk-border bg-luk-card p-4 space-y-1">
              <div className="flex items-center gap-2 text-luk-blueLight text-xs font-semibold">
                <Clock className="h-4 w-4" />
                <span>Thời gian hoàn thiện</span>
              </div>
              <p className="text-sm font-bold text-white">{service.turnaround}</p>
              <p className="text-[11px] text-luk-muted">Tùy thuộc vào khối lượng thực tế</p>
            </div>

            <div className="rounded-xl border border-luk-border bg-luk-card p-4 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <PackageCheck className="h-4 w-4" />
                <span>Định dạng bàn giao</span>
              </div>
              <p className="text-sm font-bold text-white">{service.deliveryFormat}</p>
              <p className="text-[11px] text-luk-muted">Bàn giao bản gốc & file hoàn thiện</p>
            </div>
          </div>

          {/* Expandable Product Details (Lucian UX/UI Prompt #288) */}
          <ExpandableServiceDetails service={service} />
          {/* Customer Reviews Section */}
          <div className="rounded-2xl border border-luk-border bg-luk-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-luk-border pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>Đánh giá từ sinh viên ({reviewsCount})</span>
              </h2>
              {avgRating && (
                <div className="flex items-center gap-1.5 rounded-lg bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-300 border border-amber-400/20">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{avgRating} / 5.0</span>
                </div>
              )}
            </div>

            {reviewsCount > 0 ? (
              <div className="space-y-3">
                {service.reviews.map((rev: any) => (
                  <div key={rev.id} className="rounded-xl border border-luk-border bg-luk-bg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{rev.authorName}</span>
                        {rev.isDemo && (
                          <span className="rounded bg-luk-card px-1.5 py-0.5 text-[9px] font-mono text-luk-dim border border-luk-border">
                            DEMO
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3 w-3 ${
                              s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-luk-border'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-luk-muted leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                    <span className="text-[10px] text-luk-dim block">
                      {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-luk-border bg-luk-bg p-6 text-center text-xs text-luk-muted">
                <p>Chưa có đánh giá nào cho dịch vụ này.</p>
                <p className="text-[11px] text-luk-dim mt-1">
                  Đánh giá sẽ được mở cho khách hàng sau khi hoàn tất nghiệm thu đơn hàng.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Purchase Card */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-luk-border bg-luk-card p-6 space-y-6 shadow-xl">
            <div className="space-y-2">
              <span className="inline-block rounded-md bg-luk-blueSubtle px-2.5 py-0.5 text-xs font-semibold text-luk-blueLight">
                {categoryLabels[service.category] || service.category}
              </span>
              <h1 className="text-lg font-bold text-white leading-snug">
                {service.title}
              </h1>
              <p className="text-xs text-luk-muted">
                {service.shortDescription}
              </p>
            </div>

            <div className="rounded-xl bg-luk-bg p-4 border border-luk-border flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-luk-dim block uppercase font-medium">Báo giá tham khảo</span>
                <span className="text-2xl font-black text-white">
                  {service.startingPrice > 0 ? formatVND(service.startingPrice) : 'Liên hệ báo giá'}
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">Chưa thanh toán trước</span>
            </div>

            {/* Interactive Quantity & Add to Cart Client Component */}
            <ServiceDetailActions serviceId={service.id} serviceTitle={service.title} />

            <div className="border-t border-luk-border pt-4 space-y-2.5 text-xs text-luk-dim">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-luk-blueLight" />
                <span>Không trừ tiền trước — Admin báo giá trước khi chốt</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-luk-blueLight" />
                <span>Hỗ trợ gửi file đính kèm ở bước thanh toán / quản lý đơn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
