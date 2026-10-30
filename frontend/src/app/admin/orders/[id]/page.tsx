import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminOrderDetailClient } from './AdminOrderDetailClient';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      files: true,
      quotes: { orderBy: { createdAt: 'desc' } },
      payments: { orderBy: { createdAt: 'desc' } },
      drafts: {
        orderBy: { versionNumber: 'desc' },
        include: { feedbacks: { orderBy: { createdAt: 'asc' } } },
      },
      feedbacks: { orderBy: { createdAt: 'asc' } },
      auditLogs: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });

  if (!order) {
    notFound();
  }

  const bankSetting = await prisma.bankSetting.findUnique({
    where: { id: 'default' },
  });

  return <AdminOrderDetailClient order={order} bankSetting={bankSetting} />;
}
