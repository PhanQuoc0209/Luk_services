import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { updateBankSettingSchema } from '@/lib/validation';
import { logAudit } from '@/lib/audit';

export async function GET() {
  try {
    await requireAdmin();
    const setting = await prisma.bankSetting.findUnique({
      where: { id: 'default' },
    });
    return NextResponse.json({ success: true, setting });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN_ADMIN_ONLY' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Yêu cầu quyền Quản trị viên (Admin).' }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const parsed = updateBankSettingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.format() }, { status: 400 });
    }

    const {
      bankName,
      bankCode,
      accountNumber,
      accountHolder,
      branch,
      isDepositAllowed,
      defaultDepositPercent,
    } = parsed.data;

    const setting = await prisma.bankSetting.upsert({
      where: { id: 'default' },
      update: {
        bankName,
        bankCode,
        accountNumber,
        accountHolder,
        branch: branch || null,
        isDepositAllowed,
        defaultDepositPercent,
      },
      create: {
        id: 'default',
        bankName,
        bankCode,
        accountNumber,
        accountHolder,
        branch: branch || null,
        isDepositAllowed,
        defaultDepositPercent,
      },
    });

    // Audit Log
    await logAudit({
      entityType: 'SETTINGS',
      entityId: 'bank_config',
      action: 'UPDATE_BANK_SETTINGS',
      actorId: admin.id,
      actorRole: 'ADMIN',
      details: {
        bankName,
        bankCode,
        accountNumber,
        accountHolder,
      },
    });

    return NextResponse.json({ success: true, setting });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN_ADMIN_ONLY' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Yêu cầu quyền Quản trị viên (Admin).' }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
