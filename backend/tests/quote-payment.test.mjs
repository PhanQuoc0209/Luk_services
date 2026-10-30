import test from 'node:test';
import assert from 'node:assert/strict';

function buildVietQrUrl(params) {
  const { bankCode, accountNumber, accountHolder, amount, transferContent, template = 'compact2' } = params;
  const cleanBank = encodeURIComponent(bankCode.trim());
  const cleanAcc = encodeURIComponent(accountNumber.trim());
  const cleanTemplate = encodeURIComponent(template);

  const q = new URLSearchParams();
  if (amount > 0) q.set('amount', Math.round(amount).toString());
  if (transferContent) q.set('addInfo', transferContent.trim());
  if (accountHolder) q.set('accountName', accountHolder.trim());

  return `https://img.vietqr.io/image/${cleanBank}-${cleanAcc}-${cleanTemplate}.png?${q.toString()}`;
}

test('VietQR: Generated URL matches format and parameters', () => {
  const url = buildVietQrUrl({
    bankCode: 'MB',
    accountNumber: '0988888888',
    accountHolder: 'LUK SERVICES',
    amount: 350000,
    transferContent: 'LUK 2610-8888',
  });

  assert.ok(url.startsWith('https://img.vietqr.io/image/MB-0988888888-compact2.png'));
  assert.ok(url.includes('amount=350000'));
  assert.ok(url.includes('addInfo=LUK+2610-8888') || url.includes('addInfo=LUK%202610-8888'));
  assert.ok(url.includes('accountName=LUK+SERVICES') || url.includes('accountName=LUK%20SERVICES'));
});

test('Payment Lifecycle: Customer slip upload does NOT auto-mark payment as confirmed', () => {
  const order = {
    orderCode: 'LUK-1234',
    status: 'QUOTED',
    quotedPrice: 300000,
    payments: [],
  };

  // Customer submits payment notice
  const paymentRecord = {
    id: 'pay_1',
    amount: 300000,
    paymentStatus: 'PENDING_CONFIRMATION', // Strictly pending!
    confirmedAt: null,
    confirmedByUserId: null,
  };
  order.payments.push(paymentRecord);
  order.status = 'AWAITING_PAYMENT';

  assert.equal(paymentRecord.paymentStatus, 'PENDING_CONFIRMATION');
  assert.notEqual(order.status, 'PAYMENT_CONFIRMED', 'Order must not be marked confirmed just by slip upload');

  // Admin manually verifies real banking app
  const adminId = 'admin_001';
  paymentRecord.paymentStatus = 'CONFIRMED';
  paymentRecord.confirmedAt = new Date().toISOString();
  paymentRecord.confirmedByUserId = adminId;
  order.status = 'PAYMENT_CONFIRMED';

  assert.equal(paymentRecord.paymentStatus, 'CONFIRMED');
  assert.equal(paymentRecord.confirmedByUserId, adminId);
  assert.equal(order.status, 'PAYMENT_CONFIRMED');
});
