import React from 'react';
import { OrderDetailClient } from './OrderDetailClient';

export const metadata = {
  title: 'Chi tiết đơn dịch vụ — LUK Services',
  description: 'Theo dõi tiến độ, thanh toán và góp ý bản thảo trực tiếp.',
};

interface PageProps {
  params: Promise<{ orderCode: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { orderCode } = await params;
  return <OrderDetailClient orderCode={orderCode} />;
}
