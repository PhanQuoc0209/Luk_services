'use client';

import React, { useState } from 'react';
import {
  QrCode,
  Copy,
  Check,
  CreditCard,
  AlertCircle,
  Clock,
  ShieldCheck,
  Send,
  Upload,
} from 'lucide-react';
import { buildVietQrUrl, formatVND } from '@/lib/vietqr';

interface BankSettingData {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  qrTemplate: string;
  isDepositAllowed: boolean;
  defaultDepositPercent: number;
  transferNotePrefix: string;
}

interface QuoteData {
  id: string;
  totalPrice: number;
  depositAmount: number;
  confirmedDeadline: string;
  paymentNotes: string | null;
  status: string;
}

interface PaymentData {
  id: string;
  amount: number;
  paymentType: string;
  paymentStatus: string;
  transferContent: string;
  confirmedAt: string | null;
  createdAt: string;
}

interface OrderPaymentSectionProps {
  orderCode: string;
  quotes: QuoteData[];
  payments: PaymentData[];
  bankSetting: BankSettingData | null;
  onPaymentSubmitted: () => void;
}

export function OrderPaymentSection({
  orderCode,
  quotes,
  payments,
  bankSetting,
  onPaymentSubmitted,
}: OrderPaymentSectionProps) {
  const latestQuote = quotes[0];
  const confirmedPayment = payments.find((p) => p.paymentStatus === 'CONFIRMED');
  const pendingPayment = payments.find((p) => p.paymentStatus === 'PENDING_CONFIRMATION');

  const [paymentOption, setPaymentOption] = useState<'FULL' | 'DEPOSIT'>(
    latestQuote?.depositAmount && latestQuote.depositAmount > 0 ? 'DEPOSIT' : 'FULL'
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [proofNote, setProofNote] = useState('');
  const [proofFile, setProofFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!latestQuote) {
    return (
      <div className="rounded-xl border border-luk-border bg-luk-card p-6 text-center space-y-2">
        <Clock className="mx-auto h-8 w-8 text-luk-muted" />
        <h3 className="text-sm font-bold text-white">Chờ Admin gửi báo giá</h3>
        <p className="text-xs text-luk-muted max-w-md mx-auto">
          Đơn hàng của bạn đang được chuyên viên xem xét. Báo giá chính xác kèm mã VietQR sẽ hiển thị tại đây ngay sau khi được duyệt.
        </p>
      </div>
    );
  }

  const effectiveBank = bankSetting || {
    bankName: 'MB Bank (Ngân hàng Quân đội)',
    bankCode: 'MB',
    accountNumber: '0988888888',
    accountHolder: 'LUK SERVICES',
    qrTemplate: 'compact2',
    isDepositAllowed: true,
    defaultDepositPercent: 50,
    transferNotePrefix: 'LUK',
  };

  const amountToPay =
    paymentOption === 'DEPOSIT' && latestQuote.depositAmount > 0
      ? latestQuote.depositAmount
      : latestQuote.totalPrice;

  const transferContent = `${effectiveBank.transferNotePrefix || 'LUK'} ${orderCode}`;

  const qrImageUrl = buildVietQrUrl({
    bankCode: effectiveBank.bankCode,
    accountNumber: effectiveBank.accountNumber,
    accountHolder: effectiveBank.accountHolder,
    amount: amountToPay,
    transferContent,
    template: effectiveBank.qrTemplate || 'compact2',
  });

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.file) {
        setProofFile(data.file);
      } else {
        setErrorMessage(data.error || 'Lỗi khi tải biên lai.');
      }
    } catch {
      setErrorMessage('Không thể kết nối lưu trữ.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/orders/${orderCode}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountToPay,
          paymentType: paymentOption,
          proofNotes: proofNote.trim() || undefined,
          proofFileName: proofFile?.fileName || undefined,
          proofStoragePath: proofFile?.storagePath || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        onPaymentSubmitted();
      } else {
        setErrorMessage(data.error || 'Có lỗi xảy ra khi thông báo thanh toán.');
      }
    } catch {
      setErrorMessage('Lỗi hệ thống. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-luk-border bg-luk-card p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-luk-border pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <QrCode className="h-5 w-5 text-luk-blueLight" />
            <span>Thông tin Báo giá & Thanh toán qua VietQR</span>
          </h2>
          <p className="text-xs text-luk-muted mt-0.5">
            Mã QR đã cấu hình số tài khoản, số tiền và nội dung chuyển khoản tự động
          </p>
        </div>

        {confirmedPayment ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
            <Check className="h-4 w-4" />
            <span>Đã xác nhận thanh toán</span>
          </span>
        ) : pendingPayment ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400">
            <Clock className="h-4 w-4" />
            <span>Admin đang kiểm tra giao dịch</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs font-bold text-blue-400">
            <span>Chờ bạn chuyển khoản</span>
          </span>
        )}
      </div>

      {/* Quote summary details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-luk-border bg-luk-bg p-3.5 space-y-1">
          <span className="text-[10px] text-luk-dim uppercase font-semibold">Tổng giá đã chốt</span>
          <p className="text-lg font-black text-white">{formatVND(latestQuote.totalPrice)}</p>
        </div>

        <div className="rounded-xl border border-luk-border bg-luk-bg p-3.5 space-y-1">
          <span className="text-[10px] text-luk-dim uppercase font-semibold">Thời hạn cam kết</span>
          <p className="text-sm font-bold text-white">
            {new Date(latestQuote.confirmedDeadline).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="rounded-xl border border-luk-border bg-luk-bg p-3.5 space-y-1">
          <span className="text-[10px] text-luk-dim uppercase font-semibold">Ghi chú từ Admin</span>
          <p className="text-xs text-luk-muted line-clamp-2">
            {latestQuote.paymentNotes || 'Không có ghi chú thêm.'}
          </p>
        </div>
      </div>

      {/* If not confirmed yet: show QR Code & Transfer Form */}
      {!confirmedPayment && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: VietQR Image */}
          <div className="md:col-span-5 flex flex-col items-center justify-center rounded-xl border border-luk-border bg-luk-bg p-4 space-y-3 text-center">
            <div className="rounded-lg bg-white p-2 shadow-inner max-w-[240px]">
              <img
                src={qrImageUrl}
                alt="Mã QR chuyển khoản ngân hàng"
                className="w-full h-auto object-contain"
              />
            </div>
            <p className="text-[11px] text-luk-muted">
              Mở app ngân hàng (MB, Vietcombank, Techcombank...) và quét mã để tự điền nội dung.
            </p>
          </div>

          {/* Right: Bank Account Details & Transfer Notification Form */}
          <div className="md:col-span-7 space-y-4">
            {/* Payment Choice (Full vs Deposit) */}
            {latestQuote.depositAmount > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-luk-text">Chọn mức thanh toán:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentOption('DEPOSIT')}
                    className={`rounded-xl border p-3 text-left transition ${
                      paymentOption === 'DEPOSIT'
                        ? 'border-luk-blue bg-luk-blueSubtle text-white'
                        : 'border-luk-border bg-luk-bg text-luk-muted hover:text-white'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold block">Đặt cọc trước</span>
                    <span className="text-sm font-bold text-white">
                      {formatVND(latestQuote.depositAmount)}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentOption('FULL')}
                    className={`rounded-xl border p-3 text-left transition ${
                      paymentOption === 'FULL'
                        ? 'border-luk-blue bg-luk-blueSubtle text-white'
                        : 'border-luk-border bg-luk-bg text-luk-muted hover:text-white'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold block">Thanh toán toàn bộ</span>
                    <span className="text-sm font-bold text-white">
                      {formatVND(latestQuote.totalPrice)}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Bank details with 1-click copy */}
            <div className="rounded-xl border border-luk-border bg-luk-bg p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-luk-border/60 pb-2">
                <span className="text-luk-muted">Ngân hàng:</span>
                <span className="font-semibold text-white">{effectiveBank.bankName}</span>
              </div>

              <div className="flex items-center justify-between border-b border-luk-border/60 pb-2">
                <span className="text-luk-muted">Chủ tài khoản:</span>
                <span className="font-semibold text-white uppercase">{effectiveBank.accountHolder}</span>
              </div>

              <div className="flex items-center justify-between border-b border-luk-border/60 pb-2">
                <span className="text-luk-muted">Số tài khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white text-sm">
                    {effectiveBank.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(effectiveBank.accountNumber, 'acc')}
                    className="rounded p-1 text-luk-dim hover:text-blue-400"
                    aria-label="Sao chép số tài khoản"
                  >
                    {copiedField === 'acc' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-luk-muted">Nội dung chuyển khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded text-xs">
                    {transferContent}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(transferContent, 'content')}
                    className="rounded p-1 text-luk-dim hover:text-blue-400"
                    aria-label="Sao chép nội dung chuyển khoản"
                  >
                    {copiedField === 'content' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Notification form when customer transferred */}
            <form
              onSubmit={handleSubmitProof}
              className="rounded-xl border border-luk-border bg-luk-card p-4 space-y-3"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Đã chuyển khoản xong? Bấm xác nhận tại đây:
              </h4>

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-[11px] text-red-300">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {submitSuccess && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-[11px] text-emerald-300">
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  <span>Đã gửi thông báo cho Admin! Admin sẽ kiểm tra và xác nhận thủ công.</span>
                </div>
              )}

              <div>
                <input
                  type="text"
                  value={proofNote}
                  onChange={(e) => setProofNote(e.target.value)}
                  placeholder="Ghi chú thêm (ví dụ: chuyển từ Techcombank tên Tran Van B)..."
                  className="w-full rounded-lg border border-luk-border bg-luk-bg p-2 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 rounded-lg border border-luk-border bg-luk-bg px-2.5 py-1 text-xs text-luk-muted hover:text-white cursor-pointer transition">
                  <Upload className="h-3 w-3" />
                  <span>{uploading ? 'Đang tải...' : proofFile ? 'Đã tải ảnh biên lai' : 'Tải ảnh biên lai (tùy chọn)'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {proofFile && (
                  <span className="text-[11px] text-emerald-400 font-medium truncate max-w-[150px]">
                    ✓ {proofFile.originalName}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-luk-blue py-2 text-xs font-semibold text-white hover:bg-luk-blueHover active:scale-95 disabled:opacity-50 transition shadow"
              >
                {submitting ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Tôi đã chuyển khoản {formatVND(amountToPay)}</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 text-[10px] text-luk-dim">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span>Hệ thống chỉ đánh dấu hoàn tất khi Admin đối soát thực tế tại tài khoản.</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* If already confirmed */}
      {confirmedPayment && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center justify-between text-xs text-emerald-300">
          <div>
            <p className="font-bold">Đã xác nhận nhận đủ tiền: {formatVND(confirmedPayment.amount)}</p>
            <p className="text-[11px] text-emerald-200/80">
              Thời gian xác nhận: {new Date(confirmedPayment.confirmedAt || confirmedPayment.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
          <Check className="h-6 w-6 text-emerald-400" />
        </div>
      )}
    </div>
  );
}
