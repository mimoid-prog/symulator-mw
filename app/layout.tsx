import type { Metadata } from 'next';

import './globals.css';
import { Provider } from '@/components/ui/provider';

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
 return (
  <html lang="pl" suppressHydrationWarning className="chakra-theme">
   <body className={`antialiased`}>
    <Provider>{children}</Provider>
   </body>
  </html>
 );
}
