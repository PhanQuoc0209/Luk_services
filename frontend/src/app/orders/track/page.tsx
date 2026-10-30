'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, ArrowRight, AlertCircle, FileSearch } from 'lucide-react';

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderCode, setOrderCode] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanCode = orderCode.trim().toUpperCase();
    if (!cleanCode) {
      setError('Vui lòng nhập mã đơn hàng.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${cleanCode}`);
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          router.push(`/orders/${cleanCode}`);
          return;
        }
      }
      setError('Không tìm thấy đơn hàng với mã này. Vui lòng kiểm tra lại mã đơn.');
    } catch {
      setError('Lỗi khi tra cứu đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-luk-card border border-luk-border text-luk-blueLight shadow-sm">
          <FileSearch className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Tra cứu tiến độ đơn dịch vụ
        </h1>
        <p className="text-xs text-luk-muted max-w-md mx-auto">
          Nhập mã đơn hàng được cấp khi gửi yêu cầu để theo dõi trạng thái, xem báo giá, quét mã VietQR và tải bản nháp.
        </p>
      </div>

      <div className="rounded-2xl border border-luk-border bg-luk-card p-6 md:p-8 shadow-xl">
        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-luk-text block mb-1.5">
              Mã đơn hàng <span className="text-luk-red">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: LUK-2610-8888"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              className="w-full rounded-xl border border-luk-border bg-luk-bg px-4 py-3 text-sm text-luk-text font-mono uppercase tracking-wider placeholder-luk-dim focus:border-luk-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-luk-muted block mb-1.5">
              Email hoặc Số điện thoại đặt hàng (tùy chọn để xác thực):
            </label>
            <input
              type="text"
              placeholder="Nhập email hoặc SĐT..."
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full rounded-xl border border-luk-border bg-luk-bg px-4 py-2.5 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-luk-blue py-3 text-xs font-semibold text-white hover:bg-luk-blueHover active:scale-95 transition shadow-lg mt-2"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Tra cứu tiến độ ngay</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-luk-border pt-4 flex items-center justify-between text-[11px] text-luk-dim">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Mã đơn hàng được gửi tự động vào email bạn đã đăng ký</span>
          </div>
          <span className="font-mono text-blue-400">Đơn mẫu thử: LUK-2610-8888</span>
        </div>
      </div>
    </div>
  );
}
