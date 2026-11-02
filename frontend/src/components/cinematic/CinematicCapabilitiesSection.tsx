'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FadingVideo } from './FadingVideo';
import { formatVND } from '@/lib/vietqr';
import { useApp } from '@/components/providers/AppProvider';

const CAPABILITIES_VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4';

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
}

export interface ServiceCapabilityItem {
  id: string;
  categoryKey: string;
  title: string;
  subtitle: string;
  iconPath: string;
  tags: string[];
  description: string;
  startingPrice: string;
  turnaround: string;
}

const CARDS_DATA: ServiceCapabilityItem[] = [
  {
    id: 'edit-video',
    categoryKey: 'VIDEO_EDITING',
    title: 'Edit Video Chuẩn LUK',
    subtitle: 'Thuyết Trình & Recap CLB',
    iconPath:
      'M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z',
    tags: ['4K 60fps', 'Recap Sự Kiện', 'TikTok Đồ Án', 'Lọc Âm'],
    description:
      'Dựng video thuyết trình đồ án, highlight reel sự kiện CLB và video môn học chuẩn phòng thu, chèn phụ đề song ngữ và hiệu ứng chuyển cảnh mượt mà.',
    startingPrice: '79.000đ',
    turnaround: 'Bàn giao 24h',
  },
  {
    id: 'slide-design',
    categoryKey: 'SLIDE_DESIGN',
    title: 'Slide Đồ Án & Luận Văn',
    subtitle: 'Chuẩn Hội Đồng Bảo Vệ',
    iconPath:
      'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z',
    tags: ['Khóa Luận', 'Pitch Deck', 'Master Layout', 'Tối Giản'],
    description:
      'Chuẩn hóa slide bảo vệ khóa luận tốt nghiệp, pitch deck khởi nghiệp và đồ án lớn. Trực quan hóa dữ liệu thống kê, biểu đồ sắc nét và đồng bộ nhận diện.',
    startingPrice: '99.000đ',
    turnaround: 'Bàn giao 24-48h',
  },
  {
    id: 'transcript',
    categoryKey: 'TRANSCRIPT_EDITING',
    title: 'Gỡ Băng Transcript 99.5%',
    subtitle: 'NCKH & Dịch Phụ Đề',
    iconPath:
      'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Zm5 8a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V20H9v2h6v-2h-2v-3.08A7 7 0 0 0 19 10h-2Z',
    tags: ['Chính Xác 99.5%', 'Phỏng Vấn Sâu', 'Dịch SRT', 'Timestamp'],
    description:
      'Chuyển hóa file ghi âm phỏng vấn định tính NCKH thành văn bản Word chuẩn format đại học, đồng bộ timeline phụ đề song ngữ từng mili-giây.',
    startingPrice: '80.000đ',
    turnaround: 'Bàn giao 12-24h',
  },
  {
    id: 'ai-pro',
    categoryKey: 'AI_ACCOUNTS',
    title: 'Tài Khoản AI Pro',
    subtitle: 'Nâng Cấp Chính Chủ',
    iconPath:
      'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z',
    tags: ['CapCut Pro', 'ChatGPT-4o', 'Gemini 2TB', 'Bảo Hành 1:1'],
    description:
      'Nâng cấp chính chủ email cá nhân các công cụ AI hàng đầu: CapCut Pro, ChatGPT-4o, Google Gemini Advanced 2TB và Canva Pro. Kích hoạt trong 5 phút.',
    startingPrice: '59.000đ',
    turnaround: 'Giao ngay 5 phút',
  },
  {
    id: 'debate-bp',
    categoryKey: 'DEBATE_RESOURCES',
    title: 'Tài Liệu Debate BP & NCKH',
    subtitle: 'Học Thuật Mở Rộng',
    iconPath:
      'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6Z',
    tags: ['Debate BP', 'Case Study', 'Đề Cương Mẫu', 'Tải Ngay'],
    description:
      'Kho tài liệu tranh biện British Parliamentary, hệ thống luận điểm kinh tế xã hội và bộ đề cương nghiên cứu khoa học đạt giải sinh viên.',
    startingPrice: 'Miễn phí & Premium',
    turnaround: 'Tải file tức thì',
  },
  {
    id: 'poster-design',
    categoryKey: 'SLIDE_DESIGN',
    title: 'Thiết Kế Poster & Infographic',
    subtitle: 'Đồ Họa & In Ấn',
    iconPath:
      'M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z',
    tags: ['Poster NCKH', 'Infographic Đồ Án', 'Vector In Ấn', 'A0/A1'],
    description:
      'Thiết kế poster báo cáo hội thảo khoa học, infographic trực quan hóa dữ liệu nghiên cứu và ấn phẩm truyền thông sự kiện theo chuẩn in ấn độ phân giải cao.',
    startingPrice: '89.000đ',
    turnaround: 'Bàn giao 24h',
  },
];

interface CinematicCapabilitiesSectionProps {
  services?: ServiceItemData[];
}

export function CinematicCapabilitiesSection({ services = [] }: CinematicCapabilitiesSectionProps) {
  const { addToCartAndOpen } = useApp();
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [activeModalCard, setActiveModalCard] = useState<ServiceCapabilityItem | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Listen to open category event from Navbar
  useEffect(() => {
    const handleOpenCat = (e: any) => {
      const catKey = e?.detail?.categoryKey;
      if (catKey) {
        const found = CARDS_DATA.find((c) => c.categoryKey === catKey);
        if (found) {
          setActiveModalCard(found);
        }
      }
    };
    window.addEventListener('luk-open-capability', handleOpenCat);
    return () => window.removeEventListener('luk-open-capability', handleOpenCat);
  }, []);

  const scrollLeft = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  const handleQuickAdd = async (serviceId: string) => {
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

  const currentCategoryPackages = activeModalCard
    ? services.filter((s) => s.category === activeModalCard.categoryKey)
    : [];

  return (
    <section
      id="capabilities"
      className="min-h-screen relative w-full overflow-hidden flex flex-col justify-between py-24 transition-colors duration-700"
    >
      {/* 1. CINEMATIC VIDEO BACKGROUND: Preserved in BOTH Day & Night modes! */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Daytime sky background with natural atmospheric depth */}
        <div
          className="daytime-sky-bg absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 25%, #7dd3fc 55%, #bae6fd 80%, #e0f2fe 100%)',
          }}
        />

        {/* Daytime Blooming Aura for Crystal Flower Island */}
        <div
          className="daytime-sky-bg absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[720px] h-[340px] sm:h-[460px] rounded-full pointer-events-none blur-[40px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(251, 146, 60, 0.35) 0%, rgba(56, 189, 248, 0.25) 50%, transparent 75%)',
          }}
        />

        {/* Video: In dark mode it is normal. In light mode it uses mix-blend-screen with enhanced blooming clarity */}
        <div className="absolute inset-0">
          <FadingVideo
            src={CAPABILITIES_VIDEO_SRC}
            className="cinematic-video absolute inset-0 w-full h-full object-cover z-0"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-10 lg:px-16 flex flex-col justify-between max-w-[1536px] mx-auto w-full space-y-10">
        
        {/* Header with Horizontal Navigation Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-sm font-body mb-3 tracking-wider uppercase opacity-80">
              // Hệ Sinh Thái Dịch Vụ (Capabilities)
            </p>
            <h2 className="font-heading italic text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px]">
              Dịch Vụ
              <br />
              Trọng Tâm
            </h2>
            <p className="mt-3 text-xs sm:text-sm font-body font-light max-w-xl leading-relaxed opacity-75">
              Bấm &quot;Xem chi tiết&quot; ở từng dịch vụ để mở danh sách hình ảnh các gói và đặt dịch vụ trực tiếp gọn gàng.
            </p>
          </div>

          {/* Navigation Controls: Mũi tên trượt ngang */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs font-body opacity-60 hidden sm:inline">
              Trượt ngang để xem các dịch vụ →
            </span>
            <button
              type="button"
              onClick={scrollLeft}
              className="liquid-glass w-11 h-11 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
              aria-label="Trượt sang trái"
            >
              <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={scrollRight}
              className="liquid-glass w-11 h-11 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
              aria-label="Trượt sang phải"
            >
              <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Các ô hình chữ nhật, vuông liquid-glass có sẵn — trượt ngang mượt mà */}
        <div
          ref={scrollTrackRef}
          className="flex items-stretch gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-8 pt-2 px-1"
        >
          {CARDS_DATA.map((card) => (
            <div
              key={card.id}
              className="liquid-glass rounded-[1.35rem] p-6 w-[320px] sm:w-[350px] md:w-[380px] shrink-0 min-h-[400px] flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300 snap-start shadow-xl group"
            >
              <div>
                {/* Top row: 44x44 nested liquid-glass square with white icon + pill tags */}
                <div className="flex items-start justify-between gap-4">
                  <div className="liquid-glass w-11 h-11 rounded-[0.75rem] flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d={card.iconPath} />
                    </svg>
                  </div>

                  {/* Pill tags */}
                  <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                    {card.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="liquid-glass rounded-full px-2.5 py-0.5 text-[11px] font-body"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Middle: Title, Subtitle, Description */}
                <div className="my-5 space-y-2">
                  <span className="text-[11px] uppercase tracking-wider font-body opacity-60">
                    ⚡ {card.turnaround}
                  </span>
                  <h3 className="font-heading italic text-3xl sm:text-4xl tracking-[-1px] leading-tight group-hover:opacity-85 transition-opacity">
                    {card.title}
                  </h3>
                  <p className="text-xs font-body font-light leading-relaxed opacity-75 line-clamp-3">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Bottom: Price + Nút Xem Chi Tiết theo đúng Ảnh 2 */}
              <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] block font-body uppercase opacity-50">
                    BÁO GIÁ TỪ
                  </span>
                  <span className="font-heading italic text-2xl">
                    {card.startingPrice}
                  </span>
                </div>

                {/* Nút Xem Chi Tiết */}
                <button
                  type="button"
                  onClick={() => setActiveModalCard(card)}
                  className="bg-black text-white dark:bg-white dark:text-black font-body font-semibold text-xs px-4 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Xem chi tiết</span>
                  <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          MODAL DANH SÁCH CHI TIẾT CÓ HÌNH ẢNH ĐẦY ĐỦ (ĐÃ FIX LỖI CUỘN/LƯỚT TRONG ẢNH 5!)
         ======================================================== */}
      {activeModalCard && (
        <div
          onClick={() => setActiveModalCard(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in-0 duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="liquid-glass-strong rounded-[1.75rem] w-full max-w-4xl max-h-[90vh] flex flex-col p-6 sm:p-8 shadow-2xl relative border border-white/20"
            role="dialog"
            aria-modal="true"
            style={{ overflow: 'hidden' }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalCard(null)}
              className="absolute top-5 right-5 liquid-glass w-9 h-9 rounded-full flex items-center justify-center text-sm hover:scale-105 active:scale-95 transition cursor-pointer z-20"
              aria-label="Đóng"
            >
              ✕
            </button>

            {/* Modal Header (Fixed at top of modal) */}
            <div className="space-y-1.5 pr-10 border-b border-black/10 dark:border-white/10 pb-4 shrink-0">
              <span className="liquid-glass rounded-full px-3 py-1 text-xs font-body font-medium">
                ⚡ {activeModalCard.turnaround} • Hỗ trợ 1-1
              </span>
              <h3 className="font-heading italic text-3xl sm:text-4xl tracking-tight leading-snug">
                {activeModalCard.title}
              </h3>
              <p className="text-xs sm:text-sm font-body font-light opacity-80 leading-relaxed">
                {activeModalCard.description}
              </p>
              <div className="flex items-center justify-between pt-1 text-xs font-body">
                <span className="font-semibold uppercase tracking-wider opacity-70">
                  Danh sách gói ({currentCategoryPackages.length} gói dịch vụ):
                </span>
                <span className="text-emerald-500 dark:text-emerald-400 font-medium">
                  ✓ Cuộn chuột xuống để xem tất cả
                </span>
              </div>
            </div>

            {/* SCROLLABLE LIST OF SERVICES: Đã fix lỗi cuộn! (max-h-[58vh] overflow-y-auto) */}
            <div className="flex-1 overflow-y-auto py-4 pr-1.5 space-y-4" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                {currentCategoryPackages.length > 0 ? (
                  currentCategoryPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="liquid-glass rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.01] transition-all shadow-md group border border-black/10 dark:border-white/10"
                    >
                      {/* Image Thumbnail with Overlay Turnaround Badge */}
                      <div className="aspect-[16/10] w-full rounded-xl overflow-hidden mb-3 relative bg-black/10 dark:bg-white/5 shrink-0">
                        <img
                          src={pkg.imageUrl}
                          alt={pkg.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2 liquid-glass rounded-full px-2.5 py-0.5 text-[10px] font-body shadow-sm">
                          ⚡ {pkg.turnaround}
                        </div>
                      </div>

                      {/* Title & Desc */}
                      <div className="space-y-1.5 flex-1">
                        <h4 className="font-heading italic text-xl tracking-tight leading-snug">
                          {pkg.title}
                        </h4>
                        <p className="text-[11.5px] font-body font-light opacity-75 leading-relaxed line-clamp-3">
                          {pkg.shortDescription}
                        </p>
                      </div>

                      {/* Price & Action */}
                      <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[9.5px] uppercase block opacity-50 font-body">
                            Báo giá
                          </span>
                          <span className="font-heading italic text-lg font-semibold">
                            {pkg.startingPrice > 0 ? formatVND(pkg.startingPrice) : 'Liên hệ'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuickAdd(pkg.id)}
                          disabled={addingId === pkg.id}
                          className="bg-black text-white dark:bg-white dark:text-black font-body font-semibold text-xs px-4 py-2 rounded-full hover:opacity-90 active:scale-95 transition shadow-sm cursor-pointer whitespace-nowrap"
                        >
                          {addingId === pkg.id ? 'Đang thêm...' : 'Đặt lịch ngay'}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 liquid-glass rounded-2xl p-8 text-center text-sm font-body opacity-60">
                    Đang đồng bộ danh sách gói dịch vụ...
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Note */}
            <div className="pt-3 border-t border-black/10 dark:border-white/10 text-center text-[11px] font-body opacity-60 shrink-0">
              * Cuộn xuống để xem toàn bộ danh sách gói. Bấm &quot;Đặt lịch ngay&quot; để thêm vào giỏ hàng và nhận báo giá VietQR trong 5 phút.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
