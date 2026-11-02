'use client';

import React, { useRef } from 'react';
import { FadingVideo } from './FadingVideo';

const CAPABILITIES_VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4';

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

export function CinematicCapabilitiesSection() {
  const scrollTrackRef = useRef<HTMLDivElement>(null);

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

  const handleCardClick = (categoryKey: string) => {
    const el = document.getElementById('services-schedule');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    window.dispatchEvent(
      new CustomEvent('luk-select-category', { detail: { categoryKey } })
    );
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
      <div className="relative z-10 px-8 md:px-16 lg:px-20 flex flex-col justify-between max-w-[1536px] mx-auto w-full space-y-12">
        {/* Header with Horizontal Navigation Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-sm font-body text-white/80 mb-4 tracking-wider">
              // Hệ Sinh Thái Dịch Vụ (Capabilities)
            </p>
            <h2 className="font-heading italic text-white text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px]">
              Dịch Vụ
              <br />
              Trọng Tâm
            </h2>
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
          className="flex items-stretch gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-6 pt-2 px-1 cursor-grab"
        >
          {CARDS_DATA.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.categoryKey)}
              className="liquid-glass rounded-[1.25rem] p-6 w-[320px] sm:w-[350px] md:w-[380px] shrink-0 min-h-[380px] flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300 snap-start border border-white/10 cursor-pointer group"
            >
              {/* Top row: 44x44 nested liquid-glass square with white icon + pill tags */}
              <div className="flex items-start justify-between gap-4">
                <div className="liquid-glass w-11 h-11 rounded-[0.75rem] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 fill-white text-white" viewBox="0 0 24 24">
                    <path d={card.iconPath} />
                  </svg>
                </div>

                {/* 4 small liquid-glass pill tags */}
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                  {card.tags.map((tag) => (
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
                <p className="text-xs text-white/75 font-body font-light leading-relaxed line-clamp-3">
                  {card.description}
                </p>
              </div>

              {/* Bottom: Price & Quick Action */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/50 block font-body uppercase">
                    Báo giá từ
                  </span>
                  <span className="font-heading italic text-white text-xl">
                    {card.startingPrice}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform font-body">
                  <span>Xem lịch trình</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
