import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#030712',
};

export const metadata: Metadata = {
  title: 'M/S Rong Bahar | Website & Services Closed',
  description: 'M/S Rong Bahar online storefront and associated services have been decommissioned.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen w-full bg-[#030712] text-slate-100 flex flex-col justify-center items-center antialiased">
        <AuthProvider>
          <CartProvider>
            <main className="w-full max-w-full">{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
