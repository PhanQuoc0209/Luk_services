'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Check, ExternalLink, Clock } from 'lucide-react';
import { useApp } from '@/components/providers/AppProvider';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  linkUrl: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { refreshNotifications } = useApp();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      await refreshNotifications();
    } catch {
      // ignore
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="border-b border-luk-border pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Bell className="h-5 w-5 text-luk-blueLight" />
          <span>Lịch sử thông báo</span>
        </h1>
        <p className="text-xs text-luk-muted mt-1">
          Cập nhật kịp thời về báo giá, xác nhận thanh toán và các phiên bản bản thảo mới nhất
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-luk-muted">
          Đang tải danh sách thông báo...
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl border p-4 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                n.isRead
                  ? 'border-luk-border bg-luk-card/60 opacity-80'
                  : 'border-blue-500/40 bg-luk-card shadow-sm'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{n.title}</span>
                  {!n.isRead && (
                    <span className="h-2 w-2 rounded-full bg-luk-blue" />
                  )}
                </div>
                <p className="text-xs text-luk-muted leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-luk-dim block pt-1">
                  {new Date(n.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!n.isRead && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(n.id)}
                    className="flex items-center gap-1 rounded-lg border border-luk-border bg-luk-bg px-2.5 py-1 text-[11px] text-luk-muted hover:text-white transition"
                  >
                    <Check className="h-3 w-3" />
                    <span>Đã đọc</span>
                  </button>
                )}
                <Link
                  href={n.linkUrl}
                  onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                  className="flex items-center gap-1 rounded-lg bg-luk-blue px-3 py-1 text-[11px] font-medium text-white hover:bg-luk-blueHover transition"
                >
                  <span>Xem chi tiết</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-luk-border bg-luk-card p-12 text-center space-y-2">
          <Clock className="mx-auto h-8 w-8 text-luk-dim" />
          <h2 className="text-sm font-bold text-white">Chưa có thông báo nào</h2>
          <p className="text-xs text-luk-muted">
            Khi có cập nhật mới về đơn hàng hoặc báo giá, thông báo sẽ hiển thị tại đây.
          </p>
        </div>
      )}
    </div>
  );
}
