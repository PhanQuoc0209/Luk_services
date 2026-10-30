export interface VietQrParams {
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  amount: number;
  transferContent: string;
  template?: string; // e.g. "compact2", "qr_only", "print"
}

export function buildVietQrUrl(params: VietQrParams): string {
  const {
    bankCode,
    accountNumber,
    accountHolder,
    amount,
    transferContent,
    template = 'compact2',
  } = params;

  const cleanBankCode = encodeURIComponent(bankCode.trim());
  const cleanAccount = encodeURIComponent(accountNumber.trim());
  const cleanTemplate = encodeURIComponent(template);

  const queryParams = new URLSearchParams();
  if (amount > 0) {
    queryParams.set('amount', Math.round(amount).toString());
  }
  if (transferContent) {
    queryParams.set('addInfo', transferContent.trim());
  }
  if (accountHolder) {
    queryParams.set('accountName', accountHolder.trim());
  }

  return `https://img.vietqr.io/image/${cleanBankCode}-${cleanAccount}-${cleanTemplate}.png?${queryParams.toString()}`;
}

export function formatVND(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}
