'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ExternalLink } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error with digest for debugging
    console.error('[LUK Services Application Error]:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-luk-border bg-luk-card p-6 sm:p-8 text-center space-y-6 shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Đã có sự cố xảy ra
          </h2>
          <p className="text-xs sm:text-sm text-luk-muted leading-relaxed">
            Hệ thống gặp sự cố tạm thời khi tải nội dung. Điều này thường do kết nối cơ sở dữ liệu chưa sẵn sàng hoặc dịch vụ đang bảo trì.
          </p>
        </div>

        {error.digest && (
          <div className="rounded-lg bg-luk-bg/80 border border-luk-border p-3 text-left">
            <p className="text-[11px] font-mono text-luk-muted">
              <span className="text-luk-dim">Mã lỗi (Digest):</span>{' '}
              <span className="text-blue-400 font-semibold">{error.digest}</span>
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Thử lại</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-luk-border bg-luk-bg px-5 py-2.5 text-xs font-semibold text-luk-text hover:bg-luk-card transition"
          >
            <Home className="h-4 w-4" />
            <span>Về Trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
