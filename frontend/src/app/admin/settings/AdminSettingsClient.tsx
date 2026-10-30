'use client';

import React, { useState } from 'react';
import { CreditCard, Save, Check, AlertCircle, QrCode } from 'lucide-react';
import { buildVietQrUrl } from '@/lib/vietqr';

interface BankSettingData {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  branch: string | null;
  isDepositAllowed: boolean;
  defaultDepositPercent: number;
  transferNotePrefix: string;
}

export function AdminSettingsClient({
  initialSetting,
}: {
  initialSetting: BankSettingData | null;
}) {
  const [bankName, setBankName] = useState(
    initialSetting?.bankName || 'MB Bank (Ngân hàng Quân đội)'
  );
  const [bankCode, setBankCode] = useState(initialSetting?.bankCode || 'MB');
  const [accountNumber, setAccountNumber] = useState(
    initialSetting?.accountNumber || '0988888888'
  );
  const [accountHolder, setAccountHolder] = useState(
    initialSetting?.accountHolder || 'LUK SERVICES'
  );
  const [branch, setBranch] = useState(initialSetting?.branch || 'Hà Nội');
  const [isDepositAllowed, setIsDepositAllowed] = useState(
    initialSetting?.isDepositAllowed ?? true
  );
  const [defaultDepositPercent, setDefaultDepositPercent] = useState(
    initialSetting?.defaultDepositPercent || 50
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const previewQrUrl = buildVietQrUrl({
    bankCode,
    accountNumber,
    accountHolder,
    amount: 100000,
    transferContent: 'LUK DEMO1234',
    template: 'compact2',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: bankName.trim(),
          bankCode: bankCode.trim(),
          accountNumber: accountNumber.trim(),
          accountHolder: accountHolder.trim().toUpperCase(),
          branch: branch.trim() || undefined,
          isDepositAllowed,
          defaultDepositPercent: Number(defaultDepositPercent),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Đã lưu cấu hình tài khoản và mã QR thành công!', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Lỗi khi lưu cấu hình', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Lỗi mạng khi lưu cấu hình.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-luk-border pb-4">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-purple-400" />
          <span>Cấu hình Ngân hàng & Mã VietQR</span>
        </h1>
        <p className="text-xs text-luk-muted mt-0.5">
          Thông tin ngân hàng nhận tiền chuyển khoản của khách hàng khi thanh toán dịch vụ
        </p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-xs ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/30 text-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Form Settings */}
        <form onSubmit={handleSave} className="md:col-span-7 rounded-2xl border border-luk-border bg-luk-card p-6 space-y-4 shadow-xl">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-white block mb-1">
                Tên Ngân hàng <span className="text-luk-red">*</span>
              </label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Ví dụ: MB Bank, Vietcombank, Techcombank..."
                className="w-full rounded-lg border border-luk-border bg-luk-bg p-2 text-xs text-white focus:border-luk-blue focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  Mã Ngân hàng (VietQR code) <span className="text-luk-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                  placeholder="MB, VCB, TCB, VPB, ICB..."
                  className="w-full rounded-lg border border-luk-border bg-luk-bg p-2 text-xs text-white uppercase font-mono focus:border-luk-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  Số tài khoản <span className="text-luk-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="0988888888"
                  className="w-full rounded-lg border border-luk-border bg-luk-bg p-2 text-xs text-white font-mono focus:border-luk-blue focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-white block mb-1">
                Tên chủ tài khoản <span className="text-luk-red">*</span>
              </label>
              <input
                type="text"
                required
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="LUK SERVICES"
                className="w-full rounded-lg border border-luk-border bg-luk-bg p-2 text-xs text-white uppercase focus:border-luk-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-luk-muted block mb-1">
                Chi nhánh (tùy chọn)
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="Hà Nội"
                className="w-full rounded-lg border border-luk-border bg-luk-bg p-2 text-xs text-white focus:border-luk-blue focus:outline-none"
              />
            </div>

            {/* Deposit settings */}
            <div className="border-t border-luk-border pt-3 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isDepositAllowed}
                  onChange={(e) => setIsDepositAllowed(e.target.checked)}
                  className="h-4 w-4 rounded border-luk-border text-luk-blue"
                />
                <span className="text-xs font-semibold text-white">
                  Cho phép đặt cọc theo tỷ lệ %
                </span>
              </label>

              {isDepositAllowed && (
                <div>
                  <label className="text-[11px] text-luk-muted block mb-1">
                    Tỷ lệ cọc mặc định khi báo giá (%)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    step={5}
                    value={defaultDepositPercent}
                    onChange={(e) => setDefaultDepositPercent(Number(e.target.value))}
                    className="w-32 rounded-lg border border-luk-border bg-luk-bg p-2 text-xs text-white focus:border-luk-blue focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-luk-blue px-4 py-2.5 text-xs font-semibold text-white hover:bg-luk-blueHover active:scale-95 transition shadow mt-2"
          >
            <Save className="h-4 w-4" />
            <span>Lưu cấu hình thanh toán</span>
          </button>
        </form>

        {/* Live Preview Card */}
        <div className="md:col-span-5 rounded-2xl border border-luk-border bg-luk-card p-6 space-y-4 shadow-xl text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-luk-text">
            <QrCode className="h-4 w-4 text-luk-blueLight" />
            <span>Xem trước mã VietQR thật</span>
          </div>

          <div className="rounded-xl bg-white p-3 mx-auto max-w-[220px] shadow-md">
            <img
              src={previewQrUrl}
              alt="Mã QR xem trước"
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="space-y-1 text-xs text-luk-muted">
            <p className="font-semibold text-white">{bankName}</p>
            <p className="font-mono text-white text-sm">{accountNumber}</p>
            <p className="uppercase text-[11px] font-bold text-amber-400">{accountHolder}</p>
          </div>

          <p className="text-[11px] text-luk-dim leading-relaxed">
            Mã QR này sẽ hiển thị tự động trên đơn hàng của khách hàng sau khi bạn phát hành báo giá.
          </p>
        </div>
      </div>
    </div>
  );
}
