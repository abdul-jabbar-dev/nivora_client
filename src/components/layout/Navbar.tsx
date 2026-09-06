"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User, Package, Bookmark, LogOut, Menu, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
  showNav: boolean;
  parentId: string | null;
}

export function Navbar({ navCategories = [], allCategories = [] }: { navCategories?: Category[], allCategories?: Category[] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Megamenu state
  const [isMegamenuOpen, setIsMegamenuOpen] = useState(false);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const megamenuTimerRef = useRef<NodeJS.Timeout | null>(null);

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
        Free shipping on orders over ৳5000  
      </div>
      
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <button 
              className="md:hidden p-2 -ml-2 text-foreground/80 hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center text-foreground hover:opacity-90 transition-opacity">
              <svg width="140" height="36" viewBox="0 0 140 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.5" y="1.5" width="132" height="33" stroke="currentColor" strokeWidth="2" />
                <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="currentColor" className="font-sans font-medium" style={{ letterSpacing: '0.25em', fontSize: '18px' }}>
                  NIVORΛ
                </text>
              </svg>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <div 
                className="relative"
                onMouseEnter={() => {
                  if (megamenuTimerRef.current) clearTimeout(megamenuTimerRef.current);
                  setIsMegamenuOpen(true);
                }}
                onMouseLeave={() => {
                  megamenuTimerRef.current = setTimeout(() => setIsMegamenuOpen(false), 200);
                }}
              >
                <Link href="/shop" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group py-4">
                  Shop
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all group-hover:w-full" />
                </Link>
                
                {/* Megamenu Dropdown */}
                <AnimatePresence>
                  {isMegamenuOpen && allCategories.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 bg-background border border-border rounded-xl shadow-xl flex z-50 overflow-hidden min-h-[300px]"
                    >
                      {/* Column 1: Root Categories */}
                      <div className="w-64 border-r border-border bg-muted/20 py-2">
                        {allCategories.filter(c => !c.parentId).map(parent => (
                          <div 
                            key={parent.id}
                            onMouseEnter={() => {
                              setActiveParentId(parent.id);
                              setActiveChildId(null);
                            }}
                            className={cn(
                              "px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors",
                              activeParentId === parent.id ? "bg-muted font-medium text-primary" : "text-foreground hover:bg-muted/50"
                            )}
                          >
                            <Link href={`/shop?category=${parent.slug}`} className="flex-1" onClick={() => setIsMegamenuOpen(false)}>
                              {parent.name}
                            </Link>
                            {allCategories.some(c => c.parentId === parent.id) && (
                              <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Column 2: Subcategories */}
                      {activeParentId && allCategories.some(c => c.parentId === activeParentId) && (
                        <div className="w-64 border-r border-border bg-background py-2">
                          {allCategories.filter(c => c.parentId === activeParentId).map(child => (
                            <div 
                              key={child.id}
                              onMouseEnter={() => setActiveChildId(child.id)}
                              className={cn(
                                "px-4 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors",
                                activeChildId === child.id ? "font-medium text-primary" : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <Link href={`/shop?category=${child.slug}`} className="flex-1" onClick={() => setIsMegamenuOpen(false)}>
                                {child.name}
                              </Link>
                              {allCategories.some(c => c.parentId === child.id) && (
                                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Column 3: Grandchild Categories */}
                      {activeChildId && allCategories.some(c => c.parentId === activeChildId) && (
                        <div className="w-64 bg-background py-2">
                          {allCategories.filter(c => c.parentId === activeChildId).map(grandchild => (
                            <div 
                              key={grandchild.id}
                              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Link href={`/shop?category=${grandchild.slug}`} className="block w-full" onClick={() => setIsMegamenuOpen(false)}>
                                {grandchild.name}
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {navCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group"
                >
                  {cat.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all group-hover:w-full" />
                </Link>
              ))}
              <Link
                href="/request-product"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group"
              >
                Request Product
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all group-hover:w-full" />
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
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
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-56 bg-background border border-border rounded-xl shadow-xl flex flex-col z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 bg-muted/30 border-b border-border">
                          <p className="text-sm font-medium text-foreground">My Account</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <div className="p-2 flex flex-col gap-1">
                          <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                            <User className="w-4 h-4 text-muted-foreground" /> My Profile
                          </Link>
                          <Link href="/orders" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                            <Package className="w-4 h-4 text-muted-foreground" /> My Orders
                          </Link>
                          <Link href="/watchlist" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                            <Bookmark className="w-4 h-4 text-muted-foreground" /> My Watchlist
                          </Link>
                          <Link href="/requests" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                            <FileText className="w-4 h-4 text-muted-foreground" /> My Requests
                          </Link>
                          <button 
                            onClick={() => { openCart(); setIsProfileOpen(false); }} 
                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left w-full"
                          >
                            <ShoppingBag className="w-4 h-4 text-muted-foreground" /> My Cart
                          </button>
                        </div>
                        <div className="h-px bg-border" />
                        <div className="p-2">
                          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors text-left w-full">
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
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
          </div>
          
          <div className="flex items-center md:hidden">
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

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-3/4 max-w-sm bg-background border-r border-border z-[110] flex flex-col md:hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <span className="font-bold tracking-widest">NIVORΛ</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</div>
                <div className="flex flex-col mb-6">
                  {allCategories.filter(c => !c.parentId).map(parent => (
                    <Link 
                      key={parent.id} 
                      href={`/shop?category=${parent.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-sm font-medium border-b border-border/50 hover:bg-muted"
                    >
                      {parent.name}
                    </Link>
                  ))}
                  <Link 
                    href="/shop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium border-b border-border/50 hover:bg-muted text-primary"
                  >
                    View All Products
                  </Link>
                  <Link 
                    href="/request-product"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium border-b border-border/50 hover:bg-muted text-primary"
                  >
                    Request a Product
                  </Link>
                </div>

                <div className="px-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</div>
                <div className="flex flex-col">
                  {user ? (
                    <>
                      <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted">
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <Link href="/watchlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted">
                        <Bookmark className="w-4 h-4" /> My Watchlist
                      </Link>
                      <Link href="/requests" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted">
                        <FileText className="w-4 h-4" /> My Requests
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 text-left w-full border-t border-border mt-2">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </>
                  ) : (
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted">
                      <User className="w-4 h-4" /> Sign In / Register
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
