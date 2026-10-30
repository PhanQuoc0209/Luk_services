import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ orderCode: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { orderCode } = await params;
    const user = await getCurrentUser();

    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: {
        items: {
          include: {
            service: true,
          },
        },
        files: true,
        quotes: {
          orderBy: { createdAt: 'desc' },
          include: {
            admin: {
              select: { name: true, email: true },
            },
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
        drafts: {
          orderBy: { versionNumber: 'desc' },
          include: {
            feedbacks: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
        feedbacks: {
          orderBy: { createdAt: 'asc' },
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
        },
        review: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    // Get active bank setting for VietQR
    const bankSetting = await prisma.bankSetting.findUnique({
      where: { id: 'default' },
    });

    return NextResponse.json({
      success: true,
      order,
      bankSetting,
      currentUserRole: user?.role || 'GUEST',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
