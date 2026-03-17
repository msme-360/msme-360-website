import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ConditionalNavigation } from "@/components/layout/ConditionalNavigation";

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
  title: "MSME 360 | India's #1 Founder-First Enablement Platform",
  description: "The official enablement platform for Indian MSMEs. Guided formalization, operations toolkit, and AI microservices.",
  keywords: ["MSME", "India", "Business Setup", "Udyam Registration", "Startup India", "AI for Business"],
  authors: [{ name: "MSME 360 Team" }],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <ConditionalNavigation>
          {children}
        </ConditionalNavigation>
      </body>
    </html>
  );
}
