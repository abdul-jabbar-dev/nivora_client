"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ChevronRight, ShieldCheck, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Skeleton } from "@/components/ui/Skeleton";
import { ENV } from "@/lib/env";

const api = {
  get: async (url: string) => fetch(`${ENV.NEXT_PUBLIC_API_URL}${url}`, { headers: { Authorization: `Bearer ${(useAuthStore.getState().session as any)?.access_token}` } }).then(async r => { if (!r.ok) throw await r.json(); return r.json().then(data => ({ data })); }),
  post: async (url: string, data: any) => fetch(`${ENV.NEXT_PUBLIC_API_URL}${url}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${(useAuthStore.getState().session as any)?.access_token}` }, body: JSON.stringify(data) }).then(async r => { if (!r.ok) throw await r.json(); return r.json().then(data => ({ data })); }),
  patch: async (url: string, data: any) => fetch(`${ENV.NEXT_PUBLIC_API_URL}${url}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${(useAuthStore.getState().session as any)?.access_token}` }, body: JSON.stringify(data) }).then(async r => { if (!r.ok) throw await r.json(); return r.json().then(data => ({ data })); })
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user, session } = useAuthStore();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    landmark: '',
    phoneNumber: '',
    bkashNumber: '',
    trxId: ''
  });
  const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'cod'>('cod');
  const [shippingMethod, setShippingMethod] = useState<'sameday' | 'nationwide'>('sameday');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/site-settings`);
        if (response.ok) {
          setSiteSettings(await response.json());
        }
      } catch (err) {
        console.error('Failed to fetch site settings', err);
      }
    };
    fetchSiteSettings();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) {
        setIsLoadingProfile(false);
        return;
      }
      
      try {
        const response = await api.get('/users/profile');
        const profile = response.data;
        if (profile) {
          setFormData(prev => ({
            ...prev,
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            address: profile.address || '',
            city: profile.city || '',
            zip: profile.zip || '',
            landmark: profile.landmark || '',
            phoneNumber: profile.phoneNumber || ''
          }));
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    if (isMounted) {
      fetchProfile();
    }
  }, [session, isMounted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const subtotal = getCartTotal();
  let shipping = shippingMethod === 'sameday' ? 70 : 120;
  if (siteSettings?.freeShippingThreshold > 0 && subtotal >= siteSettings.freeShippingThreshold) {
    shipping = 0;
  }
  const total = subtotal + shipping;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      // If no user logged in, redirect to login
      router.push('/login?redirect=/checkout');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // First update profile with the new address if they changed it
      await api.patch('/users/profile', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        landmark: formData.landmark,
        phoneNumber: formData.phoneNumber
      });
      
      // Then create the order
      const orderPayload = {
        total,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        landmark: formData.landmark,
        phoneNumber: formData.phoneNumber,
        paymentMethod,
        shippingMethod,
        bkashNumber: formData.bkashNumber,
        trxId: formData.trxId,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.offerPrice ?? item.product.price
        }))
      };
      
      await api.post('/orders', orderPayload);
      
      setIsSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Checkout failed', err);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isMounted) return null;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20">
        <Container className="max-w-3xl text-center">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Order Confirmed!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for your purchase. We've received your order and will email you a receipt and tracking information shortly.
          </p>
          <p className="font-mono text-sm text-muted-foreground bg-muted p-4 rounded-lg inline-block mb-12">
            Order #ORD-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
          </p>
          <div>
            <Link href="/orders">
              <Button size="lg" className="h-14 px-8 text-base">
                View Order Status
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20">
        <Container className="max-w-xl text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Checkout</h1>
          <p className="text-muted-foreground mb-8">Your cart is empty. Add some items before proceeding to checkout.</p>
          <Link href="/shop">
            <Button size="lg">Return to Shop</Button>
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-24 sm:pt-32 pb-16 sm:pb-20">
      <Container>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 sm:mb-8">
          <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* Left Column - Form */}
          <div className="lg:col-span-7 xl:col-span-8 bg-background p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-border order-2 lg:order-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Contact Information</h2>
            
            <form onSubmit={handleCheckout} className="space-y-8">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">Email address</label>
                  {isLoadingProfile ? (
                    <Skeleton className="h-12 w-full rounded-md" />
                  ) : (
                    <input value={user?.email || ''} disabled type="email" id="email" className="flex h-12 w-full rounded-md border border-border bg-muted px-3 py-2 text-base sm:text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50" placeholder="you@example.com" />
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-6">Shipping Address</h2>
                {isLoadingProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-12 w-full rounded-md" /></div>
                    <div className="grid gap-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-12 w-full rounded-md" /></div>
                    <div className="grid gap-2 md:col-span-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-12 w-full rounded-md" /></div>
                    <div className="grid gap-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-12 w-full rounded-md" /></div>
                    <div className="grid gap-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-12 w-full rounded-md" /></div>
                    <div className="grid gap-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-12 w-full rounded-md" /></div>
                    <div className="grid gap-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-12 w-full rounded-md" /></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="firstName" className="text-sm font-medium">First name</label>
                      <input required value={formData.firstName} onChange={handleChange} type="text" id="firstName" className="flex h-12 w-full rounded-md border border-border bg-background px-3 py-2 text-base sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
                      <input required value={formData.lastName} onChange={handleChange} type="text" id="lastName" className="flex h-12 w-full rounded-md border border-border bg-background px-3 py-2 text-base sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="grid gap-2 md:col-span-2">
                      <label htmlFor="address" className="text-sm font-medium">Address</label>
                      <input required value={formData.address} onChange={handleChange} type="text" id="address" className="flex h-12 w-full rounded-md border border-border bg-background px-3 py-2 text-base sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="landmark" className="text-sm font-medium">Landmark (Optional)</label>
                      <input value={formData.landmark} onChange={handleChange} type="text" id="landmark" placeholder="e.g. Near the big banyan tree" className="flex h-12 w-full rounded-md border border-border bg-background px-3 py-2 text-base sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</label>
                      <input required value={formData.phoneNumber} onChange={handleChange} type="tel" id="phoneNumber" placeholder="01XXXXXXXXX" className="flex h-12 w-full rounded-md border border-border bg-background px-3 py-2 text-base sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="city" className="text-sm font-medium">City</label>
                      <input required value={formData.city} onChange={handleChange} type="text" id="city" className="flex h-12 w-full rounded-md border border-border bg-background px-3 py-2 text-base sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="zip" className="text-sm font-medium">Postal code</label>
                      <input required value={formData.zip} onChange={handleChange} type="text" id="zip" className="flex h-12 w-full rounded-md border border-border bg-background px-3 py-2 text-base sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Shipping Method</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`block border rounded-lg p-4 cursor-pointer transition-colors ${shippingMethod === 'sameday' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background hover:bg-muted/50'}`}>
                    <div className="flex items-start gap-3">
                      <input 
                        type="radio" 
                        name="shippingMethod" 
                        value="sameday" 
                        checked={shippingMethod === 'sameday'} 
                        onChange={() => setShippingMethod('sameday')}
                        className="w-4 h-4 mt-1 accent-primary"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-base flex items-center justify-between">
                          Inside Dhaka
                          <span>৳70</span>
                        </span>
                        <p className="text-sm text-muted-foreground mt-1">Steadfast Same-Day Delivery (Order before 11:00 AM)</p>
                      </div>
                    </div>
                  </label>

                  <label className={`block border rounded-lg p-4 cursor-pointer transition-colors ${shippingMethod === 'nationwide' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background hover:bg-muted/50'}`}>
                    <div className="flex items-start gap-3">
                      <input 
                        type="radio" 
                        name="shippingMethod" 
                        value="nationwide" 
                        checked={shippingMethod === 'nationwide'} 
                        onChange={() => setShippingMethod('nationwide')}
                        className="w-4 h-4 mt-1 accent-primary"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-base flex items-center justify-between">
                          Outside Dhaka
                          <span>৳120</span>
                        </span>
                        <p className="text-sm text-muted-foreground mt-1">Steadfast Nationwide Delivery (24-48 hours)</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                
                <div className="space-y-4">
                  {/* bKash Option */}
                  <label className={`block border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'bkash' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background hover:bg-muted/50'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="bkash" 
                        checked={paymentMethod === 'bkash'} 
                        onChange={() => setPaymentMethod('bkash')}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="font-semibold text-base">bKash (Send Money Personal)</span>
                    </div>
                    
                    {paymentMethod === 'bkash' && (
                      <div className="mt-4 pt-4 border-t border-border space-y-4 animate-in slide-in-from-top-2">
                        <div className="bg-pink-500/10 text-pink-600 p-3 rounded-md text-sm">
                          <p className="font-medium mb-1">bKash Personal Number:</p>
                          <p className="text-lg font-bold tracking-wider">{siteSettings?.bkashNumber || '01733941913'}</p>
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="bkashNumber" className="text-sm font-medium">Your bKash Number</label>
                          <input required={paymentMethod === 'bkash'} value={formData.bkashNumber} onChange={handleChange} type="text" id="bkashNumber" placeholder="01XXXXXXXXX" className="flex h-12 w-full rounded-md border border-border bg-background px-3 py-2 text-base sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="trxId" className="text-sm font-medium">Transaction ID (TrxID)</label>
                          <input required={paymentMethod === 'bkash'} value={formData.trxId} onChange={handleChange} type="text" id="trxId" placeholder="e.g. 8NX9QA5V" className="flex h-12 w-full rounded-md border border-border bg-background px-3 py-2 text-base sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Cash on Delivery Option */}
                  <label className={`block border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background hover:bg-muted/50'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="cod" 
                        checked={paymentMethod === 'cod'} 
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="font-semibold text-base">Cash on Delivery (COD)</span>
                    </div>
                    
                    {paymentMethod === 'cod' && (
                      <div className="mt-4 pt-4 border-t border-border animate-in slide-in-from-top-2">
                        <p className="text-sm text-muted-foreground">
                          You will pay the delivery agent in cash when your order arrives.
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 text-base sm:text-lg mt-8"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Processing Order...
                  </span>
                ) : (
                  paymentMethod === 'bkash' ? `Confirm Order & Pay ৳${total.toFixed(2)}` : 'Confirm Order'
                )}
              </Button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4 bg-background p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-border lg:sticky lg:top-24 order-1 lg:order-2">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-md bg-muted overflow-hidden shrink-0 border border-border">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center text-[10px] font-bold z-10">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-medium text-sm line-clamp-1">{item.product.name}</h3>
                    {item.variant && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.variant.options?.[0]?.name || item.variant.type}
                      </p>
                    )}
                  </div>
                  <div className="font-medium text-sm flex items-center">
                    ৳{((item.product.offerPrice ?? item.product.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-border text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping (Steadfast)</span>
                <span className="font-medium">{shipping === 0 ? 'Free' : `৳${shipping.toFixed(2)}`}</span>
              </div>
              </div>

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold">৳{total.toFixed(2)}</span>
            </div>
            
            <div className="mt-8 flex items-start gap-3 bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
              <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
              <p>Your payment information is processed securely. We do not store credit card details nor have access to your credit card information.</p>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
