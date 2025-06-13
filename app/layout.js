import { GoogleTagManager } from '@next/third-parties/google';
import "./globals.css";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ErrorProvider } from '@/contexts/ErrorContext';
import { CartProvider } from '@/contexts/CartContext';
import CartManager from '@/components/ui/CartManager';
import { Playfair_Display } from 'next/font/google'
import { MdMail } from 'react-icons/md';
import { RiWhatsappFill } from "react-icons/ri";
 
const playfair = Playfair_Display({
  subsets: ['latin'],
})

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
      <body className={`${playfair.className} overflow-x-hidden w-screen`}>
        <ErrorProvider>
          <CartProvider>
            <div className='sticky top-0 z-50'>
              <Navbar />
            </div>
            <div>
              {children}
            </div>
            <a href="https://wa.me/0502666889" target="_blank" className='fixed bottom-24 right-6 z-50'>
              <RiWhatsappFill className='text-6xl text-green-500' />
            </a>
            <a href="mailto:info@pawsstylist.com" target="_blank" className='fixed bottom-40 right-6 z-50'>
              <MdMail className='text-6xl text-primary' />
            </a>
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
