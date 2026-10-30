'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  MessageSquare,
  CheckCircle,
  Clock,
  Send,
  AlertCircle,
  FileCheck,
  History,
  Check,
} from 'lucide-react';

interface FeedbackData {
  id: string;
  authorRole: string;
  authorName: string;
  content: string;
  revisionRequested: boolean;
  createdAt: string;
}

interface DraftVersionData {
  id: string;
  versionNumber: number;
  versionType: string;
  title: string;
  notes: string | null;
  previewUrl: string | null;
  fileName: string | null;
  canDownload: boolean;
  isFinal: boolean;
  createdAt: string;
  feedbacks: FeedbackData[];
}

interface OrderDraftWorkspaceProps {
  orderCode: string;
  drafts: DraftVersionData[];
  orderStatus: string;
  onFeedbackSubmitted: () => void;
}

export function OrderDraftWorkspace({
  orderCode,
  drafts,
  orderStatus,
  onFeedbackSubmitted,
}: OrderDraftWorkspaceProps) {
  const [selectedVersionId, setSelectedVersionId] = useState<string>(
    drafts[0]?.id || ''
  );
  const [feedbackContent, setFeedbackContent] = useState('');
  const [needRevision, setNeedRevision] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const activeDraft = drafts.find((d) => d.id === selectedVersionId) || drafts[0];

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackContent.trim()) return;

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch(`/api/orders/${orderCode}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftVersionId: activeDraft?.id || undefined,
          content: feedbackContent.trim(),
          revisionRequested: needRevision,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedbackContent('');
        setNeedRevision(false);
        setSuccessMessage('Đã gửi phản hồi thành công tới đội ngũ kỹ thuật!');
        onFeedbackSubmitted();
      } else {
        setErrorMessage(data.error || 'Có lỗi xảy ra khi gửi phản hồi.');
      }
    } catch {
      setErrorMessage('Không thể kết nối máy chủ.');
    } finally {
      setSubmitting(false);
    }
  };

  if (drafts.length === 0) {
    return (
      <div className="rounded-2xl border border-luk-border bg-luk-card p-6 text-center space-y-2">
        <Clock className="mx-auto h-8 w-8 text-luk-muted" />
        <h3 className="text-sm font-bold text-white">Chưa có bản nháp nào được tải lên</h3>
        <p className="text-xs text-luk-muted max-w-md mx-auto">
          Đội ngũ LUK Services đang tiến hành thực hiện yêu cầu của bạn. Ngay khi có bản nháp đầu tiên, bạn sẽ nhận được thông báo để vào xem và gửi phản hồi chỉnh sửa.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-luk-border bg-luk-card p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-luk-border pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-luk-blueLight" />
            <span>Khu vực Xem trước Bản nháp & Góp ý Chỉnh sửa</span>
          </h2>
          <p className="text-xs text-luk-muted mt-0.5">
            Lịch sử các phiên bản sản phẩm và trao đổi phản hồi trực tiếp với Admin
          </p>
        </div>

        {activeDraft?.isFinal && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
            <CheckCircle className="h-4 w-4" />
            <span>Bản hoàn thiện cuối cùng</span>
          </span>
        )}
      </div>

      {/* Version Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-luk-muted flex items-center gap-1 shrink-0 mr-1">
          <History className="h-3.5 w-3.5" />
          <span>Phiên bản:</span>
        </span>
        {drafts.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setSelectedVersionId(d.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition shrink-0 ${
              d.id === (activeDraft?.id || '')
                ? 'bg-luk-blue text-white shadow-sm'
                : 'border border-luk-border bg-luk-bg text-luk-muted hover:text-white'
            }`}
          >
            <span>v{d.versionNumber}</span>
            <span className="text-[10px] opacity-75">
              ({d.versionType === 'FINAL' ? 'Bản cuối' : 'Bản nháp'})
            </span>
          </button>
        ))}
      </div>

      {activeDraft && (
        <div className="space-y-6">
          {/* Active Version Info Card */}
          <div className="rounded-xl border border-luk-border bg-luk-bg p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-luk-blueLight">
                  Phiên bản {activeDraft.versionNumber} •{' '}
                  {new Date(activeDraft.createdAt).toLocaleString('vi-VN')}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{activeDraft.title}</h3>
                {activeDraft.notes && (
                  <p className="text-xs text-luk-muted mt-2 leading-relaxed">
                    {activeDraft.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons: Preview or Download */}
              <div className="flex items-center gap-2 shrink-0">
                {activeDraft.previewUrl && (
                  <a
                    href={activeDraft.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-luk-border bg-luk-card px-3 py-2 text-xs font-medium text-blue-400 hover:border-luk-blue transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Xem preview online</span>
                  </a>
                )}

                {activeDraft.fileName && (
                  activeDraft.canDownload ? (
                    <a
                      href={`/api/files/${activeDraft.id}`}
                      download
                      className="flex items-center gap-1.5 rounded-lg bg-luk-blue px-3 py-2 text-xs font-medium text-white hover:bg-luk-blueHover transition shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Tải file về máy</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-amber-400 bg-amber-400/10 px-2.5 py-1.5 rounded-lg border border-amber-400/20">
                      Chỉ hỗ trợ xem trước
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Feedback & Discussion Thread for this version */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-luk-text flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-400" />
              <span>Lịch sử góp ý & Trao đổi phiên bản v{activeDraft.versionNumber}</span>
            </h4>

            {activeDraft.feedbacks && activeDraft.feedbacks.length > 0 ? (
              <div className="space-y-2.5">
                {activeDraft.feedbacks.map((f) => (
                  <div
                    key={f.id}
                    className={`rounded-xl border p-3.5 space-y-1.5 ${
                      f.authorRole === 'ADMIN'
                        ? 'border-blue-500/30 bg-blue-500/10 text-blue-200'
                        : 'border-luk-border bg-luk-bg text-luk-text'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{f.authorName}</span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[10px] uppercase font-bold ${
                            f.authorRole === 'ADMIN'
                              ? 'bg-blue-600 text-white'
                              : 'bg-luk-card text-luk-muted'
                          }`}
                        >
                          {f.authorRole === 'ADMIN' ? 'Admin' : 'Khách hàng'}
                        </span>
                        {f.revisionRequested && (
                          <span className="rounded bg-rose-500/20 text-rose-400 px-1.5 text-[10px] font-bold">
                            Yêu cầu chỉnh sửa
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-luk-dim">
                        {new Date(f.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-luk-muted whitespace-pre-line">
                      {f.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-luk-dim italic">
                Chưa có trao đổi nào cho phiên bản này.
              </p>
            )}

            {/* Submit Feedback Form */}
            {orderStatus !== 'COMPLETED' && (
              <form onSubmit={handleSendFeedback} className="rounded-xl border border-luk-border bg-luk-bg p-4 space-y-3 mt-3">
                <h5 className="text-xs font-semibold text-white">
                  Gửi phản hồi hoặc yêu cầu chỉnh sửa cho bản nháp này:
                </h5>

                {errorMessage && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-300">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs text-emerald-300">
                    <Check className="h-3.5 w-3.5 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <textarea
                  required
                  rows={3}
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                  placeholder="Ghi chú các điểm cần hoàn thiện (slide nào cần đổi màu, đoạn video nào cần cắt ngắn, font chữ...)"
                  className="w-full rounded-lg border border-luk-border bg-luk-card p-3 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={needRevision}
                      onChange={(e) => setNeedRevision(e.target.checked)}
                      className="h-4 w-4 rounded border-luk-border text-luk-blue focus:ring-0"
                    />
                    <span className="text-xs text-luk-text font-medium">
                      Đây là yêu cầu chỉnh sửa (cần ra bản nháp tiếp theo)
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-luk-blue px-4 py-2 text-xs font-semibold text-white hover:bg-luk-blueHover active:scale-95 disabled:opacity-50 transition shadow"
                  >
                    {submitting ? (
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Gửi phản hồi</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
