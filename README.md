# LUK Services — Monorepo Architecture (Frontend & Backend)

> Nền tảng thương mại điện tử dịch vụ sinh viên trong hệ sinh thái LUK Global. Dự án được cấu trúc chuẩn hóa thành **Monorepo** gồm 2 workspace độc lập:
> - **`frontend/`**: Next.js 15 (App Router, TypeScript Strict, Tailwind CSS, Vercel ready).
> - **`backend/`**: Node.js, Express REST API, Prisma ORM (SQLite / PostgreSQL), Test Suite & Seed Scripts.

---

## 1. Cấu Trúc Monorepo

```text
luk-services/
├── frontend/                     # Next.js 15 Frontend Workspace (Độc lập cho Vercel)
│   ├── src/
│   │   ├── app/                  # Next.js App Router (22 routes SSR/SSG/ISR)
│   │   │   ├── (auth)/           # Đăng nhập, đăng ký, bảo mật session
│   │   │   ├── admin/            # Quản trị viên (Orders, Services, Settings)
│   │   │   ├── debate/           # Kho tài liệu Debate BP & NCKH mở rộng
│   │   │   ├── orders/           # Theo dõi đơn hàng & không gian làm việc bản thảo
│   │   │   ├── services/         # Danh mục dịch vụ, chi tiết, bộ lọc, carousel
│   │   │   └── api/              # Route handlers nội bộ & proxy
│   │   ├── components/           # UI Components (Day/Night switch, Carousels, Banners, Transitions)
│   │   └── lib/                  # Helpers, validation, auth utils, VietQR
│   ├── public/                   # Static assets, logos, screenshots
│   ├── prisma/                   # Prisma client schema cho Next.js server-side
│   ├── uploads/                  # Uploads local buffer (được bảo vệ)
│   ├── vercel.json               # Cấu hình độc lập Vercel Root Directory
│   ├── .env.example              # Mẫu biến môi trường frontend (0 secret)
│   ├── package.json              # Script: dev, build (prisma generate && next build)
│   └── tsconfig.json             # TypeScript compiler config
│
├── backend/                      # Node.js + Express + Prisma Workspace (Độc lập cho Server/VPS)
│   ├── src/
│   │   ├── server.mjs            # Express REST API Server (CORS, Health, Catalog, Orders, Debate)
│   │   └── lib/                  # Backend libraries (Audit, Auth, Cart, Prisma, Storage, VietQR)
│   ├── prisma/
│   │   ├── schema.prisma         # Prisma Schema chính (SQLite / PostgreSQL)
│   │   └── dev.db                # Database phát triển cá nhân (được bảo toàn, gitignored)
│   ├── scripts/
│   │   └── seed.mjs              # Script khởi tạo 30 services, 8 users, 20 sample orders
│   ├── tests/                    # Bộ kiểm thử tự động 25 tests (node:test)
│   │   ├── api-server.test.mjs   # Express API, CORS headers, Health check, Catalog
│   │   ├── cart.test.mjs         # Giỏ hàng & tính toán tạm tính
│   │   ├── draft-feedback.test.mjs # Luồng bản nháp & góp ý chỉnh sửa
│   │   ├── quote-payment.test.mjs  # Luồng báo giá & xác nhận VietQR thủ công
│   │   ├── reviews-debate.test.mjs # Nghiệp vụ đánh giá & kho debate
│   │   ├── security-auth.test.mjs  # Bảo mật session, JWT, mật khẩu hash
│   │   └── storage-upload.test.mjs # Upload an toàn, MIME validation
│   ├── uploads/                  # Private uploads directory (được bảo tồn)
│   ├── .env.example              # Mẫu biến môi trường backend (0 secret)
│   └── package.json              # Express, CORS, Prisma, scripts test & start
│
├── .gitignore                    # Loại bỏ node_modules, .next, *.db, .env, build cache
├── .env.example                  # Mẫu biến môi trường Monorepo tổng quan
├── package.json                  # Monorepo root workspace orchestration
├── tsconfig.json                 # TypeScript project reference root
└── README.md                     # Tài liệu hướng dẫn kiến trúc & vận hành
```

---

## 2. Hướng Dẫn Chạy Môi Trường Phát Triển (Local Development)

### Yêu cầu môi trường
- Node.js >= 18.x (khuyến nghị Node.js 20 LTS hoặc 22+)
- npm >= 9.x

### Các bước khởi động từ thư mục gốc (Root)

```bash
# 1. Cài đặt toàn bộ dependencies cho cả frontend & backend
npm install

# 2. Tạo biến môi trường từ mẫu
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# 3. Đồng bộ cơ sở dữ liệu & sinh Prisma Client
npm run db:push

# 4. Nạp dữ liệu mẫu ban đầu (30 Dịch vụ, 8 Tài khoản, 20 Đơn hàng mẫu, 12 Debate Resources)
npm run db:seed

# 5. Chạy kiểm thử tự động toàn diện (25/25 passing)
npm test

# 6. Khởi chạy song song cả Frontend & Backend
# Terminal 1: Chạy Frontend Next.js (Port 3000)
npm run dev:frontend

# Terminal 2: Chạy Backend Express API (Port 5000)
npm run dev:backend
```

- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
  - Health check: `http://localhost:5000/api/health`
  - Services catalog: `http://localhost:5000/api/services`
  - Categories: `http://localhost:5000/api/categories`
  - Debate resources: `http://localhost:5000/api/debate`

---

## 3. Các Lệnh Npm Scripts Hữu Ích

| Lệnh | Vị trí | Tác dụng |
| :--- | :--- | :--- |
| `npm run dev:frontend` | Root | Khởi chạy Next.js dev server tại cổng 3000 |
| `npm run dev:backend` | Root | Khởi chạy Express server tại cổng 5000 với nodemon/node |
| `npm run build` | Root | Build production Next.js frontend (sinh Prisma client và bundle 22 routes) |
| `npm test` | Root | Chạy toàn bộ 25 bài kiểm thử unit & integration qua `node:test` |
| `npm run typecheck` | Root | Kiểm tra toàn bộ mã nguồn TypeScript strict (0 lỗi) |
| `npm run db:push` | Root | Đẩy Prisma schema cập nhật vào database |
| `npm run db:seed` | Root | Khởi tạo lại toàn bộ dữ liệu mẫu |

---

## 4. Hướng Dẫn Triển Khai Độc Lập (Deployment)

### A. Triển Khai Frontend Trên Vercel
Thư mục `frontend/` đã được chuẩn bị đầy đủ file `vercel.json` và cấu hình build độc lập:
1. Đăng nhập Vercel Dashboard, chọn **Add New Project** và liên kết kho GitHub `luk-services`.
2. Trong phần **Project Settings**:
   - **Root Directory**: Chọn thư mục `frontend`.
   - **Framework Preset**: Chọn `Next.js`.
   - **Build Command**: Để mặc định hoặc nhập `prisma generate && next build`.
   - **Output Directory**: `.next` (mặc định của Next.js).
3. Cài đặt các **Environment Variables** (theo file `frontend/.env.example`):
   - `DATABASE_URL`: Đường dẫn PostgreSQL (Vercel Postgres, Supabase, Neon) hoặc Prisma Accelerate URL.
   - `JWT_SECRET`: Chuỗi khóa ngẫu nhiên an toàn.
   - `COOKIE_SECRET`: Chuỗi khóa cookie an toàn.
   - `NEXT_PUBLIC_APP_URL`: Domain Vercel của bạn (ví dụ: `https://luk-services.vercel.app`).
   - `NEXT_PUBLIC_API_URL`: Domain của Backend Express nếu gọi API tách biệt.
4. Bấm **Deploy**. Vercel sẽ tự động build và phục vụ ứng dụng với hiệu năng cao.

### B. Triển Khai Backend Express (Railway, Render, VPS hoặc Docker)
Thư mục `backend/` có thể được triển khai độc lập lên bất kỳ nền tảng Node.js nào:
1. Đặt **Root Directory** là `backend` (hoặc vào thư mục `backend/`).
2. **Build Command**: `npm install && npx prisma generate`.
3. **Start Command**: `node src/server.mjs`.
4. Cài đặt các **Environment Variables** (theo file `backend/.env.example`):
   - `PORT`: 5000 (hoặc do nền tảng tự cấp phát, ví dụ Render/Railway dùng `$PORT`).
   - `DATABASE_URL`: Chuỗi kết nối PostgreSQL/MySQL.
   - `CORS_ORIGIN`: Domain của Frontend (ví dụ `https://luk-services.vercel.app` hoặc `http://localhost:3000`).
   - `JWT_SECRET`: Khóa giải mã JWT đồng bộ với Frontend.

---

## 5. Tài Khoản Đăng Nhập Mẫu

| Vai trò | Email | Mật khẩu | Chức năng |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@lukglobal.vn` | `AdminLuk@2026!` | Báo giá, quản lý đơn, đối soát VietQR, upload bản nháp, CRUD dịch vụ, cấu hình ngân hàng |
| **Khách hàng 1 (Long)** | `student@lukglobal.vn` | `Student@2026!` | Đặt dịch vụ, theo dõi đơn, quét VietQR, xem nháp, gửi phản hồi, đánh giá |
| **Khách hàng 2 (Trang)** | `student.trang@lukglobal.vn` | `Student@2026!` | Đơn tranh biện, nộp tiền cọc, xem nháp, đánh giá hoàn thành |
| **Khách hàng 3 (Bảo)** | `student.bao@lukglobal.vn` | `Student@2026!` | Đơn hiệu đính APA/IEEE, nhận bản final, đánh giá 5 sao |
| *(và 5 tài khoản khác)* | `student.[tên]@lukglobal.vn` | `Student@2026!` | Trải nghiệm đa dạng tình huống đơn hàng |

*(Trang `/login` có sẵn các nút bấm đăng nhập nhanh 1-click cho cả Admin và Student).*

---

## 6. Kết Quả Xác Minh & Kiểm Thử Tự Động (25/25 Tests Passing)

Toàn bộ quy trình kiểm thử đã được chạy thực tế:
- **Build Frontend**: `npm run build` hoàn thành với mã thoát 0, khởi tạo thành công 22 static/SSR routes.
- **TypeScript**: `npm run typecheck` hoàn thành với mã thoát 0 (0 error).
- **Express Backend API**: Đã kiểm tra live endpoint `GET /api/health`, `GET /api/services`, `GET /api/categories` và cấu hình CORS response header `Access-Control-Allow-Origin`.
- **Test Suite (`node:test`)**: 25/25 tests passing 100%:
  - `api-server.test.mjs`: 5 tests
  - `cart.test.mjs`: 3 tests
  - `draft-feedback.test.mjs`: 4 tests
  - `quote-payment.test.mjs`: 4 tests
  - `reviews-debate.test.mjs`: 3 tests
  - `security-auth.test.mjs`: 3 tests
  - `storage-upload.test.mjs`: 3 tests
