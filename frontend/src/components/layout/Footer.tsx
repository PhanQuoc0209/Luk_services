'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Mail,
  Phone,
  CreditCard,
  Lock,
  CheckCircle,
  Zap,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-blue-200/60 dark:border-white/10 bg-gradient-to-b from-sky-50/90 via-blue-50/70 to-[#EBF4FE] dark:bg-[#050A12] text-slate-600 dark:text-slate-400 text-xs transition-colors duration-300">
      <div className="mx-auto max-w-[1536px] px-3 py-12 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cột 1: Về LUK Services */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-luk-red font-black text-white text-sm shadow">
                LUK
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Services</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Hệ Sinh Thái LUK</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Thương mại điện tử chuyên cung cấp Tài Khoản AI Pro chính chủ (CapCut, ChatGPT, Gemini, Canva) và Dịch vụ sinh viên cao cấp (Edit Chuẩn LUK, Transcript Chuẩn LUK, Slide Chuẩn LUK).
            </p>
            <div className="space-y-1.5 text-[11px] pt-1">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="h-4 w-4" />
                <span>Bảo hành 1 đổi 1 suốt thời gian sử dụng</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                <Zap className="h-4 w-4" />
                <span>Kích hoạt AI 5 phút, dịch vụ giao đúng hạn</span>
              </div>
            </div>
          </div>

          {/* Cột 2: Danh mục dịch vụ trọng tâm */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-blue-200/60 dark:border-white/10 pb-2">
              Danh mục học thuật &amp; dịch vụ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#services-catalog" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold transition flex items-center gap-1">
                  <span>🏆 Gói LUK Services (Edit • Slide • Trans • Debate)</span>
                </Link>
              </li>
              <li>
                <Link href="/services?cat=AI_ACCOUNTS" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  🤖 Tài Khoản AI Pro (CapCut, ChatGPT, Gemini, Canva)
                </Link>
              </li>
              <li>
                <Link href="/#services-catalog" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  📈 Môn Học Kinh Tế, SPSS &amp; Phân Tích Dữ Liệu
                </Link>
              </li>
              <li>
                <Link href="/#services-catalog" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  💻 Môn Học CNTT, Lập Trình &amp; Đồ Án Web/App
                </Link>
              </li>
              <li>
                <Link href="/debate" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  ⚖️ Kho Tài Liệu Debate BP &amp; NCKH Đại Học
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hướng dẫn & Quy trình */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-blue-200/60 dark:border-white/10 pb-2">
              Quy trình &amp; Cam kết
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>• Bước 1: Chọn gói AI hoặc dịch vụ cần làm</li>
              <li>• Bước 2: Thêm vào giỏ &amp; gửi yêu cầu đính kèm</li>
              <li>• Bước 3: Nhận báo giá minh bạch &amp; quét mã VietQR</li>
              <li>• Bước 4: Admin kích hoạt tài khoản / bàn giao bản nháp</li>
              <li>• Bước 5: Xem duyệt bản thảo, góp ý chỉnh sửa miễn phí</li>
              <li>• Bước 6: Nghiệm thu hoàn tất đơn hàng &amp; bảo hành</li>
            </ul>
          </div>

          {/* Cột 4: Hỗ trợ & Thanh toán */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-blue-200/60 dark:border-white/10 pb-2">
              Hỗ trợ sinh viên 24/7
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-white text-sm">0988.888.888</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
                <span>support@lukglobal.vn</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                Thanh toán an toàn qua VietQR
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                <span className="rounded bg-white text-slate-800 border border-blue-200 shadow-sm px-2 py-1 dark:bg-white/10 dark:text-slate-200 dark:border-white/10">VietQR</span>
                <span className="rounded bg-blue-100 text-blue-700 border border-blue-300 px-2 py-1 dark:bg-blue-600/30 dark:text-blue-300 dark:border-blue-500/30">MB Bank</span>
                <span className="rounded bg-pink-100 text-pink-700 border border-pink-300 px-2 py-1 dark:bg-pink-600/30 dark:text-pink-300 dark:border-pink-500/30">MoMo</span>
                <span className="rounded bg-emerald-100 text-emerald-700 border border-emerald-300 px-2 py-1 dark:bg-emerald-600/30 dark:text-emerald-300 dark:border-emerald-500/30">Napas 247</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-blue-200/60 dark:border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <p>© 2026 LUK Services — Nền tảng Tài Khoản AI Pro &amp; Dịch Vụ Sinh Viên.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-white transition">Điều khoản dịch vụ</Link>
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-white transition">Chính sách bảo mật</Link>
            <Link href="/orders/track" className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">Tra cứu đơn hàng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
