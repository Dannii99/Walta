import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Walta — Tu dinero, más claro",
  description:
    "Controla tu dinero de forma visual. Simula decisiones financieras importantes.",
 
  appleWebApp: {
    capable: true,
    title: 'Walta',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/ico/walta-ico.png', sizes: '192x192', type: 'image/png' },
      { url: '/ico/walta-ico.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/ico/walta-ico.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/ico/walta-ico.png',
  },
  applicationName: 'Walta',
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0c0a09",
  interactiveWidget: 'resizes-visual',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
