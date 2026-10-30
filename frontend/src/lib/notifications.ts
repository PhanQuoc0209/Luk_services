import { prisma } from './prisma';

export type NotificationType =
  | 'ORDER_RECEIVED'
  | 'QUOTE_ISSUED'
  | 'PAYMENT_REQUIRED'
  | 'PAYMENT_CONFIRMED'
  | 'DRAFT_DELIVERED'
  | 'FEEDBACK_RECEIVED'
  | 'ORDER_COMPLETED';

export interface CreateNotificationParams {
  userId?: string | null;
  guestEmail?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl: string;
}

export async function createNotification(params: CreateNotificationParams) {
  // 1. In-app notification saved in database
  const notification = await prisma.notification.create({
    data: {
      userId: params.userId || null,
      guestEmail: params.guestEmail || null,
      type: params.type,
      title: params.title,
      message: params.message,
      linkUrl: params.linkUrl,
      isRead: false,
    },
  });

  // 2. Email dispatch interface
  await dispatchEmailNotification({
    recipient: params.guestEmail || (params.userId ? await getUserEmail(params.userId) : null),
    subject: params.title,
    message: params.message,
    actionUrl: params.linkUrl,
  });

  return notification;
}

async function getUserEmail(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  return user?.email || null;
}

export interface EmailPayload {
  recipient: string | null;
  subject: string;
  message: string;
  actionUrl: string;
}

export async function dispatchEmailNotification(payload: EmailPayload) {
  if (!payload.recipient) return;

  const hasSmtpConfig = Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );

  if (!hasSmtpConfig) {
    // Graceful fallback logging when SMTP credentials are not configured in environment
    console.log(
      `[EMAIL SERVICE: SMTP Chưa Cấu Hình] To: ${payload.recipient} | Subject: ${payload.subject} | Action: ${payload.actionUrl}\nMessage: ${payload.message}`
    );
    return;
  }

  // When SMTP is provided:
  console.log(`[EMAIL SERVICE: Đang gửi email qua SMTP ${process.env.SMTP_HOST}] To: ${payload.recipient}`);
}

export async function getUnreadNotificationCount(userId?: string, guestEmail?: string): Promise<number> {
  if (!userId && !guestEmail) return 0;
  return prisma.notification.count({
    where: {
      isRead: false,
      OR: [
        ...(userId ? [{ userId }] : []),
        ...(guestEmail ? [{ guestEmail }] : []),
      ],
    },
  });
}
