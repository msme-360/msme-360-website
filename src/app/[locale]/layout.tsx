import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ConditionalNavigation } from "@/components/layout/ConditionalNavigation";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { TooltipProvider } from "@/components/ui/tooltip";
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/settings';
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "MSME 360 | India's #1 Founder-First Enablement Platform",
    template: "%s | MSME 360"
  },
  description: "The official enablement platform for Indian MSMEs. Guided formalization, operations toolkit, and AI microservices.",
  keywords: ["MSME", "India", "Business Setup", "Udyam Registration", "Startup India", "AI for Business"],
  authors: [{ name: "MSME 360 Team" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MSME 360',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "MSME 360 | Formalize, Operate, Scale",
    description: "Empowering 100,000+ Indian MSMEs to formalize and scale with AI.",
    url: "https://msme360.in",
    siteName: "MSME 360",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MSME 360",
    description: "The zero-fee, founder-first enablement platform for Indian MSMEs.",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming locale is valid
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  // Set the request locale for static generation
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased overflow-x-hidden`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TooltipProvider>
            <AuthProvider>
              <QueryProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                  storageKey="msme360-theme"
                >
                  <Suspense fallback={null}>
                    <ConditionalNavigation>
                      {children}
                    </ConditionalNavigation>
                  </Suspense>
                  <Toaster position="top-left" richColors closeButton />
                  <Analytics />
                  <SpeedInsights />
                </ThemeProvider>
              </QueryProvider>
            </AuthProvider>
          </TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
