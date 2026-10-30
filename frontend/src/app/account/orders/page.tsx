import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { formatVND } from '@/lib/vietqr';
import { ORDER_STATUS_CONFIG } from '@/components/orders/OrderStatusProgress';
import { FileText, ArrowRight, Clock, Plus } from 'lucide-react';

export const revalidate = 0;

export default async function AccountOrdersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { userId: user.id },
        { guestEmail: user.email },
      ],
    },
    include: {
      items: true,
      quotes: { orderBy: { createdAt: 'desc' }, take: 1 },
      drafts: { orderBy: { versionNumber: 'desc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luk-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-luk-blueLight" />
            <span>Đơn hàng của tôi</span>
          </h1>
          <p className="text-xs text-luk-muted mt-0.5">
            Quản lý và theo dõi tiến độ các yêu cầu dịch vụ bạn đã gửi
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 rounded-xl bg-luk-blue px-3.5 py-2 text-xs font-semibold text-white hover:bg-luk-blueHover transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Đặt thêm dịch vụ</span>
        </Link>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING_REVIEW;
            const quote = order.quotes[0];
            const latestDraft = order.drafts[0];

            return (
              <div
                key={order.id}
                className="rounded-xl border border-luk-border bg-luk-card p-5 space-y-4 hover:border-luk-borderLight transition shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-luk-border/60 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-white">
                      #{order.orderCode}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${statusConfig.color}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>

                  <span className="text-[11px] text-luk-dim">
                    Ngày gửi: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-luk-dim block mb-1">Dịch vụ đã chọn:</span>
                    <p className="font-medium text-white truncate">
                      {order.items.map((i) => i.serviceTitleSnapshot).join(', ')}
                    </p>
                    <p className="text-[11px] text-luk-muted">Tổng {order.items.length} dịch vụ</p>
                  </div>

                  <div>
                    <span className="text-luk-dim block mb-1">Giá trị đơn:</span>
                    <p className="font-bold text-white text-sm">
                      {quote ? formatVND(quote.totalPrice) : 'Chờ admin báo giá'}
                    </p>
                    {quote?.depositAmount ? (
                      <p className="text-[11px] text-amber-400">Cọc: {formatVND(quote.depositAmount)}</p>
                    ) : null}
                  </div>

                  <div>
                    <span className="text-luk-dim block mb-1">Tình trạng bản nháp:</span>
                    {latestDraft ? (
                      <p className="font-medium text-blue-400">
                        Phiên bản v{latestDraft.versionNumber} ({latestDraft.versionType === 'FINAL' ? 'Bản cuối' : 'Bản nháp'})
                      </p>
                    ) : (
                      <p className="text-luk-dim italic">Chưa tải lên bản thảo</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end border-t border-luk-border/60 pt-3">
                  <Link
                    href={`/orders/${order.orderCode}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-luk-border bg-luk-bg px-3.5 py-1.5 text-xs font-semibold text-white hover:border-luk-blue hover:text-blue-400 transition"
                  >
                    <span>Mở chi tiết & Thanh toán</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-luk-border bg-luk-card p-12 text-center space-y-4">
          <Clock className="mx-auto h-10 w-10 text-luk-dim" />
          <h2 className="text-sm font-bold text-white">Bạn chưa có đơn dịch vụ nào</h2>
          <p className="text-xs text-luk-muted max-w-sm mx-auto">
            Khám phá danh mục tài khoản AI Pro, Edit Video, Transcript và Slide thuyết trình của LUK Services ngay.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 rounded-xl bg-luk-blue px-4 py-2 text-xs font-semibold text-white hover:bg-luk-blueHover transition"
          >
            <span>Khám phá dịch vụ</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
