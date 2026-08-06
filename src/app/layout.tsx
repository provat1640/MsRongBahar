import React from 'react';
import '@/app/globals.css';

export const metadata = {
  title: 'M/S Rong Bahar - Hardware & Paint Store BD',
  description: 'Bangladeshi local hardware and paint retailer. Shop Berger paints, enamel, red oxide, varnishes, Fevicol PUR, locks & contractor tools.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
