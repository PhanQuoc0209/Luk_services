'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Shield, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '@/components/providers/AppProvider';

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        await refreshUser();
        if (data.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/account/orders');
        }
      } else {
        setError(data.error || 'Đăng nhập không thành công.');
      }
    } catch {
      setError('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillQuick = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-luk-card border border-luk-border text-luk-blueLight">
          <LogIn className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-white">Đăng nhập LUK Services</h1>
        <p className="text-xs text-luk-muted">
          Quản lý tiến độ đơn hàng và trao đổi trực tiếp với ban phụ trách
        </p>
      </div>

      <div className="rounded-2xl border border-luk-border bg-luk-card p-6 shadow-xl space-y-5">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-luk-text block mb-1">
              Email tài khoản
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ten@lukglobal.vn"
              className="w-full rounded-lg border border-luk-border bg-luk-bg px-3.5 py-2 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-luk-text block mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-luk-border bg-luk-bg px-3.5 py-2 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-luk-blue py-2.5 text-xs font-semibold text-white hover:bg-luk-blueHover active:scale-95 disabled:opacity-50 transition shadow"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Đăng nhập</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="border-t border-luk-border pt-4 space-y-2">
          <p className="text-[11px] text-luk-dim uppercase font-bold text-center">
            Tài khoản kiểm thử nhanh (Demo):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillQuick('admin@lukglobal.vn', 'AdminLuk@2026!')}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Hệ Thống</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillQuick('student@lukglobal.vn', 'Student@2026!')}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-500/20 transition"
            >
              <User className="h-3.5 w-3.5" />
              <span>Khách hàng (SV)</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-luk-muted">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-blue-400 hover:underline font-medium">
            Đăng ký tài khoản mới
          </Link>
        </div>
      </div>
    </div>
  );
}
