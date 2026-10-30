'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Star,
  Eye,
  Clock,
  DollarSign,
  Check,
} from 'lucide-react';
import { formatVND } from '@/lib/vietqr';

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  startingPrice: number;
  turnaround: string;
  deliveryFormat: string;
  imageUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  tags?: string | null;
  isDemo: boolean;
  _count?: {
    orderItems: number;
    reviews: number;
  };
}

const CATEGORY_MAP: Record<string, string> = {
  AI_ACCOUNTS: 'Các AI Pro',
  VIDEO_EDITING: 'Edit Chuẩn LUK',
  TRANSCRIPT_EDITING: 'Transcript Chuẩn LUK',
  SLIDE_DESIGN: 'Slide Chuẩn LUK',
};

export function AdminServicesClient({ initialServices }: { initialServices: ServiceItem[] }) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit / Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'SLIDE_DESIGN',
    startingPrice: 200000,
    turnaround: '2-3 ngày',
    deliveryFormat: 'File kỹ thuật số',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    shortDescription: '',
    description: '',
    isFeatured: false,
    isPopular: false,
    tags: '',
    isActive: true,
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = services.filter((s) => {
    if (selectedCat !== 'ALL' && s.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q);
    }
    return true;
  });

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      category: 'SLIDE_DESIGN',
      startingPrice: 200000,
      turnaround: '2-3 ngày',
      deliveryFormat: 'File kỹ thuật số',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
      shortDescription: '',
      description: '',
      isFeatured: false,
      isPopular: false,
      tags: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      category: service.category,
      startingPrice: service.startingPrice,
      turnaround: service.turnaround,
      deliveryFormat: service.deliveryFormat,
      imageUrl: service.imageUrl,
      shortDescription: service.shortDescription,
      description: service.description,
      isFeatured: service.isFeatured,
      isPopular: service.isPopular,
      tags: service.tags || '',
      isActive: service.isActive,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (service: ServiceItem) => {
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !service.isActive }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, isActive: !s.isActive } : s))
        );
        setFeedback({
          type: 'success',
          message: `Đã ${!service.isActive ? 'kích hoạt' : 'tạm dừng'} dịch vụ "${service.title}".`,
        });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Lỗi khi cập nhật trạng thái dịch vụ.' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        setFeedback({ type: 'success', message: data.message || 'Đã xóa dịch vụ thành công.' });
      } else {
        setFeedback({ type: 'error', message: data.error || 'Lỗi khi xóa dịch vụ.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Lỗi kết nối khi xóa dịch vụ.' });
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      if (editingService) {
        // Update
        const res = await fetch(`/api/admin/services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setServices((prev) =>
            prev.map((s) => (s.id === editingService.id ? { ...s, ...formData } : s))
          );
          setFeedback({ type: 'success', message: 'Cập nhật dịch vụ thành công!' });
          setIsModalOpen(false);
        } else {
          setFeedback({ type: 'error', message: data.error || 'Lỗi khi lưu dịch vụ.' });
        }
      } else {
        // Create
        const res = await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setServices((prev) => [data.service, ...prev]);
          setFeedback({ type: 'success', message: 'Tạo dịch vụ mới thành công!' });
          setIsModalOpen(false);
        } else {
          setFeedback({ type: 'error', message: data.error || 'Lỗi khi tạo dịch vụ.' });
        }
      }
    } catch {
      setFeedback({ type: 'error', message: 'Lỗi máy chủ khi lưu dịch vụ.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luk-border pb-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-amber-400" />
            <span>Quản Lý Danh Mục & Dịch Vụ Sinh Viên</span>
          </h1>
          <p className="text-xs text-luk-muted mt-1">
            Tổng cộng {services.length} dịch vụ đang có trên hệ thống LUK Services
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-luk-blue px-4 py-2 text-xs font-semibold text-white hover:bg-luk-blueHover active:scale-95 transition shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm dịch vụ mới</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`flex items-center justify-between rounded-xl p-3 text-xs border ${
            feedback.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/30 bg-red-500/10 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-luk-muted hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-luk-dim" />
          <input
            type="text"
            placeholder="Tìm theo tên dịch vụ hoặc mô tả ngắn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-luk-border bg-luk-card pl-9 pr-4 py-2 text-xs text-luk-text placeholder-luk-dim focus:border-luk-blue focus:outline-none"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full rounded-xl border border-luk-border bg-luk-card px-3 py-2 text-xs text-luk-text focus:border-luk-blue focus:outline-none"
          >
            <option value="ALL">Tất cả danh mục (6)</option>
            {Object.entries(CATEGORY_MAP).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="overflow-x-auto rounded-2xl border border-luk-border bg-luk-card shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-luk-border bg-luk-bg/40 text-luk-muted">
              <th className="p-3 pl-4">Dịch vụ</th>
              <th className="p-3">Danh mục</th>
              <th className="p-3">Giá từ</th>
              <th className="p-3">Thời gian</th>
              <th className="p-3 text-center">Đơn / Đánh giá</th>
              <th className="p-3 text-center">Trạng thái</th>
              <th className="p-3 pr-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-luk-border/60">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-luk-bg/30 transition">
                <td className="p-3 pl-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={s.imageUrl}
                      alt={s.title}
                      className="h-10 w-14 rounded-lg object-cover border border-luk-border shrink-0"
                    />
                    <div className="max-w-xs">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/services/${s.slug}`}
                          target="_blank"
                          className="font-bold text-white hover:text-blue-400 transition truncate"
                        >
                          {s.title}
                        </Link>
                        {s.isFeatured && (
                          <span className="rounded bg-amber-400/10 px-1.5 py-0.2 text-[9px] font-bold text-amber-300 border border-amber-400/20 shrink-0">
                            Nổi bật
                          </span>
                        )}
                        {s.isPopular && (
                          <span className="rounded bg-purple-500/10 px-1.5 py-0.2 text-[9px] font-bold text-purple-300 border border-purple-500/20 shrink-0">
                            Hot
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-luk-dim truncate">{s.shortDescription}</p>
                    </div>
                  </div>
                </td>

                <td className="p-3">
                  <span className="rounded-md bg-luk-bg px-2 py-1 text-[11px] text-luk-muted border border-luk-border">
                    {CATEGORY_MAP[s.category] || s.category}
                  </span>
                </td>

                <td className="p-3 font-semibold text-white">
                  {s.startingPrice > 0 ? formatVND(s.startingPrice) : 'Liên hệ báo giá'}
                </td>

                <td className="p-3 text-luk-muted">{s.turnaround}</td>

                <td className="p-3 text-center">
                  <span className="text-white font-medium">{s._count?.orderItems || 0} đơn</span>
                  <span className="text-luk-dim text-[11px] block">
                    {s._count?.reviews || 0} đánh giá
                  </span>
                </td>

                <td className="p-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(s)}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                      s.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                    }`}
                  >
                    {s.isActive ? 'Đang mở' : 'Tạm dừng'}
                  </button>
                </td>

                <td className="p-3 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(s)}
                      className="p-1.5 rounded-lg border border-luk-border text-luk-muted hover:text-white hover:bg-luk-bg transition"
                      title="Chỉnh sửa dịch vụ"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(s.id)}
                      className="p-1.5 rounded-lg border border-luk-border text-luk-muted hover:text-red-400 hover:border-red-500/30 transition"
                      title="Xóa / Ngừng dịch vụ"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-luk-border bg-luk-card p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span>Xác nhận ngừng hoặc xóa dịch vụ</span>
            </h3>
            <p className="text-xs text-luk-muted leading-relaxed">
              Bạn có chắc chắn muốn xóa dịch vụ này không? Nếu dịch vụ đã từng có đơn hàng được đặt, hệ thống sẽ tự động chuyển sang trạng thái <strong>Tạm dừng</strong> để bảo toàn lịch sử giao dịch.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-luk-border px-4 py-2 text-xs text-luk-muted hover:text-white transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-luk-border bg-luk-card p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-luk-border pb-3">
              <h2 className="text-sm font-bold text-white">
                {editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-luk-muted hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-luk-text block mb-1">
                    Tên dịch vụ <span className="text-luk-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData((p) => ({
                        ...p,
                        title,
                        slug: editingService
                          ? p.slug
                          : title
                              .toLowerCase()
                              .normalize('NFD')
                              .replace(/[\u0300-\u036f]/g, '')
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/^-+|-+$/g, ''),
                      }));
                    }}
                    placeholder="VD: Thiết Kế Slide Luận Văn Tốt Nghiệp"
                    className="w-full rounded-xl border border-luk-border bg-luk-bg p-2.5 text-xs text-luk-text focus:border-luk-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-luk-text block mb-1">
                    Slug đường dẫn <span className="text-luk-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="thiet-ke-slide-luan-van"
                    className="w-full rounded-xl border border-luk-border bg-luk-bg p-2.5 text-xs text-luk-text font-mono focus:border-luk-blue focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-luk-text block mb-1">
                    Danh mục <span className="text-luk-red">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-luk-border bg-luk-bg p-2.5 text-xs text-luk-text focus:border-luk-blue focus:outline-none"
                  >
                    {Object.entries(CATEGORY_MAP).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-luk-text block mb-1">
                    Giá từ (VNĐ, 0 = Báo giá)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
                    className="w-full rounded-xl border border-luk-border bg-luk-bg p-2.5 text-xs text-luk-text focus:border-luk-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-luk-text block mb-1">
                    Thời gian hoàn thiện
                  </label>
                  <input
                    type="text"
                    value={formData.turnaround}
                    onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })}
                    placeholder="VD: 1-2 ngày"
                    className="w-full rounded-xl border border-luk-border bg-luk-bg p-2.5 text-xs text-luk-text focus:border-luk-blue focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-luk-text block mb-1">
                  Định dạng bàn giao
                </label>
                <input
                  type="text"
                  value={formData.deliveryFormat}
                  onChange={(e) => setFormData({ ...formData, deliveryFormat: e.target.value })}
                  placeholder="VD: PPTX, PDF, Google Slides"
                  className="w-full rounded-xl border border-luk-border bg-luk-bg p-2.5 text-xs text-luk-text focus:border-luk-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-luk-text block mb-1">
                  Ảnh bìa (URL)
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-luk-border bg-luk-bg p-2.5 text-xs text-luk-text focus:border-luk-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-luk-text block mb-1">
                  Mô tả ngắn (hiển thị trên thẻ)
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Tóm tắt ngắn gọn dịch vụ trong 1-2 câu"
                  className="w-full rounded-xl border border-luk-border bg-luk-bg p-2.5 text-xs text-luk-text focus:border-luk-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-luk-text block mb-1">
                  Mô tả chi tiết & phạm vi công việc
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Chi tiết các hạng mục thực hiện, cam kết chất lượng, quy trình chỉnh sửa..."
                  className="w-full rounded-xl border border-luk-border bg-luk-bg p-2.5 text-xs text-luk-text focus:border-luk-blue focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-luk-text cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-luk-border bg-luk-bg"
                  />
                  <span>Đang mở kinh doanh</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-luk-text cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-luk-border bg-luk-bg"
                  />
                  <span>Đánh dấu Nổi bật (Featured)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-luk-text cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="rounded border-luk-border bg-luk-bg"
                  />
                  <span>Đánh dấu Phổ biến (Popular)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-luk-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-luk-border px-4 py-2 text-xs text-luk-muted hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-luk-blue px-5 py-2 text-xs font-semibold text-white hover:bg-luk-blueHover active:scale-95 transition"
                >
                  {loading ? 'Đang lưu...' : editingService ? 'Lưu thay đổi' : 'Tạo dịch vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
