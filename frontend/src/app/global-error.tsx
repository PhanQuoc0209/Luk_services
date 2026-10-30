'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[LUK Services Global Crash Error]:', error);
  }, [error]);

  return (
    <html lang="vi">
      <body style={{ margin: 0, backgroundColor: '#080E18', color: '#F1F5F9', fontFamily: 'sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '480px', width: '100%', background: '#101A29', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>LUK Services — Sự Cố Hệ Thống</h2>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px' }}>
              Ứng dụng gặp lỗi nghiêm trọng khi kết nối máy chủ. Vui lòng tải lại trang hoặc kiểm tra cấu hình biến môi trường trên Vercel.
            </p>
            {error.digest && (
              <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#60A5FA', background: '#080E18', padding: '8px 12px', borderRadius: '8px', marginBottom: '20px' }}>
                Digest: {error.digest}
              </p>
            )}
            <button
              onClick={() => reset()}
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Tải lại trang (Reload)
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
