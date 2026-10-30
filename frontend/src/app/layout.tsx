import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/components/providers/AppProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CurtainPageTransition } from '@/components/common/CurtainPageTransition';
import { CategoryRailDrawer } from '@/components/common/CategoryRailDrawer';
import { StickmanDirectorBadge } from '@/components/common/StickmanDirectorBadge';

export const metadata: Metadata = {
  title: 'LUK Services — Marketplace Dịch Vụ Sinh Viên LUK Global',
  description:
    'Thương mại điện tử sinh viên LUK Services: Tài khoản AI Pro (CapCut, ChatGPT, Gemini, Canva), Edit Chuẩn LUK, Transcript Chuẩn LUK, Slide Chuẩn LUK.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="light" data-theme="light">
      <body className="bg-luk-bg text-luk-text min-h-screen flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
        <AppProvider>
          <CurtainPageTransition />
          <Navbar />
          <CategoryRailDrawer />
          <main className="flex-1 w-full pt-20 sm:pt-24">{children}</main>
          <Footer />
          <CartDrawer />
          <StickmanDirectorBadge />
        </AppProvider>
      </body>
    </html>
  );
}
