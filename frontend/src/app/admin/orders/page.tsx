import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatVND } from '@/lib/vietqr';
import { ORDER_STATUS_CONFIG } from '@/components/orders/OrderStatusProgress';
import { Search, ArrowRight, Filter } from 'lucide-react';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const { status, q } = await searchParams;

  const whereClause: any = {};

  if (status && status !== 'ALL') {
    whereClause.status = status;
  }

  if (q && q.trim()) {
    const term = q.trim();
    whereClause.OR = [
      { orderCode: { contains: term } },
      { guestName: { contains: term } },
      { guestEmail: { contains: term } },
      { guestPhone: { contains: term } },
    ];
  }

  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        quotes: { orderBy: { createdAt: 'desc' }, take: 1 },
        payments: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
  } catch (error: any) {
    console.error('[AdminOrdersPage] Database query error:', error?.message || error);
  }

  const filterTabs = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING_REVIEW', label: 'Mới nhận' },
    { key: 'QUOTED', label: 'Đã báo giá' },
    { key: 'AWAITING_PAYMENT', label: 'Chờ thanh toán' },
    { key: 'PAYMENT_CONFIRMED', label: 'Đã TT' },
    { key: 'IN_PROGRESS', label: 'Đang làm' },
    { key: 'DRAFT_DELIVERED', label: 'Bản nháp' },
    { key: 'REVISING', label: 'Chỉnh sửa' },
    { key: 'COMPLETED', label: 'Hoàn thành' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luk-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Quản lý đơn hàng ({orders.length})
          </h1>
          <p className="text-xs text-luk-muted mt-0.5">
            Duyệt yêu cầu, báo giá, kiểm tra đối soát VietQR và bàn giao bản thảo
          </p>
        </div>

        {/* Search */}
        <form method="GET" className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-luk-dim" />
          <input
            type="text"
            name="q"
            defaultValue={q || ''}
            placeholder="Tìm theo mã đơn, tên, sđt..."
            className="w-full rounded-lg border border-luk-border bg-luk-card pl-9 pr-3 py-1.5 text-xs text-white placeholder-luk-dim focus:border-luk-blue focus:outline-none"
          />
          {status && <input type="hidden" name="status" value={status} />}
        </form>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = (status || 'ALL') === tab.key;
          return (
            <Link
              key={tab.key}
              href={`/admin/orders?status=${tab.key}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-luk-blue text-white shadow-sm'
                  : 'border border-luk-border bg-luk-card text-luk-muted hover:text-white'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-luk-border bg-luk-card p-4 sm:p-6 shadow-xl">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-luk-text">
              <thead className="bg-luk-bg text-[11px] uppercase font-semibold text-luk-muted">
                <tr>
                  <th className="px-3 py-2.5 rounded-l-lg">Mã đơn</th>
                  <th className="px-3 py-2.5">Khách hàng</th>
                  <th className="px-3 py-2.5">Dịch vụ</th>
                  <th className="px-3 py-2.5">Trạng thái</th>
                  <th className="px-3 py-2.5">Báo giá</th>
                  <th className="px-3 py-2.5">Hạn chót</th>
                  <th className="px-3 py-2.5 text-right rounded-r-lg">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luk-border/60">
                {orders.map((order) => {
                  const statusConfig = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING_REVIEW;
                  const quote = order.quotes[0];

                  return (
                    <tr key={order.id} className="hover:bg-luk-cardHover/50 transition">
                      <td className="px-3 py-3 font-mono font-bold text-white">
                        {order.orderCode}
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-white">{order.guestName}</p>
                        <p className="text-[10px] text-luk-dim">{order.guestPhone} • {order.guestEmail}</p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="truncate max-w-[200px] text-luk-muted">
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
                        {quote ? (
                          formatVND(quote.totalPrice)
                        ) : (
                          <span className="text-amber-400 font-normal">Chờ báo giá</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-luk-dim">
                        {quote?.confirmedDeadline ? (
                          new Date(quote.confirmedDeadline).toLocaleDateString('vi-VN')
                        ) : order.requestedDeadline ? (
                          new Date(order.requestedDeadline).toLocaleDateString('vi-VN')
                        ) : (
                          'Chưa đặt'
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-luk-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-luk-blueHover transition shadow-sm"
                        >
                          <span>Xử lý</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-luk-muted space-y-2">
            <Filter className="mx-auto h-8 w-8 text-luk-dim" />
            <p className="text-white font-medium">Không tìm thấy đơn hàng nào phù hợp</p>
            <p className="text-luk-dim">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
          </div>
        )}
      </div>
    </div>
  );
}
