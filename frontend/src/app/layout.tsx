import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/components/providers/AppProvider';
import { CinematicNavbar } from '@/components/cinematic/CinematicNavbar';
import { CinematicFooter } from '@/components/cinematic/CinematicFooter';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CurtainPageTransition } from '@/components/common/CurtainPageTransition';
import { CategoryRailDrawer } from '@/components/common/CategoryRailDrawer';

export const metadata: Metadata = {
  title: 'LUK Services — Cinematic Space-Travel & Student Services Platform',
  description:
    'Venture Past Our Sky Across the Universe. Hệ sinh thái dịch vụ sinh viên cao cấp: Edit Video, Slide Đồ Án, Transcript & Tài Khoản AI Pro.',
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
      <body className="bg-black text-white min-h-screen flex flex-col font-body antialiased selection:bg-white selection:text-black overflow-x-hidden">
        <AppProvider>
          <CurtainPageTransition />
          <CinematicNavbar />
          <CategoryRailDrawer />
          <main className="flex-1 w-full">{children}</main>
          <CinematicFooter />
          <CartDrawer />
        </AppProvider>
      </body>
    </html>
  );
}
