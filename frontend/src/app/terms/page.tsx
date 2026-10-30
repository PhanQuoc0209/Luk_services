import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-luk-muted hover:text-luk-text transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Quay lại trang chủ</span>
      </Link>

      <div className="rounded-2xl border border-luk-border bg-luk-card p-6 md:p-8 space-y-5">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-luk-blueLight" />
          <h1 className="text-xl font-bold text-white">Điều khoản dịch vụ LUK Services</h1>
        </div>

        <div className="space-y-4 text-xs text-luk-muted leading-relaxed">
          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">1. Mục đích và Phạm vi</h2>
            <p>
              LUK Services là nền tảng kết nối và cung cấp dịch vụ hỗ trợ học thuật, tranh biện, truyền thông và thiết kế dành riêng cho sinh viên trong hệ sinh thái LUK Global.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">2. Quy trình Báo giá và Thanh toán</h2>
            <p>
              Khách hàng thêm dịch vụ vào giỏ và xác nhận checkout mà không phải trả tiền trước. Admin chịu trách nhiệm kiểm tra tài liệu nguồn, độ phức tạp và gửi báo giá chính xác. Khách thanh toán qua VietQR và Admin thực hiện đối soát thủ công trước khi bắt tay thực hiện.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">3. Bản nháp và Góp ý Chỉnh sửa</h2>
            <p>
              Sản phẩm sẽ được bàn giao qua các phiên bản nháp (Draft). Khách hàng có quyền gửi góp ý phản hồi và yêu cầu chỉnh sửa theo đúng phạm vi cam kết ban đầu cho đến khi Admin bàn giao bản cuối cùng (Final).
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">4. Cam kết Liêm chính Học thuật</h2>
            <p>
              Các dịch vụ nghiên cứu và hiệu đính chỉ đóng vai trò hỗ trợ phương pháp luận, chuẩn hóa trích dẫn (APA/IEEE) và hoàn thiện hình thức trình bày. Khách hàng hoàn toàn chịu trách nhiệm về nội dung học thuật của bản thân.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
