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
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Listen to open category event from Navbar
  useEffect(() => {
    const handleOpenCat = (e: any) => {
      const catKey = e?.detail?.categoryKey;
      if (catKey) {
        const found = CARDS_DATA.find((c) => c.categoryKey === catKey);
        if (found) {
          setExpandedCardId(found.id);
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

  const toggleExpand = (cardId: string) => {
    setExpandedCardId((prev) => (prev === cardId ? null : cardId));
  };

  const handleQuickAdd = async (e: React.MouseEvent, serviceId: string) => {
    e.stopPropagation();
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

  return (
    <section
      id="capabilities"
      className="min-h-screen relative w-full overflow-hidden bg-black flex flex-col justify-between py-24"
    >
      {/* Background video (full-bleed, no 120% scale) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <FadingVideo
          src={CAPABILITIES_VIDEO_SRC}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      </div>

      {/* Content: Giữ nguyên bố cục và phong cách typography của Space Page */}
      <div className="relative z-10 px-6 sm:px-10 lg:px-16 flex flex-col justify-between max-w-[1536px] mx-auto w-full space-y-10">
        
        {/* Header with Horizontal Navigation Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-sm font-body text-white/80 mb-3 tracking-wider uppercase">
              // Hệ Sinh Thái Dịch Vụ (Capabilities)
            </p>
            <h2 className="font-heading italic text-white text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px]">
              Dịch Vụ
              <br />
              Trọng Tâm
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-white/70 font-body font-light max-w-xl leading-relaxed">
              Bấm vào từng ô dịch vụ để mở rộng danh sách chi tiết các gói và đặt dịch vụ ngay tại đây mà không cần chuyển trang.
            </p>
          </div>

          {/* Navigation Controls: Mũi tên trượt ngang */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs text-white/60 font-body hidden sm:inline">
              Trượt ngang để xem các dịch vụ →
            </span>
            <button
              type="button"
              onClick={scrollLeft}
              className="liquid-glass w-11 h-11 rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition cursor-pointer"
              aria-label="Trượt sang trái"
            >
              <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={scrollRight}
              className="liquid-glass w-11 h-11 rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition cursor-pointer"
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
          className="flex items-start gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-8 pt-2 px-1"
        >
          {CARDS_DATA.map((card) => {
            const isExpanded = expandedCardId === card.id;
            const categoryPackages = services.filter((s) => s.category === card.categoryKey);

            return (
              <div
                key={card.id}
                onClick={() => toggleExpand(card.id)}
                className={`liquid-glass rounded-[1.35rem] p-6 shrink-0 flex flex-col justify-between transition-all duration-300 snap-start border cursor-pointer group ${
                  isExpanded
                    ? 'w-[360px] sm:w-[420px] md:w-[460px] border-white/40 shadow-2xl scale-[1.01]'
                    : 'w-[320px] sm:w-[350px] md:w-[380px] min-h-[400px] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  {/* Top row: 44x44 nested liquid-glass square with white icon + pill tags */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="liquid-glass w-11 h-11 rounded-[0.75rem] flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 fill-white text-white" viewBox="0 0 24 24">
                        <path d={card.iconPath} />
                      </svg>
                    </div>

                    {/* Pill tags */}
                    <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                      {card.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="liquid-glass rounded-full px-2.5 py-0.5 text-[11px] text-white font-body"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Middle: Title, Subtitle, Description */}
                  <div className="my-4 space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-white/50 font-body">
                      ⚡ {card.turnaround}
                    </span>
                    <h3 className="font-heading italic text-white text-3xl sm:text-4xl tracking-[-1px] leading-tight group-hover:text-white/80 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-white/75 font-body font-light leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Toggle Bar */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-white/50 block font-body uppercase">
                      Báo giá từ
                    </span>
                    <span className="font-heading italic text-white text-xl">
                      {card.startingPrice}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all font-body ${
                      isExpanded
                        ? 'bg-white text-black shadow-md'
                        : 'liquid-glass text-white group-hover:bg-white/10'
                    }`}
                  >
                    <span>{isExpanded ? 'Đóng danh sách' : 'Xem danh sách gói'}</span>
                    <span className="transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                      ▾
                    </span>
                  </span>
                </div>

                {/* INLINE EXPANDED LIST (Mở rộng thẻ trực tiếp hiển thị danh sách gói tại chỗ!) */}
                {isExpanded && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-5 pt-4 border-t border-white/15 space-y-3 cursor-default animate-in fade-in-0 duration-300"
                  >
                    <div className="flex items-center justify-between text-xs font-body text-white/70">
                      <span className="font-semibold text-white uppercase text-[11px] tracking-wider">
                        Danh sách các gói ({categoryPackages.length || 3} gói):
                      </span>
                      <span className="text-[10.5px] text-emerald-400">⚡ Hỗ trợ 1-1</span>
                    </div>

                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                      {categoryPackages.length > 0 ? (
                        categoryPackages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="liquid-glass rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border border-white/10 hover:border-white/20 transition-all"
                          >
                            <div className="space-y-1 max-w-[65%]">
                              <h5 className="font-heading italic text-white text-base tracking-tight leading-snug">
                                {pkg.title}
                              </h5>
                              <p className="text-[11px] text-white/60 font-body font-light line-clamp-1">
                                {pkg.shortDescription}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-white/50 font-body">
                                <span>⚡ {pkg.turnaround}</span>
                                <span>•</span>
                                <span>{pkg.deliveryFormat}</span>
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0">
                              <span className="font-heading italic text-white text-base">
                                {pkg.startingPrice > 0 ? formatVND(pkg.startingPrice) : 'Liên hệ'}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handleQuickAdd(e, pkg.id)}
                                disabled={addingId === pkg.id}
                                className="bg-white text-black font-body font-semibold text-[11px] px-3 py-1 rounded-full hover:bg-white/90 active:scale-95 transition shadow-sm cursor-pointer whitespace-nowrap"
                              >
                                {addingId === pkg.id ? 'Đang thêm...' : 'Đặt lịch'}
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="liquid-glass rounded-xl p-3 text-center text-xs text-white/60 font-body">
                          Đang cập nhật các gói dịch vụ mới...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
