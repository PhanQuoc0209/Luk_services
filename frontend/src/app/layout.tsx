import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/components/providers/AppProvider';
import { CinematicNavbar } from '@/components/cinematic/CinematicNavbar';
import { CinematicFooter } from '@/components/cinematic/CinematicFooter';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { AntiInspectGuard } from '@/components/security/AntiInspectGuard';

export const metadata: Metadata = {
  title: 'LUK Global — Hệ Sinh Thái Dịch Vụ Học Thuật & Sáng Tạo Sinh Viên',
  description:
    'Nền tảng thương mại điện tử dịch vụ học thuật và sáng tạo cao cấp: Edit Video, Slide Đồ Án, Transcript 99.5% & Tài Khoản AI Pro chính chủ.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-body antialiased overflow-x-hidden transition-colors duration-500">
        <AppProvider>
          <AntiInspectGuard />
          <CinematicNavbar />
          <main className="flex-1 w-full">{children}</main>
          <CinematicFooter />
          <CartDrawer />
        </AppProvider>
      </body>
    </html>
  );
}
