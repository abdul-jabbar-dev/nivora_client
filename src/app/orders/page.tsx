"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Package, Truck, CheckCircle2, Clock, ChevronRight, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Dummy Order Data
const MOCK_ORDERS = [
  {
    id: "ORD-892341",
    date: "Sep 3, 2026",
    status: "processing",
    total: 23150,
    items: [
      {
        name: "Premium Wireless Headphones",
        variant: "Midnight Black",
        quantity: 1,
        price: 29900,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"
      }
    ],
    shippingAddress: "123 Main St, Apt 4B, New York, NY 10001",
    paymentMethod: "bKash (Send Money Personal)",
  },
  {
    id: "ORD-714592",
    date: "Aug 15, 2026",
    status: "delivered",
    total: 7500,
    items: [
      {
        name: "Linen Button-Up Shirt",
        variant: "White",
        quantity: 1,
        price: 7500,
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&q=80&w=800"
      }
    ],
    shippingAddress: "123 Main St, Apt 4B, New York, NY 10001",
    paymentMethod: "Credit Card ending in 4242",
  },
  {
    id: "ORD-652391",
    date: "Jul 22, 2026",
    status: "delivered",
    total: 19999,
    items: [
      {
        name: "Minimalist Watch",
        variant: "Silver",
        quantity: 1,
        price: 19999,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"
      }
    ],
    shippingAddress: "123 Main St, Apt 4B, New York, NY 10001",
    paymentMethod: "Cash on Delivery",
  }
];

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'processing':
      return <Clock className="w-4 h-4 text-amber-500" />;
    case 'shipped':
      return <Truck className="w-4 h-4 text-blue-500" />;
    case 'delivered':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    default:
      return <Package className="w-4 h-4 text-muted-foreground" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    processing: "bg-amber-500/10 text-amber-600 border-amber-200",
    shipped: "bg-blue-500/10 text-blue-600 border-blue-200",
    delivered: "bg-green-500/10 text-green-600 border-green-200"
  };
  
  const style = styles[status as keyof typeof styles] || "bg-muted text-muted-foreground";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
      <StatusIcon status={status} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState(MOCK_ORDERS[0].id);
  const selectedOrder = MOCK_ORDERS.find(o => o.id === selectedOrderId) || MOCK_ORDERS[0];

  return (
    <div className="min-h-screen bg-muted/30 pt-32 pb-20">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Orders</h1>
            <p className="text-muted-foreground">Check the status of recent orders, manage returns, and view order details.</p>
          </div>
          <Link href="/shop">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Order List */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
            {MOCK_ORDERS.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className={cn(
                  "text-left p-5 rounded-xl border transition-all duration-200 w-full",
                  selectedOrderId === order.id 
                    ? "bg-background border-foreground shadow-md ring-1 ring-foreground" 
                    : "bg-background border-border hover:border-foreground/50 hover:shadow-sm"
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="font-semibold text-lg">{order.id}</div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {order.date}
                  </span>
                  <span className="font-medium text-foreground">৳{order.total.toFixed(2)}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column - Order Description */}
          <div className="lg:col-span-7 xl:col-span-8 bg-background rounded-2xl shadow-sm border border-border overflow-hidden lg:sticky lg:top-24">
            {/* Header */}
            <div className="bg-muted/30 px-6 sm:px-8 py-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Order Details</h2>
                <p className="text-muted-foreground mt-1">Order {selectedOrder.id}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <FileText className="w-4 h-4 mr-2" />
                View Invoice
              </Button>
            </div>

            <div className="p-6 sm:p-8">
              {/* Status Section */}
              <div className="mb-8 p-4 rounded-lg bg-muted/50 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Current Status</h3>
                  <StatusBadge status={selectedOrder.status} />
                  {selectedOrder.status === 'processing' && (
                    <p className="text-sm text-muted-foreground mt-2">
                      We're preparing your order for shipment. You will receive an email once it's on the way.
                    </p>
                  )}
                  {selectedOrder.status === 'delivered' && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Your package was delivered successfully on {selectedOrder.date}.
                    </p>
                  )}
                </div>
                {selectedOrder.status !== 'delivered' && (
                  <Button className="w-full sm:w-auto">
                    Track Package
                  </Button>
                )}
              </div>

              {/* Items List */}
              <h3 className="font-semibold text-lg mb-4">Items Ordered</h3>
              <div className="divide-y divide-border border border-border rounded-lg overflow-hidden mb-8">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 bg-background">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-muted overflow-hidden shrink-0 border border-border">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 80px, 96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 sm:gap-4">
                        <div>
                          <Link href="/shop" className="font-semibold text-base sm:text-lg hover:underline underline-offset-4">
                            {item.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            Variant: {item.variant}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="font-semibold text-lg">
                          ৳{item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary & Shipping Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-border pt-8">
                <div>
                  <h3 className="font-semibold mb-3 text-muted-foreground uppercase text-xs tracking-wider">Shipping Details</h3>
                  <p className="text-sm font-medium mb-1">Standard Delivery</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedOrder.shippingAddress}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-muted-foreground uppercase text-xs tracking-wider">Payment Information</h3>
                  <p className="text-sm font-medium mb-1">{selectedOrder.paymentMethod}</p>
                  
                  <div className="mt-4 space-y-2 text-sm border-t border-border pt-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>৳{(selectedOrder.total - (selectedOrder.total * 0.08)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Taxes</span>
                      <span>৳{(selectedOrder.total * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-border">
                      <span>Total</span>
                      <span>৳{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer Actions */}
              <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-3">
                <Button variant="outline" className="flex-1 sm:flex-none">
                  Return Items
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  Write a Review
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  Buy Again
                </Button>
              </div>

            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
