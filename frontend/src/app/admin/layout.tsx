import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Shield,
  Home,
  LogOut,
  FileCheck,
  Layers,
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login?error=admin_required');
  }

  return (
    <div className="min-h-screen bg-luk-bg flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-luk-border bg-[#050A12] flex flex-col justify-between shrink-0">
        <div className="p-5 space-y-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-luk-red font-black text-white text-xs">
              LUK
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                Admin Console
              </p>
              <p className="text-[10px] text-amber-400 font-medium">Quyền Quản trị viên</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-luk-muted hover:bg-luk-card hover:text-white transition"
            >
              <LayoutDashboard className="h-4 w-4 text-luk-blueLight" />
              <span>Tổng quan & Chỉ số</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-luk-muted hover:bg-luk-card hover:text-white transition"
            >
              <ShoppingBag className="h-4 w-4 text-emerald-400" />
              <span>Quản lý đơn hàng</span>
            </Link>

            <Link
              href="/admin/services"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-luk-muted hover:bg-luk-card hover:text-white transition"
            >
              <Layers className="h-4 w-4 text-amber-400" />
              <span>Quản lý dịch vụ</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-luk-muted hover:bg-luk-card hover:text-white transition"
            >
              <CreditCard className="h-4 w-4 text-purple-400" />
              <span>Cấu hình VietQR & Bank</span>
            </Link>
          </nav>
        </div>

        {/* Footer of Sidebar */}
        <div className="p-5 border-t border-luk-border space-y-2 text-xs">
          <div className="rounded-lg bg-luk-card p-2.5 border border-luk-border">
            <p className="text-[11px] font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-luk-dim truncate">{user.email}</p>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-luk-muted hover:text-white transition"
          >
            <Home className="h-4 w-4" />
            <span>Xem giao diện khách</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
