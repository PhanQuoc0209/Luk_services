import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminSettingsClient } from './AdminSettingsClient';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  let setting: any = null;
  try {
    setting = await prisma.bankSetting.findUnique({
      where: { id: 'default' },
    });
  } catch (error: any) {
    console.error('[AdminSettingsPage] Database query error:', error?.message || error);
  }

  return <AdminSettingsClient initialSetting={setting} />;
}
