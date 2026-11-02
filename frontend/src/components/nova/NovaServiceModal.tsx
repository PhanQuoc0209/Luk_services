'use client';

import React from 'react';
import { X, CheckCircle2, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../providers/AppProvider';

export interface ServiceDetailData {
  id: string;
  group: 'CREATE' | 'LEARN' | 'GROW';
  code: string;
  name: string;
  quote: string;
  description: string;
  deliverables: string[];
  turnaround: string;
  suggestedPrice: number;
  slug: string;
  imageUrl: string;
  categoryKey: string;
}

interface NovaServiceModalProps {
  service: ServiceDetailData | null;
  onClose: () => void;
}

export function NovaServiceModal({ service, onClose }: NovaServiceModalProps) {
  const { addToCartAndOpen, openCartDrawer } = useApp();

  if (!service) return null;

  const handleBookService = async () => {
    try {
      await addToCartAndOpen(service.slug, 1);
    } catch {
      openCartDrawer();
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-service-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-nova-navy/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white text-nova-navy shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-300 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Visual Bar */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-nova-navy">
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-full object-cover object-center filter brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-sm transition-colors active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Group and Code Badge */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-nova-champagne/90 text-nova-navy text-[10px] font-bold tracking-widest uppercase">
                {service.group}
              </span>
              <span className="font-serif italic text-sm text-nova-champagne">
                {service.code}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <Clock className="w-3.5 h-3.5 text-nova-champagne" />
              <span>{service.turnaround}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3
              id="modal-service-title"
              className="text-2xl sm:text-3xl font-heading font-bold text-nova-navy tracking-tight mb-2"
            >
              {service.name}
            </h3>
            <p className="font-serif italic text-base sm:text-lg text-nova-blue leading-snug">
              “{service.quote}”
            </p>
          </div>

          <p className="text-sm text-nova-slate leading-relaxed">
            {service.description}
          </p>

          {/* Scope of Deliverables */}
          <div className="rounded-xl bg-slate-50 p-5 border border-slate-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-nova-navy">
              Hạng mục thực hiện chi tiết:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.deliverables.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Commitment & CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-nova-slate">
              <ShieldCheck className="w-4 h-4 text-nova-champagne shrink-0" />
              <span>Đội ngũ NOVA trực tiếp thực hiện · Hỗ trợ chỉnh sửa</span>
            </div>

            <button
              type="button"
              onClick={handleBookService}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-nova-navy text-white hover:bg-nova-blue transition-all duration-200 text-xs sm:text-sm font-semibold tracking-wide shadow-md active:scale-95 group"
            >
              <span>Thêm vào giỏ &amp; Gửi yêu cầu</span>
              <ArrowRight className="w-4 h-4 text-nova-champagne group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
