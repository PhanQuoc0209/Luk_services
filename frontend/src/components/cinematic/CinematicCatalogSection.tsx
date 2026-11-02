'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { formatVND } from '@/lib/vietqr';
import { useApp } from '@/components/providers/AppProvider';
import { PRICE_RANGE_MAP, DEBATE_MOTIONS } from './CinematicCapabilitiesSection';

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
  { key: 'VIDEO_EDITING', label: 'Edit Video' },
  { key: 'SLIDE_DESIGN', label: 'Edit Slide' },
  { key: 'TRANSCRIPT_EDITING', label: 'Viết Kịch Bản (Transcript)' },
  { key: 'DEBATE_RESOURCES', label: 'Debate' },
];

const SCHEDULE_MILESTONES = [
  {
    step: 'Mốc 01',
    time: '0 giờ (Ngay khi gửi đơn)',
    title: 'Tiếp nhận & Phân tích',
    desc: 'Admin nhận file nguồn, đề tài, outline và chốt tiêu chuẩn bàn giao cụ thể.',
  },
  {
    step: 'Mốc 02',
    time: '6h — 12h tiếp theo',
    title: 'Khung sườn & Layout nháp',
    desc: 'Dựng timeline video, master slide hoặc gỡ băng bản thô để đảm bảo đúng hướng.',
  },
  {
    step: 'Mốc 03',
    time: '24 giờ (Đúng cam kết)',
    title: 'Bàn giao bản thảo hoàn thiện',
    desc: 'Gửi bản thảo Draft Preview chất lượng cao (DOCX, PPTX, MP4 4K) để bạn xem duyệt.',
  },
  {
    step: 'Mốc 04',
    time: 'Hậu mãi & Bảo hành',
    title: 'Chỉnh sửa 1-1 miễn phí',
    desc: 'Hỗ trợ tinh chỉnh theo góp ý của giảng viên/hội đồng thi và xuất file nghiệm thu.',
  },
];

export function CinematicCatalogSection({ services }: CinematicCatalogSectionProps) {
  const { addToCartAndOpen, refreshCart } = useApp();
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);

  // On-page modal state (Không chuyển hướng sang trang cũ)
  const [activeModalItem, setActiveModalItem] = useState<ServiceItemData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [selectedMotionId, setSelectedMotionId] = useState<string>('facebook');
  const [showMvVideo, setShowMvVideo] = useState(false);

  // Listen to category switch from Section 2 or Navbar
  useEffect(() => {
    const handleCategoryEvent = (e: any) => {
      if (e?.detail?.categoryKey) {
        setSelectedCat(e.detail.categoryKey);
      }
    };
    window.addEventListener('luk-select-category', handleCategoryEvent);
    return () => window.removeEventListener('luk-select-category', handleCategoryEvent);
  }, []);

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

  const handleOpenDetailModal = (item: ServiceItemData) => {
    setActiveModalItem(item);
    setQuantity(1);
    setOrderNotes('');
    setJustAdded(false);
  };

  const handleCloseModal = () => {
    setActiveModalItem(null);
  };

  const handleQuickAddToCart = async (serviceId: string) => {
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

  const handleModalAddToCart = async () => {
    if (!activeModalItem || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const isDebate = activeModalItem.category === 'DEBATE_RESOURCES';
      const motionObj = DEBATE_MOTIONS.find((m) => m.id === selectedMotionId);
      const notePrefix = isDebate && motionObj ? `[Motion: ${motionObj.name}] ` : '';
      const finalNotes = (notePrefix + orderNotes).trim() || undefined;

      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: activeModalItem.id,
          quantity,
          itemNotes: finalNotes,
        }),
      });

      if (res.ok) {
        await refreshCart();
        setJustAdded(true);
        setTimeout(() => {
          setJustAdded(false);
          handleCloseModal();
          addToCartAndOpen(activeModalItem.id);
        }, 800);
      }
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="services-schedule"
      className="relative w-full bg-black text-white px-8 md:px-16 lg:px-20 py-24 border-t border-white/10 z-10"
    >
      <div className="max-w-[1536px] mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-sm font-body text-white/80 mb-3 tracking-wider uppercase">
              // Lịch Dịch Vụ &amp; Báo Giá Trực Tiếp
            </p>
            <h2 className="font-heading italic text-white text-5xl md:text-6xl tracking-[-2px] leading-tight">
              Lịch Bàn Giao &amp; Gói Dịch Vụ
            </h2>
            <p className="mt-2 text-sm text-white/80 font-body font-light max-w-xl">
              Toàn bộ thông tin lịch trình, mốc bàn giao và đặt dịch vụ đều diễn ra trực tiếp trên trang này mà không cần chuyển hướng.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="liquid-glass rounded-full w-full px-5 py-2.5 text-xs text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 font-body"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-2.5 text-xs text-white/50 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 4 Milestones Schedule Box: Chuẩn đại học */}
        <div className="liquid-glass rounded-[1.25rem] p-6 space-y-4 border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-heading italic text-white text-2xl tracking-tight">
              Lịch Trình 4 Mốc Bàn Giao Chuẩn Đại Học
            </h3>
            <span className="text-xs text-white/60 font-body hidden sm:inline">
              Cam kết giao đúng hẹn 100% • Hỗ trợ chỉnh sửa 1-1
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SCHEDULE_MILESTONES.map((m) => (
              <div
                key={m.step}
                className="liquid-glass rounded-xl p-3.5 flex flex-col justify-between space-y-2 border border-white/5"
              >
                <div>
                  <span className="font-bold text-[11px] text-white/90 uppercase tracking-wider font-body">
                    {m.step}
                  </span>
                  <p className="font-heading italic text-white text-lg tracking-tight leading-snug mt-1">
                    {m.title}
                  </p>
                  <p className="text-[11px] text-white/70 font-body font-light mt-1 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5 text-[10.5px] text-white/50 font-body">
                  ⚡ {m.time}
                </div>
              </div>
            ))}
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
              className="liquid-glass rounded-[1.25rem] p-5 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300 border border-white/10"
            >
              <div>
                {/* Thumbnail */}
                <div
                  onClick={() => handleOpenDetailModal(item)}
                  className="block aspect-[16/10] w-full rounded-2xl overflow-hidden bg-white/5 mb-4 relative cursor-pointer group"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5 liquid-glass rounded-full px-2.5 py-0.5 text-[10px] text-white font-body">
                    ⚡ {item.turnaround}
                  </div>
                </div>

                {/* Title & Desc */}
                <h3
                  onClick={() => handleOpenDetailModal(item)}
                  className="font-heading italic text-white text-2xl tracking-[-0.5px] leading-snug hover:text-white/80 transition-colors line-clamp-2 cursor-pointer"
                >
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-white/70 font-body font-light line-clamp-2 leading-relaxed">
                  {item.shortDescription}
                </p>
              </div>

              {/* Price & On-page Actions */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-white/50 block font-body uppercase">
                    Báo giá từ
                  </span>
                  <span className="font-heading italic text-white text-xl">
                    {PRICE_RANGE_MAP[item.slug] || (item.startingPrice > 0 ? formatVND(item.startingPrice) : 'Liên hệ')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenDetailModal(item)}
                    className="liquid-glass rounded-full px-3 py-1.5 text-xs text-white/80 hover:text-white font-body cursor-pointer"
                  >
                    Lịch trình
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAddToCart(item.id)}
                    disabled={addingId === item.id}
                    className="bg-white text-black font-body font-semibold text-xs px-3.5 py-1.5 rounded-full hover:bg-white/90 active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    {addingId === item.id ? 'Đang thêm...' : 'Đặt lịch'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ON-PAGE LIQUID-GLASS BOOKING MODAL (Không chuyển sang code cũ!) */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-0 duration-200">
          <div
            className="liquid-glass-strong rounded-[1.75rem] w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-white/20 shadow-2xl relative"
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-5 right-5 liquid-glass w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white transition cursor-pointer"
              aria-label="Đóng"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-8">
              <span className="liquid-glass rounded-full px-3 py-1 text-xs text-white/90 font-body">
                ⚡ {activeModalItem.turnaround} • {activeModalItem.deliveryFormat}
              </span>
              <h3 className="font-heading italic text-white text-3xl sm:text-4xl tracking-tight leading-snug">
                {activeModalItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 font-body font-light leading-relaxed">
                {activeModalItem.shortDescription}
              </p>
            </div>

            {/* MV PRESENTATION: Video Demo */}
            {activeModalItem.slug === 'edit-mv-presentation' && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowMvVideo(!showMvVideo)}
                  className="w-full py-2 px-3 rounded-xl border border-sky-400/40 bg-sky-500/20 text-sky-200 hover:bg-sky-500/30 text-xs font-body font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    {showMvVideo ? (
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    ) : (
                      <path d="M8 5v14l11-7z" />
                    )}
                  </svg>
                  <span>{showMvVideo ? 'Đóng Video Mẫu MV' : '▶ Xem Video Mẫu MV Presentation'}</span>
                </button>

                {showMvVideo && (
                  <div className="rounded-xl overflow-hidden border border-white/20 bg-black shadow-lg">
                    <video
                      src="/videos/edit-mv-presentation.mp4"
                      controls
                      autoPlay
                      className="w-full aspect-video object-cover"
                    />
                    <div className="p-2 text-center text-[10px] text-white/70 font-body">
                      Video mẫu MV Presentation &quot;Professional Habits&quot; sinh viên LUK
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DEBATE: Shopee-Style Variant Picker */}
            {activeModalItem.category === 'DEBATE_RESOURCES' && (
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-body">
                  <span className="font-semibold text-white">Chọn Motion (Shopee Style):</span>
                  {DEBATE_MOTIONS.find((m) => m.id === selectedMotionId)?.inStock ? (
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Còn hàng ({DEBATE_MOTIONS.find((m) => m.id === selectedMotionId)?.stockCount} bộ)
                    </span>
                  ) : (
                    <span className="text-rose-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      Tạm hết hàng
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {DEBATE_MOTIONS.map((motion) => {
                    const isSelected = selectedMotionId === motion.id;
                    return (
                      <button
                        key={motion.id}
                        type="button"
                        onClick={() => setSelectedMotionId(motion.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer relative font-body select-none ${
                          isSelected
                            ? 'border-orange-400 bg-orange-500/25 text-orange-300 font-semibold ring-1 ring-orange-400/50'
                            : motion.inStock
                            ? 'border-white/15 hover:border-white/35 text-white/80 bg-white/5'
                            : 'border-dashed border-white/20 text-white/40 bg-white/5 line-through'
                        }`}
                      >
                        {motion.name}
                        {!motion.inStock && (
                          <span className="ml-1 text-[10px] text-rose-400 font-normal no-underline inline-block">
                            (Hết)
                          </span>
                        )}
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price Box */}
            <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between border border-white/10">
              <div>
                <span className="text-[10px] text-white/60 font-body uppercase block">
                  Báo giá tham khảo
                </span>
                <span className="font-heading italic text-white text-3xl">
                  {activeModalItem.startingPrice > 0
                    ? formatVND(activeModalItem.startingPrice)
                    : 'Liên hệ'}
                </span>
              </div>
              <div className="text-right text-xs text-white/80 font-body">
                <span className="text-emerald-400 font-semibold block">✓ Chưa trừ tiền trước</span>
                <span className="text-white/60 text-[11px]">Admin xác nhận &amp; gửi mã VietQR</span>
              </div>
            </div>

            {/* Lịch bàn giao dự kiến */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-white/70 font-body">
                Lịch trình các mốc:
              </h5>
              <div className="space-y-1.5 text-xs text-white/80 font-body font-light">
                <div className="liquid-glass rounded-xl p-2.5 flex items-center justify-between">
                  <span>1. Tiếp nhận tài liệu:</span>
                  <span className="font-medium text-white">Ngay khi gửi đơn</span>
                </div>
                <div className="liquid-glass rounded-xl p-2.5 flex items-center justify-between">
                  <span>2. Bàn giao bản thảo nháp:</span>
                  <span className="font-medium text-white">Sau 12 - 24 giờ</span>
                </div>
                <div className="liquid-glass rounded-xl p-2.5 flex items-center justify-between">
                  <span>3. Hỗ trợ chỉnh sửa 1-1:</span>
                  <span className="font-medium text-emerald-400">Miễn phí hoàn toàn</span>
                </div>
              </div>
            </div>

            {/* Form đặt lịch */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-white font-body">
                  Số lượng / Số đề tài:
                </label>
                <div className="flex items-center liquid-glass rounded-full p-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/10"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white font-body">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/10"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-white/80 font-body block mb-1.5">
                  Ghi chú yêu cầu của bạn (Môn học, deadline, link Drive nguồn):
                </label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={3}
                  placeholder="Ví dụ: Đề tài môn Kinh tế quốc tế, deadline 20h tối mai..."
                  className="liquid-glass rounded-2xl w-full p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 resize-none font-body"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="liquid-glass rounded-full px-5 py-2.5 text-xs text-white/80 hover:text-white font-body cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleModalAddToCart}
                  disabled={isSubmitting}
                  className="bg-white text-black font-body font-semibold text-xs px-6 py-2.5 rounded-full hover:bg-white/90 active:scale-95 transition shadow-lg cursor-pointer"
                >
                  {justAdded ? '✓ Đã thêm vào giỏ!' : isSubmitting ? 'Đang xử lý...' : 'Thêm Vào Giỏ & Đặt Lịch'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
