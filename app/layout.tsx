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
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  width: 'device-width',
  initialScale: 1,
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
