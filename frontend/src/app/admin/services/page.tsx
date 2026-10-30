import React from 'react';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { AdminServicesClient } from './AdminServicesClient';

export const revalidate = 0;

export default async function AdminServicesPage() {
  await requireAdmin();

  const services = await prisma.service.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { orderItems: true, reviews: true },
      },
    },
  });

  return <AdminServicesClient initialServices={services as any} />;
}
