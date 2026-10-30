import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatVND } from '@/lib/vietqr';
import { ORDER_STATUS_CONFIG } from '@/components/orders/OrderStatusProgress';
import {
  Inbox,
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowRight,
  Receipt,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminOverviewPage() {
  let totalOrders = 0;
  let pendingReviewOrders = 0;
  let quotedOrders = 0;
  let inProgressOrders = 0;
  let completedOrders = 0;
  let payments: any[] = [];
  let recentOrders: any[] = [];

  try {
    const res = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING_REVIEW' } }),
      prisma.order.count({ where: { status: { in: ['QUOTED', 'AWAITING_PAYMENT'] } } }),
      prisma.order.count({
        where: {
          status: { in: ['PAYMENT_CONFIRMED', 'IN_PROGRESS', 'DRAFT_DELIVERED', 'AWAITING_FEEDBACK', 'REVISING'] },
        },
      }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.payment.findMany({ where: { paymentStatus: 'CONFIRMED' } }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: {
          items: true,
          quotes: { orderBy: { createdAt: 'desc' }, take: 1 },
          payments: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      }),
    ]);
    totalOrders = res[0];
    pendingReviewOrders = res[1];
    quotedOrders = res[2];
    inProgressOrders = res[3];
    completedOrders = res[4];
    payments = res[5];
    recentOrders = res[6];
  } catch (error: any) {
    console.error('[AdminOverviewPage] Database connection notice:', error?.message || error);
  }

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Bảng điều khiển Quản trị LUK Services
        </h1>
        <p className="text-xs text-luk-muted mt-1">
          Theo dõi tổng quan tiến độ các đơn hàng, duyệt báo giá và xác nhận giao dịch thanh toán
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl border border-luk-border bg-luk-card p-4 space-y-2">
          <div className="flex items-center justify-between text-luk-dim">
            <span className="text-[11px] font-semibold uppercase">Mới nhận</span>
            <Inbox className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">{pendingReviewOrders}</p>
          <p className="text-[10px] text-luk-dim">Cần xem xét báo giá</p>
        </div>

        <div className="rounded-xl border border-luk-border bg-luk-card p-4 space-y-2">
          <div className="flex items-center justify-between text-luk-dim">
            <span className="text-[11px] font-semibold uppercase">Chờ thanh toán</span>
            <Receipt className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-400">{quotedOrders}</p>
          <p className="text-[10px] text-luk-dim">Đã gửi báo giá</p>
        </div>

        <div className="rounded-xl border border-luk-border bg-luk-card p-4 space-y-2">
          <div className="flex items-center justify-between text-luk-dim">
            <span className="text-[11px] font-semibold uppercase">Đang thực hiện</span>
            <FileCheck className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-blue-400">{inProgressOrders}</p>
          <p className="text-[10px] text-luk-dim">Bao gồm khâu bản thảo</p>
        </div>

        <div className="rounded-xl border border-luk-border bg-luk-card p-4 space-y-2">
          <div className="flex items-center justify-between text-luk-dim">
            <span className="text-[11px] font-semibold uppercase">Đã hoàn thành</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{completedOrders}</p>
          <p className="text-[10px] text-luk-dim">Đã bàn giao bản cuối</p>
        </div>

        <div className="col-span-2 lg:col-span-1 rounded-xl border border-luk-border bg-luk-card p-4 space-y-2">
          <div className="flex items-center justify-between text-luk-dim">
            <span className="text-[11px] font-semibold uppercase">Doanh thu thực tế</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xl font-black text-white">{formatVND(totalRevenue)}</p>
          <p className="text-[10px] text-emerald-400 font-medium">Đối soát tài khoản thực</p>
        </div>
      </div>

      {/* Action Needed Callout if any pending review */}
      {pendingReviewOrders > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              Có <strong>{pendingReviewOrders} đơn hàng mới nhận</strong> đang chờ admin báo giá và đặt thời hạn hoàn thiện.
            </span>
          </div>
          <Link
            href="/admin/orders?status=PENDING_REVIEW"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 font-bold text-black hover:bg-amber-400 transition shrink-0"
          >
            <span>Xử lý ngay</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="rounded-2xl border border-luk-border bg-luk-card p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-luk-border pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Đơn hàng mới nhất ({totalOrders} đơn)
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-luk-text">
            <thead className="bg-luk-bg text-[11px] uppercase font-semibold text-luk-muted">
              <tr>
                <th className="px-3 py-2.5 rounded-l-lg">Mã đơn</th>
                <th className="px-3 py-2.5">Khách hàng</th>
                <th className="px-3 py-2.5">Dịch vụ</th>
                <th className="px-3 py-2.5">Trạng thái</th>
                <th className="px-3 py-2.5">Báo giá</th>
                <th className="px-3 py-2.5">Ngày tạo</th>
                <th className="px-3 py-2.5 text-right rounded-r-lg">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luk-border/60">
              {recentOrders.map((order) => {
                const statusConfig = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING_REVIEW;
                const quote = order.quotes[0];

                return (
                  <tr key={order.id} className="hover:bg-luk-cardHover/50 transition">
                    <td className="px-3 py-3 font-mono font-bold text-white">
                      {order.orderCode}
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-white">{order.guestName}</p>
                      <p className="text-[10px] text-luk-dim">{order.guestPhone}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="truncate max-w-[180px]">
                        {order.items.map((i: any) => i.serviceTitleSnapshot).join(', ')}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusConfig.color}`}
                      >
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-semibold text-white">
                      {quote ? formatVND(quote.totalPrice) : <span className="text-luk-dim">Chưa báo</span>}
                    </td>
                    <td className="px-3 py-3 text-luk-dim">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-luk-border bg-luk-bg px-2.5 py-1 text-[11px] font-medium text-white hover:border-luk-blue hover:text-blue-400 transition"
                      >
                        <span>Quản lý</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
