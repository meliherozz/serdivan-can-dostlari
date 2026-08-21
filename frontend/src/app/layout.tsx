import type { Metadata } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import './globals.css';

export const metadata: Metadata = {
  title: 'Serdivan Belediyesi Can Dostları',
  description: 'Dijital Hayvan Sahiplendirme Platformu',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
