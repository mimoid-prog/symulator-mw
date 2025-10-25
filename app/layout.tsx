import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Provider } from '@/components/ui/provider';

const geistSans = Geist({
 variable: '--font-geist-sans',
 subsets: ['latin'],
});

const geistMono = Geist_Mono({
 variable: '--font-geist-mono',
 subsets: ['latin'],
});

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
  <html lang="en">
   <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <Provider>{children}</Provider>
   </body>
  </html>
 );
}
