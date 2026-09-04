import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dormitory Management System",
  description: "Manage your dormitory efficiently",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dormitory Management System",
  },
};

export const viewport = {
  themeColor: "#4f46e5",
};

export default async function RootLayout({ 
  children,
  params
}: { 
  children: React.ReactNode,
  params: Promise<{locale: string}>
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-transparent">
        <div className="ambient-bg"></div>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            {children}
            <Toaster position="bottom-right" />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
