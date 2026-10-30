import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function PrivacyPage() {
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
          <Lock className="h-5 w-5 text-emerald-400" />
          <h1 className="text-xl font-bold text-white">Chính sách bảo mật tài liệu</h1>
        </div>

        <div className="space-y-4 text-xs text-luk-muted leading-relaxed">
          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">1. Lưu trữ riêng tư (Private Storage)</h2>
            <p>
              Tất cả các tài liệu nguồn, bài thuyết trình, footage video và file tiểu luận được lưu trữ trên vùng nhớ riêng biệt với cơ chế phân quyền an toàn phía server. Không công khai URL trực tiếp trên mạng.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">2. Quyền truy cập có kiểm soát</h2>
            <p>
              Chỉ khách hàng sở hữu mã đơn hàng và Quản trị viên phụ trách mới có quyền tải xuống tài liệu hoặc xem các bản nháp có phân quyền.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-semibold text-white">3. Bảo vệ thông tin tài chính</h2>
            <p>
              Mã giao dịch và thông tin chuyển khoản ngân hàng được mã hóa và đối soát trực tiếp, không chia sẻ cho bên thứ ba.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
