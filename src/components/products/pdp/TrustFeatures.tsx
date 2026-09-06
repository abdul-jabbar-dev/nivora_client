import { Truck, ShieldCheck, RefreshCcw } from "lucide-react";

export function TrustFeatures() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8">
      <div className="flex flex-col items-start gap-2">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <Truck className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h4 className="font-semibold text-sm">Fast Delivery</h4>
          <p className="text-xs text-muted-foreground mt-1">Delivered safely to your doorstep</p>
        </div>
      </div>
      
      <div className="flex flex-col items-start gap-2">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h4 className="font-semibold text-sm">Secure Payment</h4>
          <p className="text-xs text-muted-foreground mt-1">Your payment information is protected</p>
        </div>
      </div>
      
      <div className="flex flex-col items-start gap-2">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        </div>
        <div>
          <h4 className="font-semibold text-sm">Cash on Delivery</h4>
          <p className="text-xs text-muted-foreground mt-1">Pay when you receive the product</p>
        </div>
      </div>
    </div>
  );
}
