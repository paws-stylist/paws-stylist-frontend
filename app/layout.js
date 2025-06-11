import { GoogleTagManager } from '@next/third-parties/google';
import "./globals.css";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ErrorProvider } from '@/contexts/ErrorContext';
import { CartProvider } from '@/contexts/CartContext';
import CartManager from '@/components/ui/CartManager';

export const metadata = {
  title: " PAWS STYLIST DOMESTIC PETS GROOMING L.L.C",
  description: "PAWS STYLIST DOMESTIC PETS GROOMING L.L.C",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={`font-step overflow-x-hidden w-screen`}>
        <ErrorProvider>
          <CartProvider>
            <div className='sticky top-0 z-50'>
              <Navbar />
            </div>
            <div>
              {children}
            </div>
            <div>
              <Footer />
            </div>
            {/* Cart functionality components */}
            <CartManager />
          </CartProvider>
        </ErrorProvider>
      </body>
      <GoogleTagManager gtmId="GTM-" />
    </html>
  );
}
