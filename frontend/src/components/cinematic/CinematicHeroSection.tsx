'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FadingVideo } from './FadingVideo';
import { BlurText } from './BlurText';

const HERO_VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4';

const PARTNERS = ['FTU', 'NEU', 'VNU', 'RMIT', 'Canva', 'CapCut', 'OpenAI'];

export function CinematicHeroSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black flex flex-col justify-between">
      {/* Background Video: 120% width/height, top-aligned, centered horizontally */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <FadingVideo
          src={HERO_VIDEO_SRC}
          className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
          style={{ width: '120%', height: '120%' }}
        />
      </div>

      {/* Hero Content (centered, pt-24 px-4 flex-1 flex flex-col items-center justify-center text-center z-10) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-28 pb-12 px-4 max-w-4xl mx-auto text-center">
        {/* Badge (delay 0.4s) — Dòng thông báo tinh tế */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="liquid-glass rounded-full inline-flex items-center gap-2 p-1 pr-3.5 mb-6"
        >
          <span className="bg-white text-black px-3 py-1 text-xs font-semibold rounded-full font-body">
            LUK 2026
          </span>
          <span className="text-sm text-white/90 font-body">
            Hệ Sinh Thái Dịch Vụ Học Thuật &amp; Sáng Tạo Sinh Viên
          </span>
        </motion.div>

        {/* Headline — BlurText component with Project Name */}
        <BlurText
          text="LUK Services — Chinh Phục Mọi Đồ Án & Nghiên Cứu"
          className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] max-w-3xl justify-center tracking-[-4px]"
        />

        {/* Subheading (delay 0.8s) */}
        <motion.p
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
          className="mt-6 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight text-center"
        >
          Biên tập Video đồ án, Chuẩn hóa Slide khóa luận, Gỡ băng Transcript 99.5%, Debate BP và Cung cấp tài khoản AI Pro chính chủ hỗ trợ sinh viên 24/7.
        </motion.p>

        {/* CTAs (delay 1.1s) */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: 'easeOut' }}
          className="flex items-center gap-6 mt-6"
        >
          {/* Primary CTA */}
          <a
            href="#capabilities"
            className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium text-white flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform font-body"
          >
            <span>Khám Phá Dịch Vụ</span>
            <svg
              className="w-5 h-5 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>

          {/* Secondary CTA */}
          <a
            href="#services-schedule"
            className="text-sm font-medium text-white flex items-center gap-2 hover:opacity-80 transition-opacity font-body"
          >
            <span>Lịch Bàn Giao &amp; Báo Giá</span>
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          </a>
        </motion.div>

        {/* Stats row: Giữ nguyên 100% layout gốc 2 thẻ liquid-glass 220px của Space Page */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease: 'easeOut' }}
          className="flex flex-wrap items-stretch justify-center gap-4 mt-8"
        >
          {/* Stat Card 1 */}
          <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] flex flex-col justify-between text-left">
            <div>
              <svg
                className="w-7 h-7 stroke-white mb-3"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <p className="font-heading italic text-white text-4xl tracking-[-1px] leading-none">
                99.5%
              </p>
              <p className="text-xs text-white font-body font-light mt-2">
                Độ chính xác Transcript NCKH
              </p>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] flex flex-col justify-between text-left">
            <div>
              <svg
                className="w-7 h-7 stroke-white mb-3"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div>
              <p className="font-heading italic text-white text-4xl tracking-[-1px] leading-none">
                5 Phút
              </p>
              <p className="text-xs text-white font-body font-light mt-2">
                Kích hoạt AI &amp; Báo giá đồ án
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Partners (bottom of hero, delay 1.4s) */}
      <motion.div
        initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
        animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center gap-4 pb-8"
      >
        <span className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body">
          Đồng hành cùng sinh viên các trường đại học hàng đầu
        </span>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {PARTNERS.map((partner) => (
            <span
              key={partner}
              className="font-heading italic text-white text-2xl md:text-3xl tracking-tight select-none opacity-90 hover:opacity-100 transition-opacity"
            >
              {partner}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
