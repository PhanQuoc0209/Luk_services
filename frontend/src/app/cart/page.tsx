import React from 'react';
import { CartClient } from './CartClient';

export const metadata = {
  title: 'Giỏ hàng dịch vụ — LUK Services',
  description: 'Xem lại danh sách dịch vụ và chuẩn bị gửi yêu cầu báo giá.',
};

export default function CartPage() {
  return <CartClient />;
}
