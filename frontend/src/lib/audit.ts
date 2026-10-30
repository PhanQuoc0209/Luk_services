import { prisma } from './prisma';

export interface AuditLogParams {
  orderId?: string | null;
  entityType: 'ORDER' | 'PAYMENT' | 'QUOTE' | 'DRAFT' | 'FEEDBACK' | 'AUTH' | 'SETTINGS';
  entityId: string;
  action: string;
  actorId?: string | null;
  actorRole: 'ADMIN' | 'CUSTOMER' | 'SYSTEM';
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
}

export async function logAudit(params: AuditLogParams) {
  try {
    return await prisma.auditLog.create({
      data: {
        orderId: params.orderId || null,
        entityType: params.entityType,
        entityId: params.entityId,
        action: params.action,
        actorId: params.actorId || null,
        actorRole: params.actorRole,
        detailsJson: params.details ? JSON.stringify(params.details) : null,
        ipAddress: params.ipAddress || null,
      },
    });
  } catch (error) {
    console.error('Lỗi khi ghi audit log:', error);
    return null;
  }
}
