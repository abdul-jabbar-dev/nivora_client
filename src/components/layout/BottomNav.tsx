"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, ShoppingBag, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

export function BottomNav() {
  const pathname = usePathname();
  const { openCart, getCartCount } = useCartStore();
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Compass, label: "Shop", href: "/shop" },
    { 
      icon: ShoppingBag, 
      label: "Cart", 
      onClick: openCart,
      badge: isMounted ? getCartCount() : 0 
    },
    { icon: User, label: user ? "Profile" : "Sign In", href: user ? "/profile" : "/login" },
  ];

  if (!isMounted) return null;

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.includes("/invoice")
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item, index) => {
          const isActive = item.href ? pathname === item.href : false;
          const Icon = item.icon;

          const content = (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center justify-center w-full h-full py-1 relative"
            >
              <div
                className={cn(
                  "p-1.5 rounded-full transition-colors relative",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "fill-primary/20")} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge ? (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-2 border-background">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium mt-1",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </motion.div>
          );

          if (item.onClick) {
            return (
              <button key={index} onClick={item.onClick} className="flex-1 flex justify-center items-center h-full">
                {content}
              </button>
            );
          }

          return (
            <Link key={index} href={item.href!} className="flex-1 flex justify-center items-center h-full">
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
