import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, SearchCode, Zap, ShieldCheck } from 'lucide-react';

export function TwinPromoBanners() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Banner 1: AI Pro Sinh Viên */}
      <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-[#121630] via-[#1A1A3A] to-[#10142C] p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden group">
        <div className="space-y-2.5 relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-[11px] font-bold text-indigo-400 border border-indigo-500/30">
            <Zap className="h-3.5 w-3.5" />
            Kích Hoạt Tức Thì
          </span>
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors duration-200">
            Hệ Sinh Thái Tài Khoản AI Pro Chuẩn Sinh Viên
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            Mở khóa đầy đủ tính năng CapCut Pro, ChatGPT Plus (GPT-4o), Google Gemini 2TB và Canva Pro. Kích hoạt trực tiếp trên email, bảo hành 1 đổi 1.
          </p>
        </div>

        <Link
          href="/services?cat=AI_ACCOUNTS"
          className="self-start inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 shadow-md shadow-indigo-600/20 relative z-10 cursor-pointer"
        >
          <span>Khám phá các gói AI Pro</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Banner 2: Dịch Vụ Chuẩn LUK */}
      <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-[#0C192E] via-[#102444] to-[#0A1628] p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden group">
        <div className="space-y-2.5 relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-bold text-blue-400 border border-blue-500/30">
            <ShieldCheck className="h-3.5 w-3.5" />
            Chất Lượng Cam Kết
          </span>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-200">
            Bộ 3 Dịch Vụ Sinh Viên: Edit, Transcript & Slide
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            Chuẩn hóa quy trình 10 bước nghiêm ngặt: nhận yêu cầu, gửi báo giá minh bạch, giao bản nháp duyệt miễn phí, xuất hóa đơn & thanh toán VietQR an toàn.
          </p>
        </div>

        <Link
          href="/orders/track"
          className="self-start inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 text-xs font-semibold text-white hover:from-blue-500 hover:to-cyan-500 transition-all duration-200 shadow-md shadow-blue-600/20 relative z-10 cursor-pointer"
        >
          <span>Tra cứu đơn hàng của bạn</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
