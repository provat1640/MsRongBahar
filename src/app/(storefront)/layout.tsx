import React from 'react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import QuickContactWidget from '@/components/storefront/QuickContactWidget';
import CartDrawer from '@/components/storefront/CartDrawer';
import { CartProvider } from '@/lib/cart-context';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <QuickContactWidget />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
