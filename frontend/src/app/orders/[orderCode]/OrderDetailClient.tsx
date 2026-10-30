'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  User,
  Phone,
  Mail,
  Calendar,
  Layers,
  Paperclip,
  Download,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { formatVND } from '@/lib/vietqr';
import { OrderStatusProgress } from '@/components/orders/OrderStatusProgress';
import { OrderPaymentSection } from '@/components/orders/OrderPaymentSection';
import { OrderDraftWorkspace } from '@/components/orders/OrderDraftWorkspace';
import { OrderReviewSection } from '@/components/orders/OrderReviewSection';

export function OrderDetailClient({ orderCode }: { orderCode: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`/api/orders/${orderCode}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orderCode]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-luk-blue border-t-transparent" />
        <p className="mt-3 text-xs text-luk-muted">Đang tải hồ sơ đơn hàng #{orderCode}...</p>
      </div>
    );
  }

  if (!data?.order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <h2 className="text-base font-bold text-white">Không tìm thấy đơn hàng</h2>
        <p className="text-xs text-luk-muted">Mã đơn hàng không hợp lệ hoặc đã bị gỡ bỏ.</p>
        <Link
          href="/orders/track"
          className="inline-flex items-center gap-1.5 rounded-xl bg-luk-blue px-4 py-2 text-xs font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Tra cứu đơn hàng khác</span>
        </Link>
      </div>
    );
  }

  const { order, bankSetting } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luk-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/orders/track"
              className="text-luk-muted hover:text-luk-text transition p-1"
              aria-label="Quay lại"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
              Đơn hàng #{order.orderCode}
            </h1>
          </div>
          <p className="text-xs text-luk-muted pl-6">
            Khởi tạo lúc {new Date(order.createdAt).toLocaleString('vi-VN')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchOrder}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-lg border border-luk-border bg-luk-card px-3 py-1.5 text-xs text-luk-muted hover:text-white transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Cập nhật</span>
          </button>
        </div>
      </div>

      {/* 1. Visual Status Stepper */}
      <OrderStatusProgress currentStatus={order.status} />

      {/* 2. VietQR & Quote Payment Section */}
      <OrderPaymentSection
        orderCode={order.orderCode}
        quotes={order.quotes}
        payments={order.payments}
        bankSetting={bankSetting}
        onPaymentSubmitted={fetchOrder}
      />

      {/* 3. Draft & Feedback Workspace */}
      <OrderDraftWorkspace
        orderCode={order.orderCode}
        drafts={order.drafts}
        orderStatus={order.status}
        onFeedbackSubmitted={fetchOrder}
      />

      {/* 3.5. Customer Review Section (Completed Orders Only) */}
      <OrderReviewSection
        orderCode={order.orderCode}
        orderStatus={order.status}
        review={order.review}
        onReviewSubmitted={fetchOrder}
      />

      {/* 4. Order Details & Customer Source Files */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Ordered Items & General Notes */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-luk-border bg-luk-card p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-luk-blueLight" />
              <span>Dịch vụ trong đơn ({order.items.length})</span>
            </h2>

            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-luk-border bg-luk-bg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {item.serviceTitleSnapshot}
                    </span>
                    <span className="text-xs font-medium text-luk-muted">
                      Số lượng: <strong className="text-white">{item.quantity}</strong>
                    </span>
                  </div>

                  {item.itemNotes && (
                    <div className="rounded-lg bg-luk-card p-2.5 text-xs text-luk-muted border border-luk-border/60">
                      <span className="text-[11px] font-semibold text-luk-dim block">
                        Yêu cầu cụ thể:
                      </span>
                      {item.itemNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {order.generalNotes && (
              <div className="border-t border-luk-border pt-4">
                <span className="text-xs font-semibold text-luk-muted block mb-1">
                  Ghi chú chung của khách:
                </span>
                <p className="text-xs text-luk-text bg-luk-bg p-3 rounded-lg border border-luk-border">
                  {order.generalNotes}
                </p>
              </div>
            )}
          </div>

          {/* Uploaded Customer Source Files */}
          <div className="rounded-2xl border border-luk-border bg-luk-card p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-emerald-400" />
              <span>Tài liệu nguồn đã tải lên ({order.files.length})</span>
            </h2>

            {order.files.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {order.files.map((file: any) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-xl border border-luk-border bg-luk-bg p-3 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="h-4 w-4 text-luk-blueLight shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-white truncate">{file.originalName}</p>
                        <p className="text-[10px] text-luk-dim">
                          {(file.fileSize / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                    </div>

                    <a
                      href={`/api/files/${file.id}`}
                      download
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-luk-border bg-luk-card text-luk-muted hover:text-white hover:border-luk-blue transition ml-2 shrink-0"
                      aria-label="Tải tài liệu"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-luk-dim italic">
                Khách không đính kèm tệp tài liệu nào khi đặt hàng.
              </p>
            )}
          </div>
        </div>

        {/* Right: Contact & Delivery Information */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-luk-border bg-luk-card p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-luk-text border-b border-luk-border pb-3">
              Thông tin liên hệ
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-luk-muted">
                <User className="h-4 w-4 text-luk-dim shrink-0" />
                <span className="text-white font-medium">{order.guestName}</span>
              </div>
              <div className="flex items-center gap-2 text-luk-muted">
                <Mail className="h-4 w-4 text-luk-dim shrink-0" />
                <span className="text-white">{order.guestEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-luk-muted">
                <Phone className="h-4 w-4 text-luk-dim shrink-0" />
                <span className="text-white">{order.guestPhone}</span>
              </div>
              {order.requestedDeadline && (
                <div className="flex items-center gap-2 text-luk-muted">
                  <Calendar className="h-4 w-4 text-luk-blueLight shrink-0" />
                  <span>
                    Hạn mong muốn:{' '}
                    <strong className="text-white">
                      {new Date(order.requestedDeadline).toLocaleDateString('vi-VN')}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-luk-border pt-3 space-y-2 text-[11px] text-luk-dim">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Bảo mật & Quyền riêng tư</span>
              </div>
              <p>
                File và thông tin chỉ được truy cập bởi người đặt và chuyên viên phụ trách của LUK Global.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
