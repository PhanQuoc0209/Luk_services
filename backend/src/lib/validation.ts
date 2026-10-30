import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Vui lòng nhập họ và tên'),
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  phone: z.string().optional(),
});

export const checkoutSchema = z.object({
  guestName: z.string().min(2, 'Vui lòng nhập họ và tên'),
  guestEmail: z.string().email('Vui lòng nhập email hợp lệ để nhận báo giá'),
  guestPhone: z.string().min(9, 'Vui lòng nhập số điện thoại liên hệ'),
  requestedDeadline: z.string().optional(),
  generalNotes: z.string().optional(),
  itemDetails: z.array(
    z.object({
      serviceId: z.string(),
      itemNotes: z.string().optional(),
      uploadedFiles: z
        .array(
          z.object({
            fileName: z.string(),
            originalName: z.string(),
            fileSize: z.number(),
            mimeType: z.string(),
            storagePath: z.string(),
          })
        )
        .optional(),
    })
  ).min(1, 'Giỏ hàng trống'),
});

export const createQuoteSchema = z.object({
  totalPrice: z.number().int().positive('Tổng giá tiền phải lớn hơn 0'),
  depositAmount: z.number().int().min(0, 'Số tiền cọc không được âm'),
  confirmedDeadline: z.string().min(1, 'Vui lòng chọn thời hạn hoàn thành'),
  paymentNotes: z.string().optional(),
});

export const submitPaymentProofSchema = z.object({
  paymentType: z.enum(['FULL', 'DEPOSIT', 'REMAINDER']).default('FULL'),
  amount: z.number().int().positive('Số tiền phải lớn hơn 0'),
  proofNotes: z.string().optional(),
  proofFileName: z.string().optional(),
  proofStoragePath: z.string().optional(),
});

export const confirmPaymentSchema = z.object({
  paymentId: z.string(),
  confirmed: z.boolean(),
  adminNotes: z.string().optional(),
});

export const createDraftSchema = z.object({
  versionNumber: z.number().int().positive('Số phiên bản phải lớn hơn 0'),
  versionType: z.enum(['DRAFT', 'FINAL']).default('DRAFT'),
  title: z.string().min(2, 'Tiêu đề bản nháp không được để trống'),
  notes: z.string().optional(),
  previewUrl: z.string().url('Đường dẫn preview không hợp lệ').optional().or(z.literal('')),
  canDownload: z.boolean().default(true),
  isFinal: z.boolean().default(false),
  uploadedFile: z
    .object({
      fileName: z.string(),
      originalName: z.string(),
      fileSize: z.number(),
      mimeType: z.string(),
      storagePath: z.string(),
    })
    .optional(),
});

export const submitFeedbackSchema = z.object({
  draftVersionId: z.string().optional(),
  content: z.string().min(2, 'Nội dung phản hồi không được để trống'),
  revisionRequested: z.boolean().default(false),
});

export const updateBankSettingSchema = z.object({
  bankName: z.string().min(2, 'Tên ngân hàng không được để trống'),
  bankCode: z.string().min(2, 'Mã ngân hàng không được để trống'),
  accountNumber: z.string().min(4, 'Số tài khoản không hợp lệ'),
  accountHolder: z.string().min(2, 'Tên chủ tài khoản không được để trống'),
  branch: z.string().optional(),
  isDepositAllowed: z.boolean().default(true),
  defaultDepositPercent: z.number().int().min(10).max(100).default(50),
});

export const orderStatusSchema = z.object({
  status: z.enum([
    'PENDING_REVIEW',
    'IN_REVIEW',
    'QUOTED',
    'AWAITING_PAYMENT',
    'PAYMENT_CONFIRMED',
    'IN_PROGRESS',
    'DRAFT_DELIVERED',
    'AWAITING_FEEDBACK',
    'REVISING',
    'COMPLETED',
    'CANCELLED',
  ]),
  notes: z.string().optional(),
});
