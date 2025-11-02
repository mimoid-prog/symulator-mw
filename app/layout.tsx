import type { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';

import './globals.css';
import { Provider } from '@/components/ui/provider';
import { GaProvider } from './ga-provider';

export const metadata: Metadata = {
 title: 'Symulator MW = Mistrzostwo walk',
 description:
  'Symulator mistrzostwa walk do gry Margonem. Rozdaj umiejętności i wygeneruj symulację mistrzostwa walk (MW).',
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
 return (
  <html lang="pl" suppressHydrationWarning className="chakra-theme">
   <body>
    <Script
     src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
     strategy="afterInteractive"
    />
    <Script id="gtag-init" strategy="afterInteractive">
     {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);} 
      gtag('js', new Date());
      gtag('config', '${GA_ID}', { send_page_view: false });
     `}
    </Script>
    <Provider>
     <Suspense fallback={null}>
      <GaProvider />
     </Suspense>
     {children}
    </Provider>
   </body>
  </html>
 );
}
