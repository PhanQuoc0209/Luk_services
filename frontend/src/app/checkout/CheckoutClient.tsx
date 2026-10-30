'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Upload,
  Calendar,
  Send,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  Trash2,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { formatVND } from '@/lib/vietqr';
import { useApp } from '@/components/providers/AppProvider';

interface CartItem {
  id: string;
  serviceId: string;
  quantity: number;
  itemNotes: string | null;
  service: {
    id: string;
    title: string;
    category: string;
    startingPrice: number;
    turnaround: string;
  };
}

interface UploadedFileMeta {
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
}

export function CheckoutClient() {
  const router = useRouter();
  const { user, refreshCart } = useApp();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [requestedDeadline, setRequestedDeadline] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');

  // Per-item notes & files
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  const [itemFiles, setItemFiles] = useState<Record<string, UploadedFileMeta[]>>({});
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadCart() {
      try {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          const items: CartItem[] = data.cart?.items || [];
          setCartItems(items);

          // Prepopulate item notes from cart
          const initialNotes: Record<string, string> = {};
          items.forEach((item) => {
            if (item.itemNotes) {
              initialNotes[item.serviceId] = item.itemNotes;
            }
          });
          setItemNotes(initialNotes);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    loadCart();

    if (user) {
      setGuestName(user.name || '');
      setGuestEmail(user.email || '');
      if (user.phone) setGuestPhone(user.phone);
    }
  }, [user]);

  const handleFileUpload = async (serviceId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingItemId(serviceId);
    setErrorMessage('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.file) {
          setItemFiles((prev) => ({
            ...prev,
            [serviceId]: [...(prev[serviceId] || []), data.file],
          }));
        } else {
          setErrorMessage(data.error || `Lỗi khi tải file ${file.name}`);
        }
      }
    } catch {
      setErrorMessage('Không thể kết nối tải file. Vui lòng thử lại.');
    } finally {
      setUploadingItemId(null);
      e.target.value = ''; // reset file input
    }
  };

  const handleRemoveFile = (serviceId: string, fileName: string) => {
    setItemFiles((prev) => ({
      ...prev,
      [serviceId]: (prev[serviceId] || []).filter((f) => f.fileName !== fileName),
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!guestName.trim()) {
      setErrorMessage('Vui lòng điền họ và tên.');
      return;
    }
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      setErrorMessage('Vui lòng điền email hợp lệ để nhận báo giá.');
      return;
    }
    if (!guestPhone.trim() || guestPhone.length < 9) {
      setErrorMessage('Vui lòng điền số điện thoại liên hệ chính xác.');
      return;
    }

    setSubmitting(true);

    try {
      const itemDetailsPayload = cartItems.map((item) => ({
        serviceId: item.serviceId,
        itemNotes: itemNotes[item.serviceId] || '',
        uploadedFiles: itemFiles[item.serviceId] || [],
      }));

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          guestPhone: guestPhone.trim(),
          requestedDeadline: requestedDeadline || undefined,
          generalNotes: generalNotes.trim() || undefined,
          itemDetails: itemDetailsPayload,
        }),
      });

      const data = await res.json();
      if (data.success && data.orderCode) {
        await refreshCart();
        const trackingQuery = data.trackingToken ? `?token=${encodeURIComponent(data.trackingToken)}` : '';
        router.push(`/orders/${data.orderCode}${trackingQuery}`);
      } else {
        setErrorMessage(data.error || 'Có lỗi xảy ra khi gửi yêu cầu.');
        setSubmitting(false);
      }
    } catch {
      setErrorMessage('Lỗi hệ thống khi gửi yêu cầu. Vui lòng thử lại.');
      setSubmitting(false);
    }
  };

  const estimatedTotal = cartItems.reduce(
    (sum, item) => sum + item.service.startingPrice * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-luk-blue border-t-transparent" />
        <p className="mt-3 text-xs text-luk-muted">Đang tải biểu mẫu gửi yêu cầu...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <h2 className="text-base font-bold text-white">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-luk-muted">
          Vui lòng chọn dịch vụ trước khi tiến hành gửi yêu cầu báo giá.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 rounded-xl bg-luk-blue px-4 py-2 text-xs font-semibold text-white"
        >
          <span>Xem danh sách dịch vụ</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back button & title */}
      <div className="border-b border-luk-border pb-4 space-y-1">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-luk-muted hover:text-luk-text transition mb-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Quay lại giỏ hàng</span>
        </Link>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-luk-blueLight" />
          <span>Gửi thông tin yêu cầu dịch vụ</span>
        </h1>
        <p className="text-xs text-luk-muted">
          Điền thông tin liên hệ và đính kèm tài liệu nguồn. Chúng tôi sẽ xem xét và phản hồi báo giá chi tiết.
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info + Per Service Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Customer Contact Info */}
          <div className="rounded-2xl border border-luk-border bg-luk-card p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              1. Thông tin người đặt yêu cầu
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-luk-muted block mb-1">
                  Họ và tên <span className="text-luk-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full rounded-lg border border-luk-border bg-luk-bg px-3.5 py-2 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-luk-muted block mb-1">
                  Email nhận báo giá & bản thảo <span className="text-luk-red">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full rounded-lg border border-luk-border bg-luk-bg px-3.5 py-2 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-luk-muted block mb-1">
                  Số điện thoại / Zalo liên hệ <span className="text-luk-red">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full rounded-lg border border-luk-border bg-luk-bg px-3.5 py-2 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-luk-muted block mb-1">
                  Thời hạn hoàn thành mong muốn (Deadline)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={requestedDeadline}
                    onChange={(e) => setRequestedDeadline(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-lg border border-luk-border bg-luk-bg px-3.5 py-2 text-xs text-luk-text focus:border-luk-blue focus:outline-none"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-3.5 w-3.5 text-luk-dim pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-luk-muted block mb-1">
                Ghi chú chung cho toàn bộ đơn hàng:
              </label>
              <textarea
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                rows={2}
                placeholder="Ví dụ: Mục đích sử dụng cho cuộc thi tranh biện, đồ án tốt nghiệp..."
                className="w-full rounded-lg border border-luk-border bg-luk-bg p-3 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Per-Service Requirements & Attachments */}
          <div className="rounded-2xl border border-luk-border bg-luk-card p-6 space-y-4 shadow-sm">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                2. Chi tiết yêu cầu & Tệp tài liệu cho từng dịch vụ
              </h2>
              <p className="text-xs text-luk-muted mt-1">
                Hỗ trợ tải lên file Word (.docx), PowerPoint (.pptx), PDF, ảnh, video hoặc nén (.zip) tối đa 50MB. File được bảo vệ riêng tư.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {cartItems.map((item, index) => {
                const sId = item.serviceId;
                const uploadedList = itemFiles[sId] || [];
                const isUploading = uploadingItemId === sId;

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-luk-border bg-luk-bg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {index + 1}. {item.service.title} (x{item.quantity})
                      </span>
                      <span className="text-[11px] text-luk-dim font-medium">
                        Dự kiến: {item.service.turnaround}
                      </span>
                    </div>

                    {/* Specific Item Note */}
                    <div>
                      <label className="text-[11px] text-luk-muted block mb-1">
                        Yêu cầu chi tiết cho dịch vụ này:
                      </label>
                      <textarea
                        value={itemNotes[sId] || ''}
                        onChange={(e) =>
                          setItemNotes({ ...itemNotes, [sId]: e.target.value })
                        }
                        rows={2}
                        placeholder="Nội dung mong muốn, tiêu chuẩn dàn trang, style màu sắc hoặc link Drive..."
                        className="w-full rounded-lg border border-luk-border bg-luk-card p-2.5 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
                      />
                    </div>

                    {/* File Upload Zone */}
                    <div>
                      <label className="text-[11px] text-luk-muted block mb-1">
                        Tệp đính kèm (File nguồn, đề tài, outline):
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 rounded-lg border border-luk-border bg-luk-card px-3 py-1.5 text-xs font-medium text-luk-text hover:border-luk-blue hover:text-blue-400 cursor-pointer transition">
                          <Upload className="h-3.5 w-3.5" />
                          <span>{isUploading ? 'Đang tải file...' : 'Chọn tệp tải lên'}</span>
                          <input
                            type="file"
                            multiple
                            disabled={isUploading}
                            onChange={(e) => handleFileUpload(sId, e)}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-luk-dim">
                          Word, PPTX, PDF, Zip, Ảnh, MP4 (tối đa 50MB)
                        </span>
                      </div>

                      {/* Uploaded File Badges */}
                      {uploadedList.length > 0 && (
                        <div className="mt-2.5 space-y-1.5">
                          {uploadedList.map((f) => (
                            <div
                              key={f.fileName}
                              className="flex items-center justify-between rounded-lg border border-luk-border bg-luk-card px-3 py-1.5 text-xs"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Paperclip className="h-3.5 w-3.5 text-luk-blueLight shrink-0" />
                                <span className="truncate text-luk-text font-medium">{f.originalName}</span>
                                <span className="text-[10px] text-luk-dim">
                                  ({(f.fileSize / (1024 * 1024)).toFixed(1)} MB)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(sId, f.fileName)}
                                className="text-luk-dim hover:text-red-400 transition ml-2"
                                aria-label="Xóa tệp"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Order Summary & Confirmation */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-luk-border bg-luk-card p-5 space-y-5 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-luk-border pb-3">
              Xác nhận gửi đơn
            </h2>

            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-xs">
                  <div className="max-w-[70%]">
                    <p className="font-semibold text-white truncate">{item.service.title}</p>
                    <p className="text-[11px] text-luk-dim">SL: {item.quantity}</p>
                  </div>
                  <span className="font-medium text-luk-muted">
                    {formatVND(item.service.startingPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-luk-border pt-3 space-y-2">
              <div className="flex justify-between text-xs text-luk-muted">
                <span>Tổng giá tham khảo:</span>
                <span className="text-white font-medium">{formatVND(estimatedTotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-luk-muted">
                <span>Số tiền thanh toán ngay:</span>
                <span className="text-emerald-400 font-bold">0 ₫</span>
              </div>
            </div>

            <div className="rounded-xl bg-luk-bg p-3.5 border border-luk-border text-[11px] text-luk-dim space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Quy trình thanh toán minh bạch</span>
              </div>
              <p>
                Trang checkout không yêu cầu thanh toán trước. Sau khi bạn xác nhận, admin sẽ xem xét tài liệu, chốt báo giá và cung cấp mã VietQR thanh toán.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-luk-blue py-3 text-xs font-semibold text-white hover:bg-luk-blueHover active:scale-95 disabled:opacity-50 transition shadow-lg"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Đang tạo đơn hàng...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Xác nhận gửi yêu cầu báo giá</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-luk-dim text-center">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Chính sách hoàn tiền & chỉnh sửa không giới hạn bản nháp</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
