'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Receipt,
  CheckCircle,
  XCircle,
  Upload,
  Download,
  ExternalLink,
  MessageSquare,
  FileCheck,
  Paperclip,
  Clock,
  Send,
  AlertCircle,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { formatVND } from '@/lib/vietqr';
import { ORDER_STATUS_CONFIG } from '@/components/orders/OrderStatusProgress';

interface AdminOrderDetailClientProps {
  order: any;
  bankSetting: any;
}

export function AdminOrderDetailClient({
  order: initialOrder,
  bankSetting,
}: AdminOrderDetailClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);

  // Status Change State
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusNote, setStatusNote] = useState('');

  // Quote Form State
  const [totalPrice, setTotalPrice] = useState<number>(order.quotedPrice || 250000);
  const [depositAmount, setDepositAmount] = useState<number>(order.depositRequired || 0);
  const [deadline, setDeadline] = useState(
    order.requestedDeadline
      ? new Date(order.requestedDeadline).toISOString().split('T')[0]
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [paymentNotes, setPaymentNotes] = useState('');
  const [submittingQuote, setSubmittingQuote] = useState(false);

  // Draft Upload State
  const [draftTitle, setDraftTitle] = useState(`Bản thảo v${(order.drafts?.length || 0) + 1}`);
  const [draftNotes, setDraftNotes] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isFinal, setIsFinal] = useState(false);
  const [canDownload, setCanDownload] = useState(true);
  const [draftFile, setDraftFile] = useState<any>(null);
  const [uploadingDraft, setUploadingDraft] = useState(false);
  const [submittingDraft, setSubmittingDraft] = useState(false);

  // Admin Feedback Reply State
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Notification message
  const [bannerMsg, setBannerMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const statusList = [
    'PENDING_REVIEW',
    'IN_REVIEW',
    'QUOTED',
    'AWAITING_PAYMENT',
    'PAYMENT_CONFIRMED',
    'IN_PROGRESS',
    'DRAFT_DELIVERED',
    'AWAITING_FEEDBACK',
    'REVISING',
    'COMPLETED',
    'CANCELLED',
  ];

  const handleUpdateStatus = async (newStatus: string) => {
    setUpdatingStatus(true);
    setBannerMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: statusNote || undefined }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder({ ...order, status: newStatus });
        setStatusNote('');
        setBannerMsg({ text: `Đã cập nhật trạng thái sang "${ORDER_STATUS_CONFIG[newStatus]?.label || newStatus}"`, type: 'success' });
        router.refresh();
      } else {
        setBannerMsg({ text: data.error || 'Lỗi khi cập nhật trạng thái', type: 'error' });
      }
    } catch {
      setBannerMsg({ text: 'Lỗi mạng khi cập nhật trạng thái.', type: 'error' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingQuote(true);
    setBannerMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalPrice: Number(totalPrice),
          depositAmount: Number(depositAmount),
          confirmedDeadline: deadline,
          paymentNotes: paymentNotes || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.quote) {
        setOrder({
          ...order,
          status: 'QUOTED',
          quotedPrice: Number(totalPrice),
          depositRequired: Number(depositAmount),
          quotes: [data.quote, ...(order.quotes || [])],
        });
        setBannerMsg({ text: 'Đã gửi báo giá thành công tới khách hàng!', type: 'success' });
        router.refresh();
      } else {
        setBannerMsg({ text: data.error || 'Lỗi khi gửi báo giá', type: 'error' });
      }
    } catch {
      setBannerMsg({ text: 'Lỗi máy chủ khi gửi báo giá.', type: 'error' });
    } finally {
      setSubmittingQuote(false);
    }
  };

  const handleConfirmPayment = async (paymentId: string, confirmed: boolean) => {
    setBannerMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/payment/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, confirmed }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder({
          ...order,
          status: data.orderStatus,
          payments: order.payments.map((p: any) =>
            p.id === paymentId ? { ...p, paymentStatus: confirmed ? 'CONFIRMED' : 'REJECTED' } : p
          ),
        });
        setBannerMsg({
          text: confirmed ? 'Đã xác nhận thanh toán thủ công thành công!' : 'Đã từ chối giao dịch.',
          type: 'success',
        });
        router.refresh();
      } else {
        setBannerMsg({ text: data.error || 'Lỗi khi xác nhận thanh toán', type: 'error' });
      }
    } catch {
      setBannerMsg({ text: 'Lỗi máy chủ khi xác nhận thanh toán.', type: 'error' });
    }
  };

  const handleUploadDraftFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDraft(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.file) {
        setDraftFile(data.file);
      } else {
        setBannerMsg({ text: data.error || 'Lỗi khi tải file', type: 'error' });
      }
    } catch {
      setBannerMsg({ text: 'Lỗi upload.', type: 'error' });
    } finally {
      setUploadingDraft(false);
    }
  };

  const handleSubmitDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingDraft(true);
    setBannerMsg(null);

    const versionNum = (order.drafts?.length || 0) + 1;

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionNumber: versionNum,
          versionType: isFinal ? 'FINAL' : 'DRAFT',
          title: draftTitle,
          notes: draftNotes || undefined,
          previewUrl: previewUrl || undefined,
          canDownload,
          isFinal,
          uploadedFile: draftFile || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.draft) {
        setOrder({
          ...order,
          status: data.orderStatus,
          drafts: [data.draft, ...(order.drafts || [])],
        });
        setDraftNotes('');
        setDraftFile(null);
        setPreviewUrl('');
        setBannerMsg({
          text: isFinal ? 'Đã hoàn tất bàn giao bản cuối cho khách!' : `Đã tải lên bản nháp v${versionNum}!`,
          type: 'success',
        });
        router.refresh();
      } else {
        setBannerMsg({ text: data.error || 'Lỗi khi tạo bản thảo', type: 'error' });
      }
    } catch {
      setBannerMsg({ text: 'Lỗi máy chủ.', type: 'error' });
    } finally {
      setSubmittingDraft(false);
    }
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmittingReply(true);
    try {
      const res = await fetch(`/api/orders/${order.orderCode}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent.trim(),
          revisionRequested: false,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReplyContent('');
        setBannerMsg({ text: 'Đã gửi phản hồi thành công!', type: 'success' });
        router.refresh();
      }
    } catch {
      // ignore
    } finally {
      setSubmittingReply(false);
    }
  };

  const currentStatusConfig = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING_REVIEW;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luk-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-luk-border bg-luk-card text-luk-muted hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span>Đơn #{order.orderCode}</span>
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${currentStatusConfig.color}`}
              >
                {currentStatusConfig.label}
              </span>
            </h1>
            <p className="text-xs text-luk-muted mt-0.5">
              Khách hàng: <strong className="text-white">{order.guestName}</strong> • {order.guestPhone} • {order.guestEmail}
            </p>
          </div>
        </div>

        <Link
          href={`/orders/${order.orderCode}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-lg border border-luk-border bg-luk-card px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-white"
        >
          <span>Xem view của khách</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {bannerMsg && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-xs ${
            bannerMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/30 text-red-300'
          }`}
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{bannerMsg.text}</span>
        </div>
      )}

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Quotes, Payments & Drafts Management */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Quick Status Progression */}
          <div className="rounded-2xl border border-luk-border bg-luk-card p-5 space-y-3 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-luk-text">
              1. Chuyển đổi trạng thái đơn hàng
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {statusList.map((st) => {
                const conf = ORDER_STATUS_CONFIG[st];
                const isCurrent = order.status === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(st)}
                    disabled={updatingStatus || isCurrent}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                      isCurrent
                        ? 'bg-luk-blue text-white shadow'
                        : 'border border-luk-border bg-luk-bg text-luk-muted hover:text-white hover:border-luk-blue'
                    }`}
                  >
                    {conf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Quote Submission Form */}
          <div className="rounded-2xl border border-luk-border bg-luk-card p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Receipt className="h-4 w-4 text-purple-400" />
              <span>2. Quản lý Báo giá & Thời hạn cam kết</span>
            </h2>

            {order.quotes && order.quotes.length > 0 ? (
              <div className="rounded-xl border border-luk-border bg-luk-bg p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-luk-muted">Báo giá hiện tại:</span>
                  <span className="text-base font-black text-white">
                    {formatVND(order.quotes[0].totalPrice)}
                  </span>
                </div>
                {order.quotes[0].depositAmount > 0 && (
                  <div className="flex justify-between items-center text-amber-400">
                    <span>Hỗ trợ đặt cọc:</span>
                    <span className="font-bold">{formatVND(order.quotes[0].depositAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-luk-muted">
                  <span>Hạn hoàn thiện:</span>
                  <span className="text-white font-medium">
                    {new Date(order.quotes[0].confirmedDeadline).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-amber-400 bg-amber-400/10 p-2.5 rounded-lg border border-amber-400/20">
                Đơn hàng mới nhận chưa có báo giá. Hãy điền form bên dưới để gửi báo giá cho khách.
              </p>
            )}

            <form onSubmit={handleSendQuote} className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-luk-muted block mb-1">
                    Tổng giá tiền (VNĐ) <span className="text-luk-red">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={10000}
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-luk-border bg-luk-bg p-2 text-xs text-white focus:border-luk-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-luk-muted block mb-1">
                    Tiền cọc yêu cầu (0 nếu thu full)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-luk-border bg-luk-bg p-2 text-xs text-white focus:border-luk-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-luk-muted block mb-1">
                    Thời hạn cam kết hoàn thành <span className="text-luk-red">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-lg border border-luk-border bg-luk-bg p-2 text-xs text-white focus:border-luk-blue focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-luk-muted block mb-1">
                  Ghi chú báo giá (phạm vi, chính sách chỉnh sửa):
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Ví dụ: Đã bao gồm 2 lần góp ý chỉnh sửa slide, nộp trước 18:00 thứ 6..."
                  className="w-full rounded-lg border border-luk-border bg-luk-bg p-2 text-xs text-white placeholder-luk-dim focus:border-luk-blue focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingQuote}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition shadow"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Gửi / Cập nhật báo giá</span>
              </button>
            </form>
          </div>

          {/* Section 3: Payments & Manual Verification */}
          <div className="rounded-2xl border border-luk-border bg-luk-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-luk-border pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>3. Quản lý Thanh toán & Đối soát Ngân hàng</span>
              </h2>
              <span className="text-[11px] text-luk-dim">
                Kiểm tra tài khoản thực tế trước khi bấm xác nhận
              </span>
            </div>

            {order.payments && order.payments.length > 0 ? (
              <div className="space-y-3">
                {order.payments.map((p: any) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-luk-border bg-luk-bg p-4 space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-base font-black text-white">
                          {formatVND(p.amount)}
                        </span>
                        <span className="ml-2 text-luk-dim">
                          ({p.paymentType === 'DEPOSIT' ? 'Tiền cọc' : 'Toàn bộ'})
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.paymentStatus === 'CONFIRMED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {p.paymentStatus === 'CONFIRMED' ? 'Đã xác nhận' : 'Chờ admin kiểm tra'}
                      </span>
                    </div>

                    <div className="space-y-1 text-luk-muted text-[11px]">
                      <p>Nội dung chuyển khoản: <strong className="text-amber-400 font-mono">{p.transferContent}</strong></p>
                      {p.proofNotes && <p>Ghi chú của khách: &quot;{p.proofNotes}&quot;</p>}
                      <p className="text-luk-dim">Thời điểm khách thông báo: {new Date(p.createdAt).toLocaleString('vi-VN')}</p>
                    </div>

                    {/* Manual verification actions */}
                    {p.paymentStatus !== 'CONFIRMED' && (
                      <div className="flex items-center gap-2 border-t border-luk-border/60 pt-3">
                        <button
                          type="button"
                          onClick={() => handleConfirmPayment(p.id, true)}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Xác nhận đã nhận đủ tiền</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConfirmPayment(p.id, false)}
                          className="flex items-center gap-1.5 rounded-lg border border-luk-border bg-luk-card px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Từ chối</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-luk-dim italic">
                Khách chưa gửi thông báo thanh toán nào.
              </p>
            )}
          </div>

          {/* Section 4: Draft Upload & Final Delivery */}
          <div className="rounded-2xl border border-luk-border bg-luk-card p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-blue-400" />
              <span>4. Tải lên Bản nháp / Bàn giao Bản cuối</span>
            </h2>

            <form onSubmit={handleSubmitDraft} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-luk-muted block mb-1">
                    Tiêu đề bản thảo / phiên bản <span className="text-luk-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="Bản nháp v1 - Đã hoàn thành 15 slide..."
                    className="w-full rounded-lg border border-luk-border bg-luk-bg p-2 text-xs text-white focus:border-luk-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-luk-muted block mb-1">
                    Link xem trước online (Google Drive, Figma, Canva, Youtube...)
                  </label>
                  <input
                    type="url"
                    value={previewUrl}
                    onChange={(e) => setPreviewUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full rounded-lg border border-luk-border bg-luk-bg p-2 text-xs text-white focus:border-luk-blue focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-luk-muted block mb-1">
                  Ghi chú hướng dẫn cho khách hàng:
                </label>
                <textarea
                  rows={2}
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  placeholder="Ghi chú các phần đã hoàn thiện, điểm cần khách chú ý duyệt..."
                  className="w-full rounded-lg border border-luk-border bg-luk-bg p-2.5 text-xs text-white focus:border-luk-blue focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                {/* Upload File */}
                <label className="flex items-center gap-1.5 rounded-lg border border-luk-border bg-luk-bg px-3 py-1.5 text-luk-muted hover:text-white cursor-pointer transition">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{uploadingDraft ? 'Đang tải...' : draftFile ? '✓ Đã đính kèm tệp' : 'Đính kèm tệp sản phẩm'}</span>
                  <input type="file" onChange={handleUploadDraftFile} className="hidden" />
                </label>
                {draftFile && (
                  <span className="text-[11px] text-emerald-400 font-medium truncate max-w-xs">
                    {draftFile.originalName}
                  </span>
                )}

                {/* Permissions Toggles */}
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={canDownload}
                    onChange={(e) => setCanDownload(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-luk-border text-luk-blue"
                  />
                  <span className="text-luk-muted">Cho phép khách tải file về máy</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFinal}
                    onChange={(e) => setIsFinal(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-luk-border text-emerald-500"
                  />
                  <span className="text-emerald-400 font-bold">
                    Đây là bản hoàn thiện cuối cùng (Chốt đơn)
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submittingDraft || uploadingDraft}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-luk-blue px-4 py-2 text-xs font-semibold text-white hover:bg-luk-blueHover transition shadow"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isFinal ? 'Bàn giao bản cuối cùng & Hoàn thành' : 'Gửi bản nháp cho khách xem'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Customer Info, Uploaded Source Files & Discussion */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Source Files */}
          <div className="rounded-2xl border border-luk-border bg-luk-card p-5 space-y-3 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-emerald-400" />
              <span>Tài liệu nguồn của khách ({order.files?.length || 0})</span>
            </h2>

            {order.files && order.files.length > 0 ? (
              <div className="space-y-2">
                {order.files.map((f: any) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-lg border border-luk-border bg-luk-bg p-2.5 text-xs"
                  >
                    <div className="truncate mr-2">
                      <p className="font-semibold text-white truncate">{f.originalName}</p>
                      <p className="text-[10px] text-luk-dim">{(f.fileSize / (1024 * 1024)).toFixed(1)} MB</p>
                    </div>
                    <a
                      href={`/api/files/${f.id}`}
                      download
                      className="flex h-7 w-7 items-center justify-center rounded bg-luk-card text-luk-muted hover:text-white shrink-0"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-luk-dim italic">Khách không tải lên tệp nào.</p>
            )}
          </div>

          {/* Feedback & Customer Revision Requests */}
          <div className="rounded-2xl border border-luk-border bg-luk-card p-5 space-y-3 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-400" />
              <span>Trao đổi & Góp ý của khách</span>
            </h2>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {order.feedbacks && order.feedbacks.length > 0 ? (
                order.feedbacks.map((fb: any) => (
                  <div
                    key={fb.id}
                    className={`rounded-lg border p-3 space-y-1 text-xs ${
                      fb.authorRole === 'ADMIN'
                        ? 'border-blue-500/30 bg-blue-500/10 text-blue-200'
                        : 'border-luk-border bg-luk-bg text-luk-text'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">
                        {fb.authorName} ({fb.authorRole === 'ADMIN' ? 'Admin' : 'Khách'})
                      </span>
                      <span className="text-[10px] text-luk-dim">
                        {new Date(fb.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    {fb.revisionRequested && (
                      <span className="inline-block rounded bg-rose-500/20 text-rose-400 px-1.5 py-0.2 text-[10px] font-bold">
                        Yêu cầu sửa lại
                      </span>
                    )}
                    <p className="text-luk-muted text-[11px] leading-relaxed whitespace-pre-line">
                      {fb.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-luk-dim italic">Chưa có phản hồi nào.</p>
              )}
            </div>

            {/* Quick Admin Reply */}
            <form onSubmit={handleSendAdminReply} className="pt-2 border-t border-luk-border space-y-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Nhắn tin lại cho khách..."
                className="w-full rounded-lg border border-luk-border bg-luk-bg p-2 text-xs text-white focus:border-luk-blue focus:outline-none"
              />
              <button
                type="submit"
                disabled={submittingReply}
                className="flex items-center justify-center gap-1 rounded-lg bg-luk-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-luk-blueHover transition w-full"
              >
                <Send className="h-3 w-3" />
                <span>Gửi tin nhắn</span>
              </button>
            </form>
          </div>

          {/* Audit Log Trail */}
          <div className="rounded-2xl border border-luk-border bg-luk-card p-5 space-y-3 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-luk-dim">
              Nhật ký kiểm toán (Audit Trail)
            </h2>
            <div className="space-y-1.5 text-[11px] text-luk-dim max-h-48 overflow-y-auto">
              {order.auditLogs && order.auditLogs.length > 0 ? (
                order.auditLogs.map((log: any) => (
                  <div key={log.id} className="border-b border-luk-border/40 pb-1">
                    <span className="text-white font-medium">{log.action}</span> •{' '}
                    <span>{new Date(log.createdAt).toLocaleTimeString('vi-VN')}</span>
                  </div>
                ))
              ) : (
                <p className="italic">Chưa có bản ghi.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
