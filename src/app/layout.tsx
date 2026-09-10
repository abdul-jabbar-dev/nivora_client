import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ENV } from "@/lib/env";

import { getSiteUrl } from "@/lib/siteUrl";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Online Shopping in Bangladesh | Electronics, Gadgets & More | NIVORA",
    template: "%s | NIVORA",
  },
  description:
    "Shop electronics, gadgets, accessories and unique products online in Bangladesh. Enjoy affordable prices, fast nationwide delivery and trusted service from NIVORA.",
  keywords: [
    "online shopping in Bangladesh",
    "online shop Bangladesh",
    "online store Bangladesh",
    "online shopping BD",
    "buy products online Bangladesh",
    "electronics online Bangladesh",
    "gadgets online Bangladesh",
    "accessories online Bangladesh",
    "affordable products Bangladesh",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "NIVORA",
    title: "Online Shopping in Bangladesh | Electronics, Gadgets & More | NIVORA",
    description:
      "Shop electronics, gadgets, accessories and unique products online in Bangladesh. Enjoy affordable prices, fast nationwide delivery and trusted service from NIVORA.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Shopping in Bangladesh | Electronics, Gadgets & More | NIVORA",
    description:
      "Shop electronics, gadgets, accessories and unique products online in Bangladesh. Enjoy affordable prices, fast nationwide delivery and trusted service from NIVORA.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let navCategories = [];
  let allCategories = [];
  let siteSettings = null;

  try {
    const res = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/products/categories`, {
      next: { revalidate: 60 } // cache for 60s
    });
    if (res.ok) {
      allCategories = await res.json();
      navCategories = allCategories.filter((c: any) => c.showNav);
    }
  } catch (e) {
    console.error("Failed to fetch categories for nav", e);
  }

  try {
    const res = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/site-settings`, {
      next: { revalidate: 60 } // cache for 60s
    });
    if (res.ok) {
      siteSettings = await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch site settings", e);
  }

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar navCategories={navCategories} allCategories={allCategories} siteSettings={siteSettings} />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer siteSettings={siteSettings} />
          </div>
          <BottomNav />
          <CartSidebar />
        </Providers>
      </body>
    </html>
  );
}
