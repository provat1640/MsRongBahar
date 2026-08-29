import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BackendWakeup } from '../components/BackendWakeup';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
  ],
};

export const metadata: Metadata = {
  title: 'M/S Rong Bahar | Paint, Hardware & Sanitary Superstore in Pakundia',
  description:
    'Authorized dealer of Berger Robbialac, Aqua Paints, Fevicol 1K PUR adhesives, JM lacquer sprays, and HMBR security padlocks in Pakundia, Kishoreganj. Fast local delivery and authentic stock.',
  keywords: [
    'M/S Rong Bahar',
    'Berger Paints Pakundia',
    'Robbialac Synthetic Enamel',
    'Fevicol 1K PUR',
    'Hardware Store Kishoreganj',
    'Paint Store Pakundia',
    'Aqua Paints CNG Green',
    'Padlocks',
    'Paint Calculator',
  ],
  authors: [{ name: 'M/S Rong Bahar' }],
  creator: 'M/S Rong Bahar',
  metadataBase: new URL('https://msrongbahar.com'),
  openGraph: {
    title: 'M/S Rong Bahar | Paint & Hardware Superstore',
    description:
      'Order genuine Berger paints, adhesives, spray cans, and industrial hardware with fast 2-hour Pakundia express delivery.',
    url: 'https://msrongbahar.com',
    siteName: 'M/S Rong Bahar',
    images: [
      {
        url: '/logo.jpg',
        width: 800,
        height: 600,
        alt: 'M/S Rong Bahar Storefront Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M/S Rong Bahar | Paint & Hardware Superstore',
    description: 'Authorized Berger & Aqua paint store with fast local delivery in Pakundia.',
    images: ['/logo.jpg'],
  },
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

const jsonLdOrg = {
  '@context': 'https://schema.org',
  '@type': 'HardwareStore',
  name: 'M/S Rong Bahar',
  image: 'https://msrongbahar.com/logo.jpg',
  telephone: '+8801722452836',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Mothkhola Road, Pakundia Bazar',
    addressLocality: 'Pakundia',
    addressRegion: 'Kishoreganj',
    postalCode: '2326',
    addressCountry: 'BD',
  },
  priceRange: '৳৳',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '07:30',
      closes: '22:00',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#030712] text-slate-100 flex flex-col justify-between antialiased selection:bg-amber-500 selection:text-slate-950">
        <AuthProvider>
          <CartProvider>
            <BackendWakeup />
            <Navbar />
            <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
