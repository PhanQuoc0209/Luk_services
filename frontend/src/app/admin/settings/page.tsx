import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminSettingsClient } from './AdminSettingsClient';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const setting = await prisma.bankSetting.findUnique({
    where: { id: 'default' },
  });

  return <AdminSettingsClient initialSetting={setting} />;
}
