import React from 'react';
import { CheckoutClient } from './CheckoutClient';

export const metadata = {
  title: 'Xác nhận thông tin & Gửi yêu cầu — LUK Services',
  description: 'Nhập thông tin liên hệ và đính kèm tài liệu để nhận báo giá.',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
