"use client";

import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  User,
  Package,
  Bookmark,
  LogOut,
  Menu,
  X,
  FileText,
  Loader2,
  ArrowRight,
  Folder,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { getProducts } from "@/services/productService";
import type { Product } from "@/types/product";

interface Category {
  id: string;
  name: string;
  slug: string;
  showNav: boolean;
  parentId: string | null;
}

export function Navbar({
  navCategories = [],
  allCategories = [],
  siteSettings = null,
}: {
  navCategories?: Category[];
  allCategories?: Category[];
  siteSettings?: any;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Direct Inline Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const activeSearchQueryRef = useRef<string>("");

  // Megamenu state
  const [isMegamenuOpen, setIsMegamenuOpen] = useState(false);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const megamenuTimerRef = useRef<NodeJS.Timeout | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { openCart, getCartCount } = useCartStore();
  const { user } = useAuthStore();
  const { items: watchlistItems } = useWatchlistStore();

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
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openDesktopSearch = () => {
    setIsDesktopSearchOpen(true);
    setTimeout(() => {
      desktopSearchInputRef.current?.focus();
    }, 50);
  };

  const closeDesktopSearch = () => {
    setIsDesktopSearchOpen(false);
    setIsSearchOpen(false);
  };

  // Click outside to close profile and search dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setIsDesktopSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global search shortcut (Cmd+K / Ctrl+K / '/') to focus search input directly
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openDesktopSearch();
        setIsSearchOpen(true);
      } else if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        openDesktopSearch();
        setIsSearchOpen(true);
      } else if (e.key === "Escape") {
        closeDesktopSearch();
        setIsMobileSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Live debounced search as user types
  useEffect(() => {
    const trimmed = searchQuery.trim();
    activeSearchQueryRef.current = trimmed;

    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(async () => {
      try {
        const data = await getProducts({ q: trimmed, limit: 6 });
        if (activeSearchQueryRef.current === trimmed) {
          setSearchResults(data.products || []);
        }
      } catch (err) {
        console.error("Live search failed:", err);
      } finally {
        if (activeSearchQueryRef.current === trimmed) {
          setIsSearching(false);
        }
      }
    }, 220);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  // Derived matching categories from current query
  const matchingCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allCategories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [searchQuery, allCategories]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setIsSearchOpen(false);
    setIsDesktopSearchOpen(false);
    setIsMobileSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSelectProduct = (slug: string) => {
    setIsSearchOpen(false);
    setIsDesktopSearchOpen(false);
    setIsMobileSearchOpen(false);
    router.push(`/products/${slug}`);
  };

  const handleSelectCategory = (slug: string) => {
    setIsSearchOpen(false);
    setIsDesktopSearchOpen(false);
    setIsMobileSearchOpen(false);
    router.push(`/shop?category=${slug}`);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b transition-all duration-200",
          isScrolled ? "border-border shadow-sm" : "border-border/80"
        )}
      >
      {siteSettings?.freeShippingThreshold > 0 && (
        <div className="bg-primary text-primary-foreground text-xs font-medium py-1.5 text-center">
          Free shipping on orders over ৳{siteSettings.freeShippingThreshold}
        </div>
      )}

      <Container>
        <div className="flex h-16 items-center justify-between gap-3 md:gap-6">
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-4 md:gap-8 shrink-0">
            <button
              className="md:hidden p-2 -ml-2 text-foreground/80 hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link 
              href="/" 
              className="flex items-center text-foreground hover:opacity-90 transition-opacity"
              aria-label="NIVORA Home"
            >
              <svg 
                width="140" 
                height="36" 
                viewBox="0 0 140 36" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="NIVORA Logo"
              >
                <title>NIVORA</title>
                <rect x="1.5" y="1.5" width="132" height="33" stroke="currentColor" strokeWidth="2" />
                <text
                  x="50%"
                  y="54%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill="currentColor"
                  className="font-sans font-medium"
                  style={{ letterSpacing: "0.25em", fontSize: "18px" }}
                >
                  NIVORΛ
                </text>
              </svg>
              <span className="sr-only">NIVORA - Home</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
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
                <Link
                  href="/shop"
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group py-4"
                >
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
                        {allCategories
                          .filter((c) => !c.parentId)
                          .map((parent) => (
                            <div
                              key={parent.id}
                              onMouseEnter={() => {
                                setActiveParentId(parent.id);
                                setActiveChildId(null);
                              }}
                              className={cn(
                                "px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors",
                                activeParentId === parent.id
                                  ? "bg-muted font-medium text-primary"
                                  : "text-foreground hover:bg-muted/50"
                              )}
                            >
                              <Link
                                href={`/shop?category=${parent.slug}`}
                                className="flex-1"
                                onClick={() => setIsMegamenuOpen(false)}
                              >
                                {parent.name}
                              </Link>
                              {allCategories.some((c) => c.parentId === parent.id) && (
                                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                            </div>
                          ))}
                      </div>

                      {/* Column 2: Subcategories */}
                      {activeParentId && allCategories.some((c) => c.parentId === activeParentId) && (
                        <div className="w-64 border-r border-border bg-background py-2">
                          {allCategories
                            .filter((c) => c.parentId === activeParentId)
                            .map((child) => (
                              <div
                                key={child.id}
                                onMouseEnter={() => setActiveChildId(child.id)}
                                className={cn(
                                  "px-4 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors",
                                  activeChildId === child.id
                                    ? "font-medium text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                                )}
                              >
                                <Link
                                  href={`/shop?category=${child.slug}`}
                                  className="flex-1"
                                  onClick={() => setIsMegamenuOpen(false)}
                                >
                                  {child.name}
                                </Link>
                                {allCategories.some((c) => c.parentId === child.id) && (
                                  <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                  </svg>
                                )}
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Column 3: Grandchild Categories */}
                      {activeChildId && allCategories.some((c) => c.parentId === activeChildId) && (
                        <div className="w-64 bg-background py-2">
                          {allCategories
                            .filter((c) => c.parentId === activeChildId)
                            .map((grandchild) => (
                              <div
                                key={grandchild.id}
                                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Link
                                  href={`/shop?category=${grandchild.slug}`}
                                  className="block w-full"
                                  onClick={() => setIsMegamenuOpen(false)}
                                >
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

          {/* Right: Actions (Desktop/Mobile Search, Watchlist, Cart, Profile) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile Search Toggle (<md screens) */}
            <button
              onClick={() => {
                setIsMobileSearchOpen(!isMobileSearchOpen);
                if (!isMobileSearchOpen) {
                  setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
                }
              }}
              className="md:hidden p-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
              title="Search products"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Desktop Search: Compact Icon by default, expands to full input on click */}
            <div className="relative hidden md:block" ref={searchContainerRef}>
              <div
                className={cn(
                  "flex items-center transition-all duration-300 ease-in-out",
                  isDesktopSearchOpen
                    ? "w-72 md:w-80 lg:w-96"
                    : "w-9 h-9 justify-center"
                )}
              >
                {!isDesktopSearchOpen ? (
                  <button
                    type="button"
                    onClick={openDesktopSearch}
                    className="p-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
                    title="Search products (⌘K)"
                    aria-label="Search products"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                ) : (
                  <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center animate-in fade-in duration-200">
                    <Search className="absolute left-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      ref={desktopSearchInputRef}
                      type="text"
                      placeholder="Search products, brands, categories..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchOpen(true);
                      }}
                      onFocus={() => {
                        if (searchQuery.trim().length > 0) {
                          setIsSearchOpen(true);
                        }
                      }}
                      className="w-full h-10 pl-10 pr-16 text-xs sm:text-sm bg-muted/60 hover:bg-muted focus:bg-background border border-border/80 focus:border-primary rounded-full outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground transition-all"
                      autoComplete="off"
                      autoFocus
                    />
                    <div className="absolute right-2 flex items-center gap-0.5">
                      {isSearching && <Loader2 className="w-3.5 h-3.5 text-primary animate-spin mr-1" />}
                      {searchQuery && !isSearching && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery("");
                            setSearchResults([]);
                            setIsSearchOpen(false);
                            desktopSearchInputRef.current?.focus();
                          }}
                          className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                          title="Clear text"
                          aria-label="Clear search query"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span className="sr-only">Clear search query</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={closeDesktopSearch}
                        className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                        title="Close search (Esc)"
                        aria-label="Close search"
                      >
                        <X className="w-4 h-4" />
                        <span className="sr-only">Close search</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Instant Search Results Dropdown (anchored to expanded search) */}
              {isDesktopSearchOpen && isSearchOpen && searchQuery.trim() && (
                <div className="absolute top-full right-0 w-[360px] sm:w-[420px] lg:w-[460px] mt-2 bg-background border border-border rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-border animate-in fade-in zoom-in-95">
                  {/* Matching Categories section */}
                  {matchingCategories.length > 0 && (
                    <div className="p-3 bg-muted/20">
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Folder className="w-3 h-3 text-primary" /> Matching Categories
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {matchingCategories.slice(0, 3).map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleSelectCategory(cat.slug)}
                            className="text-xs px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full font-medium transition-colors flex items-center gap-1"
                          >
                            {cat.name} <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Products */}
                  {searchResults.length > 0 ? (
                    <div className="p-2 max-h-[360px] overflow-y-auto divide-y divide-border/40">
                      {searchResults.map((product) => {
                        const currentPrice = product.offerPrice ?? product.price;
                        return (
                          <div
                            key={product.id}
                            onClick={() => handleSelectProduct(product.slug || product.id)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/70 cursor-pointer transition-colors group"
                          >
                            <div className="w-11 h-11 rounded-lg bg-muted border border-border overflow-hidden relative shrink-0">
                              {product.imageUrl ? (
                                <Image
                                  src={product.imageUrl}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">
                                  No pic
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                {product.name}
                              </h4>
                              <span className="text-[11px] text-muted-foreground truncate block">
                                {typeof product.category === "object"
                                  ? (product.category as any)?.name
                                  : product.category || "General"}
                              </span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs sm:text-sm font-bold text-foreground font-mono">
                                ৳{currentPrice.toFixed(2)}
                              </span>
                              {product.offerPrice && product.offerPrice < product.price && (
                                <span className="block text-[10px] text-muted-foreground line-through font-mono">
                                  ৳{product.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      <div className="pt-2 px-2">
                        <button
                          type="button"
                          onClick={() => handleSearchSubmit()}
                          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          View all results for &quot;{searchQuery.trim()}&quot; in Shop <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    !isSearching && (
                      <div className="p-6 text-center space-y-1.5">
                        <p className="text-xs text-muted-foreground">
                          No products found matching &quot;<span className="font-semibold text-foreground">{searchQuery.trim()}</span>&quot;.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleSearchSubmit()}
                          className="text-xs text-primary font-semibold hover:underline"
                        >
                          Search entire catalog in Shop &rarr;
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Watchlist */}
            <Link
              href="/watchlist"
              className="p-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-full transition-colors relative"
              title="Watchlist"
              aria-label="Watchlist"
            >
              <Bookmark className="w-5 h-5" />
              {isMounted && watchlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                  {watchlistItems.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <button
              onClick={openCart}
              className="p-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-full transition-colors relative"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {isMounted && getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm animate-in zoom-in">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Profile Dropdown (Desktop) */}
            <div className="relative hidden md:block" ref={profileRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="p-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
                    aria-label="Account Menu"
                  >
                    <User className="w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-60 bg-background border border-border rounded-xl shadow-xl flex flex-col z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 bg-muted/30 border-b border-border">
                          <p className="text-sm font-semibold text-foreground">My Account</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <div className="p-1.5 flex flex-col gap-0.5">
                          <Link
                            href="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                          >
                            <User className="w-4 h-4 text-muted-foreground" /> My Profile
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                          >
                            <Package className="w-4 h-4 text-muted-foreground" /> My Orders
                          </Link>
                          <Link
                            href="/watchlist"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Bookmark className="w-4 h-4 text-muted-foreground" /> My Watchlist
                            </div>
                            {isMounted && watchlistItems.length > 0 && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-muted text-muted-foreground rounded-full">
                                {watchlistItems.length}
                              </span>
                            )}
                          </Link>
                          <button
                            onClick={() => {
                              openCart();
                              setIsProfileOpen(false);
                            }}
                            className="flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-left w-full"
                          >
                            <div className="flex items-center gap-3">
                              <ShoppingBag className="w-4 h-4 text-muted-foreground" /> My Cart
                            </div>
                            {isMounted && getCartCount() > 0 && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
                                {getCartCount()}
                              </span>
                            )}
                          </button>
                          <Link
                            href="/requests"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                          >
                            <FileText className="w-4 h-4 text-muted-foreground" /> My Requests
                          </Link>
                        </div>
                        <div className="h-px bg-border" />
                        <div className="p-1.5">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-destructive rounded-lg hover:bg-destructive/10 transition-colors text-left w-full"
                          >
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link href="/login">
                  <button
                    className="p-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
                    aria-label="Sign In"
                  >
                    <User className="w-5 h-5" />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile Search Bar Expand */}
      {isMobileSearchOpen && (
        <div className="md:hidden border-t border-border bg-background p-3 animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-8 text-base sm:text-sm bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 p-1 text-muted-foreground"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="sr-only">Clear search</span>
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground font-medium px-2 py-2"
            >
              Cancel
            </button>
          </form>

          {/* Mobile Live Results */}
          {searchQuery.trim() && searchResults.length > 0 && (
            <div className="mt-2 bg-background border border-border rounded-xl shadow-lg max-h-[300px] overflow-y-auto divide-y divide-border">
              {searchResults.map((product) => {
                const currentPrice = product.offerPrice ?? product.price;
                return (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.slug || product.id)}
                    className="flex items-center gap-3 p-2.5 hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-md bg-muted overflow-hidden relative shrink-0">
                      {product.imageUrl && (
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{product.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">৳{currentPrice.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => handleSearchSubmit()}
                className="w-full py-2.5 text-xs text-primary font-medium text-center hover:bg-muted"
              >
                View all results &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </header>

    {/* Mobile Menu Drawer */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 h-full h-dvh w-3/4 max-w-sm bg-background border-r border-border z-[110] flex flex-col md:hidden shadow-2xl"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="font-bold tracking-wider uppercase text-xs text-muted-foreground">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 text-foreground/80 hover:text-foreground"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
                <span className="sr-only">Close navigation menu</span>
              </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-3">
                  <Link
                    href="/shop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 text-base font-semibold hover:text-primary"
                  >
                    All Products
                  </Link>
                </div>

                <div className="border-t border-border px-4 py-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                    Categories
                  </span>
                  <div className="flex flex-col gap-1">
                    {allCategories
                      .filter((c) => !c.parentId)
                      .map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop?category=${cat.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-2 text-sm text-foreground/80 hover:text-foreground"
                        >
                          {cat.name}
                        </Link>
                      ))}
                  </div>
                </div>

                <div className="border-t border-border px-4 py-2 mt-2">
                  <Link
                    href="/request-product"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm text-foreground/80 hover:text-foreground"
                  >
                    Request a Product
                  </Link>
                </div>

                <div className="border-t border-border mt-4">
                  {user ? (
                    <>
                      <div className="px-4 py-3 bg-muted/40">
                        <p className="text-xs text-muted-foreground">Signed in as</p>
                        <p className="text-sm font-semibold truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted"
                      >
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <Link
                        href="/watchlist"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted"
                      >
                        <div className="flex items-center gap-3">
                          <Bookmark className="w-4 h-4" /> My Watchlist
                        </div>
                        {isMounted && watchlistItems.length > 0 && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-muted text-muted-foreground rounded-full">
                            {watchlistItems.length}
                          </span>
                        )}
                      </Link>
                      <button
                        onClick={() => {
                          openCart();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted text-left w-full"
                      >
                        <div className="flex items-center gap-3">
                          <ShoppingBag className="w-4 h-4" /> My Cart
                        </div>
                        {isMounted && getCartCount() > 0 && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full">
                            {getCartCount()}
                          </span>
                        )}
                      </button>
                      <Link
                        href="/requests"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted"
                      >
                        <FileText className="w-4 h-4" /> My Requests
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 text-left w-full"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/watchlist"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted"
                      >
                        <div className="flex items-center gap-3">
                          <Bookmark className="w-4 h-4" /> My Watchlist
                        </div>
                        {isMounted && watchlistItems.length > 0 && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-muted text-muted-foreground rounded-full">
                            {watchlistItems.length}
                          </span>
                        )}
                      </Link>
                      <button
                        onClick={() => {
                          openCart();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted text-left w-full"
                      >
                        <div className="flex items-center gap-3">
                          <ShoppingBag className="w-4 h-4" /> My Cart
                        </div>
                        {isMounted && getCartCount() > 0 && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full">
                            {getCartCount()}
                          </span>
                        )}
                      </button>
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted border-t border-border mt-2"
                      >
                        <User className="w-4 h-4" /> Sign In / Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
