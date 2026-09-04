"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { name: "Shop", href: "/shop" },
  { name: "Electronics", href: "/shop?category=electronics" },
  { name: "Fashion", href: "/shop?category=fashion" },
  { name: "Home & Living", href: "/shop?category=home-living" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const { openCart, getCartCount } = useCartStore();
  const { user } = useAuthStore();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsProfileOpen(false);
    router.push("/");
  };

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="bg-primary text-primary-foreground text-xs font-medium py-1.5 text-center">
        Free shipping on orders over ৳5000 • Easy 30-day returns
      </div>
      
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center text-foreground hover:opacity-90 transition-opacity">
              <svg width="140" height="36" viewBox="0 0 140 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.5" y="1.5" width="132" height="33" stroke="currentColor" strokeWidth="2" />
                <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="currentColor" className="font-sans font-medium" style={{ letterSpacing: '0.25em', fontSize: '18px' }}>
                  NIVORΛ
                </text>
              </svg>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-foreground/80 hover:text-foreground transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <div className="relative" ref={profileRef}>
              {user ? (
                <>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="p-2 text-foreground/80 hover:text-foreground transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-lg py-2 flex flex-col z-50 overflow-hidden"
                      >
                        <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 text-sm hover:bg-muted transition-colors">My Profile</Link>
                        <Link href="/orders" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 text-sm hover:bg-muted transition-colors">My Orders</Link>
                        <Link href="/watchlist" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 text-sm hover:bg-muted transition-colors">My Watchlist</Link>
                        <button 
                          onClick={() => { openCart(); setIsProfileOpen(false); }} 
                          className="px-4 py-2 text-sm hover:bg-muted transition-colors text-left"
                        >
                          My Cart
                        </button>
                        <div className="h-px bg-border my-1" />
                        <button onClick={handleLogout} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left">Logout</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link href="/login" className="p-2 flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline">Sign In</span>
                </Link>
              )}
            </div>
            <button 
              onClick={openCart}
              className="p-2 text-foreground/80 hover:text-foreground transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {isMounted && getCartCount() > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}
