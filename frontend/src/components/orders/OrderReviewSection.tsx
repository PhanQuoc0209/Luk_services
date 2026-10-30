'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  authorName: string;
  createdAt: string;
}

interface OrderReviewSectionProps {
  orderCode: string;
  orderStatus: string;
  review?: ReviewData | null;
  onReviewSubmitted: () => void;
}

export function OrderReviewSection({
  orderCode,
  orderStatus,
  review,
  onReviewSubmitted,
}: OrderReviewSectionProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reviews are only available when the order is completed
  const isCompleted = orderStatus === 'COMPLETED';

  if (!isCompleted && !review) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!comment.trim() || comment.trim().length < 5) {
      setError('Vui lòng nhập nhận xét chi tiết (tối thiểu 5 ký tự).');
      return;
    }

    setLoading(true);
    try {
      // Read trackingToken from URL if present
      const urlParams = new URLSearchParams(window.location.search);
      const trackingToken = urlParams.get('token') || undefined;

      const res = await fetch(`/api/orders/${orderCode}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          trackingToken,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('Đánh giá của bạn đã được gửi thành công. Cảm ơn bạn!');
        onReviewSubmitted();
      } else {
        setError(data.error || 'Có lỗi xảy ra khi gửi đánh giá.');
      }
    } catch {
      setError('Lỗi kết nối máy chủ khi gửi đánh giá.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-luk-border bg-luk-card p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-luk-border pb-3">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Đánh giá chất lượng dịch vụ
          </h2>
        </div>
        <span className="text-[11px] font-medium text-luk-muted">
          Chỉ áp dụng cho đơn đã hoàn thành
        </span>
      </div>

      {review ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-4 w-4 ${
                    s <= review.rating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-luk-border'
                  }`}
                />
              ))}
              <span className="ml-2 text-xs font-bold text-white">
                {review.rating}/5 sao
              </span>
            </div>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Đã gửi đánh giá
            </span>
          </div>

          <p className="text-xs text-luk-text leading-relaxed bg-luk-bg p-3 rounded-lg border border-luk-border">
            &ldquo;{review.comment}&rdquo;
          </p>

          <div className="flex items-center justify-between text-[11px] text-luk-dim">
            <span>Người đánh giá: {review.authorName}</span>
            <span>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-luk-muted">
            Đơn hàng đã hoàn thành! Bạn vui lòng để lại đánh giá về chất lượng sản phẩm và mức độ hài lòng để LUK Services nâng cao trải nghiệm sinh viên.
          </p>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Star selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-luk-text mr-2">Mức độ hài lòng:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 text-luk-dim hover:scale-110 transition"
                    aria-label={`${star} sao`}
                  >
                    <Star
                      className={`h-5 w-5 transition ${
                        active
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-luk-border hover:text-amber-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-semibold text-amber-400 ml-2">
              {rating === 5
                ? 'Rất xuất sắc (5/5)'
                : rating === 4
                ? 'Hài lòng (4/5)'
                : rating === 3
                ? 'Bình thường (3/5)'
                : rating === 2
                ? 'Cần cải thiện (2/5)'
                : 'Chưa đạt (1/5)'}
            </span>
          </div>

          {/* Comment text */}
          <div>
            <label className="text-xs font-medium text-luk-text block mb-1.5">
              Nhận xét chi tiết:
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ cảm nhận về tốc độ bàn giao, độ chỉn chu của slide / video / tài liệu..."
              className="w-full rounded-xl border border-luk-border bg-luk-bg p-3 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-luk-blue px-5 py-2.5 text-xs font-semibold text-white hover:bg-luk-blueHover active:scale-95 transition shadow-md"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <MessageSquare className="h-4 w-4" />
                  <span>Gửi đánh giá</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
