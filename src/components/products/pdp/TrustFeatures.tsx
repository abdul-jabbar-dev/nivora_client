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
          <RefreshCcw className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h4 className="font-semibold text-sm">Easy Returns</h4>
          <p className="text-xs text-muted-foreground mt-1">Simple 30-day return policy</p>
        </div>
      </div>
    </div>
  );
}
