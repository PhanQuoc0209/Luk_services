import React from 'react';
import {
  Inbox,
  Search,
  Receipt,
  QrCode,
  CheckCircle,
  Wrench,
  FileCheck,
  MessageSquare,
  RefreshCw,
  Trophy,
  XCircle,
} from 'lucide-react';

export const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; step: number; color: string; icon: any; description: string }
> = {
  PENDING_REVIEW: {
    label: 'Mới nhận',
    step: 1,
    color: 'badge-status-pending',
    icon: Inbox,
    description: 'Đơn hàng mới tạo, đang chờ admin tiếp nhận hồ sơ.',
  },
  IN_REVIEW: {
    label: 'Đang xem xét',
    step: 2,
    color: 'badge-status-review',
    icon: Search,
    description: 'Admin đang đọc yêu cầu, kiểm tra file đính kèm để lên báo giá.',
  },
  QUOTED: {
    label: 'Đã báo giá',
    step: 3,
    color: 'badge-status-quoted',
    icon: Receipt,
    description: 'Admin đã gửi báo giá chính xác và thời hạn cam kết. Vui lòng xem và thanh toán.',
  },
  AWAITING_PAYMENT: {
    label: 'Chờ thanh toán',
    step: 4,
    color: 'badge-status-payment',
    icon: QrCode,
    description: 'Đang chờ bạn quét VietQR chuyển khoản (toàn bộ hoặc đặt cọc).',
  },
  PAYMENT_CONFIRMED: {
    label: 'Đã xác nhận thanh toán',
    step: 5,
    color: 'badge-status-confirmed',
    icon: CheckCircle,
    description: 'Admin đã kiểm tra tài khoản ngân hàng và xác nhận giao dịch thành công.',
  },
  IN_PROGRESS: {
    label: 'Đang thực hiện',
    step: 6,
    color: 'badge-status-review',
    icon: Wrench,
    description: 'Đội ngũ chuyên môn đang tiến hành thực hiện theo đúng outline đã chốt.',
  },
  DRAFT_DELIVERED: {
    label: 'Bản nháp sẵn sàng',
    step: 7,
    color: 'badge-status-draft',
    icon: FileCheck,
    description: 'Admin đã tải lên bản nháp. Bạn có thể xem trước và gửi yêu cầu chỉnh sửa.',
  },
  AWAITING_FEEDBACK: {
    label: 'Chờ phản hồi',
    step: 8,
    color: 'badge-status-draft',
    icon: MessageSquare,
    description: 'Đang chờ góp ý chi tiết từ phía bạn để tối ưu sản phẩm.',
  },
  REVISING: {
    label: 'Đang chỉnh sửa',
    step: 9,
    color: 'badge-status-review',
    icon: RefreshCw,
    description: 'Đang cập nhật sản phẩm theo các góp ý của bạn.',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    step: 10,
    color: 'badge-status-completed',
    icon: Trophy,
    description: 'Đơn hàng đã bàn giao bản cuối cùng và hoàn tất xuất sắc!',
  },
  CANCELLED: {
    label: 'Đã hủy',
    step: 0,
    color: 'badge-status-cancelled',
    icon: XCircle,
    description: 'Đơn hàng đã hủy bỏ.',
  },
};

export function OrderStatusProgress({ currentStatus }: { currentStatus: string }) {
  const currentConfig = ORDER_STATUS_CONFIG[currentStatus] || ORDER_STATUS_CONFIG.PENDING_REVIEW;
  const isCancelled = currentStatus === 'CANCELLED';

  const stepsList = [
    { key: 'PENDING_REVIEW', label: 'Mới nhận' },
    { key: 'QUOTED', label: 'Báo giá' },
    { key: 'PAYMENT_CONFIRMED', label: 'Thanh toán' },
    { key: 'IN_PROGRESS', label: 'Thực hiện' },
    { key: 'DRAFT_DELIVERED', label: 'Bản nháp' },
    { key: 'COMPLETED', label: 'Bản cuối' },
  ];

  const currentStepNum = currentConfig.step;

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
        <XCircle className="h-5 w-5 shrink-0" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider">Đơn hàng đã hủy</p>
          <p className="text-[11px] text-red-200/80">Yêu cầu này không còn hiệu lực.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-luk-border bg-luk-card p-4 sm:p-6 shadow-sm">
      {/* Current Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-luk-border pb-4">
        <div className="flex items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${currentConfig.color}`}
          >
            {React.createElement(currentConfig.icon, { className: 'h-3.5 w-3.5' })}
            <span>{currentConfig.label}</span>
          </span>
          <span className="text-xs text-luk-muted font-medium">
            (Bước {currentStepNum}/10)
          </span>
        </div>
        <p className="text-xs text-luk-muted sm:text-right">{currentConfig.description}</p>
      </div>

      {/* Visual Stepper */}
      <div className="relative pt-2">
        <div className="grid grid-cols-6 gap-1 sm:gap-2">
          {stepsList.map((stepItem, index) => {
            const stepConfig = ORDER_STATUS_CONFIG[stepItem.key];
            const isPassed = currentStepNum >= stepConfig.step;
            const isCurrent =
              currentStatus === stepItem.key ||
              (stepItem.key === 'QUOTED' && currentStatus === 'AWAITING_PAYMENT') ||
              (stepItem.key === 'DRAFT_DELIVERED' &&
                (currentStatus === 'AWAITING_FEEDBACK' || currentStatus === 'REVISING'));

            return (
              <div key={stepItem.key} className="flex flex-col items-center text-center">
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                    isCurrent
                      ? 'bg-luk-blue text-white ring-4 ring-blue-500/20 shadow-md'
                      : isPassed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-luk-bg text-luk-dim border border-luk-border'
                  }`}
                >
                  {isPassed && !isCurrent ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`mt-1.5 text-[10px] sm:text-xs font-medium truncate max-w-full ${
                    isCurrent
                      ? 'text-blue-400 font-bold'
                      : isPassed
                      ? 'text-white'
                      : 'text-luk-dim'
                  }`}
                >
                  {stepItem.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
