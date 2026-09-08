import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ENV } from "@/lib/env";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "NIVORA",
  description: "Better Things, Better Everyday.",
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
