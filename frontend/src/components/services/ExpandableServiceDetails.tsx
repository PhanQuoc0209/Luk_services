/* Lucian UX/UI Prompt #288 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#288 */
'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { Layers, ShieldCheck, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface ExpandableServiceDetailsProps {
  service: {
    id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    turnaround: string;
    deliveryFormat: string;
    startingPrice: number;
    isFeatured?: boolean;
  };
}

export function ExpandableServiceDetails({ service }: ExpandableServiceDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState<number | undefined>(180);
  const innRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const uniqueId = useId();

  const SHUT_HEIGHT = 180;

  // Handle smooth toggle
  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
      if (innRef.current) {
        setHeight(innRef.current.offsetHeight);
      }
    } else {
      setHeight(SHUT_HEIGHT);
      // Smoothly return screen to start of details so user never loses their place
      if (headerRef.current) {
        const topPos = headerRef.current.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({
          top: Math.max(0, topPos),
          behavior: 'smooth',
        });
      }
    }
  };

  // Recalculate height on window resize if open
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
      if (innRef.current) {
        setHeight(innRef.current.offsetHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <div className={`ux u288-wrapper rounded-2xl border border-luk-border bg-luk-card p-6 space-y-3 ${isOpen ? 'is-open' : ''}`}>
      {/* Header */}
      <h2
        ref={headerRef}
        className="text-base font-bold text-white flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-luk-blueLight" />
          <span>Chi tiết dịch vụ & Phạm vi thực hiện</span>
        </span>
        <span className="text-[11px] font-semibold text-blue-400/90 flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Chuẩn LUK Cam Kết
        </span>
      </h2>

      {/* Expandable Container */}
      <div
        id={uniqueId}
        className="u288-dt"
        style={{ height: height !== undefined ? `${height}px` : undefined }}
      >
        <div ref={innRef} className="u288-in space-y-5 text-xs text-luk-muted leading-relaxed">
          {/* Main Description */}
          <div className="rounded-xl bg-luk-bg/80 p-4 border border-white/5 space-y-2">
            <p className="text-luk-text font-medium leading-relaxed">
              {service.description}
            </p>
            <p className="text-[11px] text-luk-dim">
              Tất cả các sản phẩm do LUK Services thực hiện đều được rà soát chất lượng 2 lớp trước khi bàn giao: kiểm tra định dạng, chuẩn tỷ lệ khung hình, không lỗi chính tả và bảo mật thông tin tuyệt đối.
            </p>
          </div>

          {/* Specifications Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Thông số & Cam kết kỹ thuật</span>
            </h4>
            <div className="overflow-x-auto rounded-xl border border-luk-border bg-luk-bg/50">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-luk-border/80 text-luk-dim font-semibold bg-white/[0.02]">
                    <th className="py-2.5 px-3">Hạng mục</th>
                    <th className="py-2.5 px-3">Tiêu chuẩn thực hiện</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luk-border/60 text-luk-muted">
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-luk-text">Thời gian xử lý</td>
                    <td className="py-2.5 px-3 text-white font-semibold">{service.turnaround}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-luk-text">Định dạng file xuất</td>
                    <td className="py-2.5 px-3">{service.deliveryFormat} (kèm file gốc nếu có)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-luk-text">Chính sách sửa đổi</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-medium">Hỗ trợ chỉnh sửa góp ý đến khi hài lòng</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-luk-text">Bảo hành & Hỗ trợ</td>
                    <td className="py-2.5 px-3">Bảo hành 1 đổi 1 tài khoản AI / Lưu trữ file dự án 30 ngày</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4-Step Student Workflow */}
          <div className="rounded-xl bg-luk-bg p-4 border border-luk-border space-y-2.5">
            <p className="font-bold text-xs text-white flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
              <span>Quy trình 4 bước chuẩn sinh viên:</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-luk-muted">
              <div className="flex items-start gap-2 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold text-[10px]">
                  1
                </span>
                <span>Thêm dịch vụ vào giỏ & xác nhận checkout (chưa cần thanh toán).</span>
              </div>
              <div className="flex items-start gap-2 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold text-[10px]">
                  2
                </span>
                <span>Admin LUK tiếp nhận file, tư vấn yêu cầu và chốt báo giá chính xác.</span>
              </div>
              <div className="flex items-start gap-2 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold text-[10px]">
                  3
                </span>
                <span>Quét mã VietQR tự động, thanh toán minh bạch theo mã đơn hàng.</span>
              </div>
              <div className="flex items-start gap-2 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold text-[10px]">
                  4
                </span>
                <span>Xem bản nháp preview trong tài khoản, duyệt file hoặc yêu cầu chỉnh sửa.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Show more / Show less Button */}
      <button
        type="button"
        className="u288-mr"
        aria-expanded={isOpen}
        aria-controls={uniqueId}
        onClick={handleToggle}
      >
        <span>{isOpen ? 'Thu gọn thông tin' : 'Xem thêm chi tiết dịch vụ'}</span>
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path
            d="M2.5 4.5L6 8l3.5-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
