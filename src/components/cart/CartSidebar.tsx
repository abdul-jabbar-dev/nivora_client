"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getCartTotal } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  // Avoid hydration mismatch for persisted store
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close cart on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeCart]);

  if (!isMounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full h-dvh w-full sm:w-[400px] bg-background border-l border-border z-[110] flex flex-col shadow-2xl transition-transform duration-500 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border pt-safe">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart
          </h2>
          <button 
            onClick={closeCart}
            aria-label="Close cart"
            className="p-2 -mr-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close cart</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <p className="text-lg font-medium mb-2">Your cart is empty</p>
                <p className="text-muted-foreground">Looks like you haven't added anything yet.</p>
              </div>
              <Button onClick={closeCart} className="w-full">Continue Shopping</Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative w-24 h-24 rounded-lg bg-muted overflow-hidden shrink-0">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <Link 
                        href={`/products/${item.product.slug || item.product.id}`}
                        onClick={closeCart}
                        className="font-medium hover:underline line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      {item.variant && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {item.variant.type === 'color' ? 'Color: ' : 'Size: '}
                          {item.variant.options?.[0]?.name || item.variant.type}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.product.name} from cart`}
                      className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Remove item</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-border rounded-md h-8 w-24">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="flex-1 h-full flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                      >
                        <Minus className="w-3 h-3" />
                        <span className="sr-only">Decrease quantity</span>
                      </button>
                      <span className="flex-1 h-full flex items-center justify-center text-sm font-medium border-x border-border">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, Math.min((item.variant ? (item.variant as any).inventory || (item.variant as any).stock || 0 : item.product.stock || 0), item.quantity + 1))}
                        disabled={item.quantity >= (item.variant ? (item.variant as any).inventory || (item.variant as any).stock || 0 : item.product.stock || 0)}
                        aria-label="Increase quantity"
                        className="flex-1 h-full flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                      >
                        <Plus className="w-3 h-3" />
                        <span className="sr-only">Increase quantity</span>
                      </button>
                    </div>
                    <p className="font-semibold">৳{((item.product.offerPrice ?? item.product.price) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-border bg-muted/20 pb-safe">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="text-xl font-bold">৳{getCartTotal().toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Shipping calculated at checkout.
            </p>
            <Link href="/checkout" onClick={closeCart} className="w-full">
              <Button size="lg" className="w-full text-base h-14">
                Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
