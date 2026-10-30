'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, AlertCircle } from 'lucide-react';
import { useApp } from '@/components/providers/AppProvider';

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        await refreshUser();
        router.push('/account/orders');
      } else {
        setError(data.error || 'Đăng ký không thành công.');
      }
    } catch {
      setError('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-luk-card border border-luk-border text-luk-blueLight">
          <UserPlus className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-white">Đăng ký tài khoản LUK</h1>
        <p className="text-xs text-luk-muted">
          Lưu trữ lịch sử đơn hàng, xem trước bản nháp và nhận ưu đãi sinh viên
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
              Họ và tên <span className="text-luk-red">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn An"
              className="w-full rounded-lg border border-luk-border bg-luk-bg px-3.5 py-2 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-luk-text block mb-1">
              Email <span className="text-luk-red">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="an.nguyen@email.com"
              className="w-full rounded-lg border border-luk-border bg-luk-bg px-3.5 py-2 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-luk-text block mb-1">
              Số điện thoại liên hệ
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912 345 678"
              className="w-full rounded-lg border border-luk-border bg-luk-bg px-3.5 py-2 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-luk-text block mb-1">
              Mật khẩu <span className="text-luk-red">*</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
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
                <UserPlus className="h-4 w-4" />
                <span>Tạo tài khoản</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-luk-muted border-t border-luk-border pt-4">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-blue-400 hover:underline font-medium">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
