"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Package, Truck, CheckCircle2, Clock, ChevronRight, FileText, ArrowLeft, Printer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { LeaveReviewModal } from "@/components/reviews/LeaveReviewModal";
import { useCartStore } from "@/store/useCartStore";
import { orderService } from "@/services/orderService";
import { ProductInteractions } from "@/components/products/pdp/ProductInteractions";

const StatusIcon = ({ status }: { status: string }) => {
  switch (status?.toLowerCase()) {
    case 'processing': return <Clock className="w-4 h-4 text-amber-500" />;
    case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
    case 'delivered': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    default: return <Package className="w-4 h-4 text-muted-foreground" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status?.toLowerCase() || 'pending';
  const styles = {
    pending: "bg-gray-500/10 text-gray-600 border-gray-200",
    processing: "bg-amber-500/10 text-amber-600 border-amber-200",
    shipped: "bg-blue-500/10 text-blue-600 border-blue-200",
    delivered: "bg-green-500/10 text-green-600 border-green-200",
    cancelled: "bg-red-500/10 text-red-600 border-red-200"
  };
  const style = styles[normalizedStatus as keyof typeof styles] || "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
      <StatusIcon status={normalizedStatus} />
      {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
    </span>
  );
};

export default function OrderDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { addItem, openCart } = useCartStore();

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isBuyingAgain, setIsBuyingAgain] = useState(false);
  const [reviewModalData, setReviewModalData] = useState<{ productId: string, productName: string } | null>(null);

  useEffect(() => {
    fetchOrder();
    
    // Poll for order updates to simulate real-time updates for admin status changes
    const interval = setInterval(() => {
      fetchOrder(false);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [id]);

  const fetchOrder = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await orderService.getOrderDetails(id);
      setOrder(data);
    } catch (err: any) {
      if (showLoading) setError(err.message || "Failed to load order details");
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      setIsCancelling(true);
      await orderService.cancelOrder(id);
      await fetchOrder();
    } catch (err: any) {
      alert(err.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleBuyAgain = async () => {
    if (!order?.items) return;
    setIsBuyingAgain(true);
    for (const item of order.items) {
      if (item.product) {
        await addItem(item.product, undefined, item.quantity);
      }
    }
    setIsBuyingAgain(false);
    openCart();
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 pt-32 pb-20">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </Container>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-muted/30 pt-32 pb-20">
        <Container>
          <div className="max-w-4xl mx-auto bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-sm">
            {error || "Order not found"}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-32 pb-20 print:bg-white print:pt-0 print:pb-0">
      <Container>
        <div className="max-w-4xl mx-auto">
          
          <Link href="/orders" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors print:hidden">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>

          <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-muted/30 px-6 sm:px-8 py-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:bg-white print:border-none print:px-0 print:py-0 print:mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Order Details</h2>
                <p className="text-muted-foreground mt-1">Order #{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className="flex items-center gap-2 print:hidden">
                <Link href={`/orders/${order.id}/invoice`} target="_blank">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto shadow-sm">
                    <Printer className="w-4 h-4 mr-2" />
                    View &amp; Print Invoice
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* Status Section */}
              <div className="mb-8 p-4 rounded-lg bg-muted/50 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Current Status</h3>
                  <StatusBadge status={order.status} />
                  {order.status === 'PENDING' || order.status === 'PROCESSING' ? (
                    <p className="text-sm text-muted-foreground mt-2">
                      We're preparing your order for shipment. You will receive an email once it's on the way.
                    </p>
                  ) : null}
                  {order.status === 'DELIVERED' && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Your package was delivered successfully on {new Date(order.createdAt).toLocaleDateString()}.
                    </p>
                  )}
                </div>
                {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                  <div className="flex gap-2 w-full sm:w-auto print:hidden">
                    {order.status === 'PENDING' && (
                      <Button variant="outline" className="flex-1 sm:flex-none text-red-500 border-red-500 hover:bg-red-50" onClick={handleCancelOrder} disabled={isCancelling}>
                        {isCancelling ? 'Cancelling...' : 'Cancel'}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Tracking Timeline */}
              {order.statusHistory && order.statusHistory.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-4">Tracking History</h3>
                  <div className="relative pl-6 border-l-2 border-border space-y-6">
                    {order.statusHistory.map((history: any, idx: number) => (
                      <div key={history.id || idx} className="relative">
                        <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-background bg-primary" />
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                          <span className="font-semibold text-sm">{history.status}</span>
                          <span className="text-xs text-muted-foreground">{new Date(history.createdAt).toLocaleString()}</span>
                        </div>
                        {history.note && (
                          <div className="mt-1 text-sm bg-muted/50 p-2 rounded border border-border inline-block">
                            {history.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items List */}
              <h3 className="font-semibold text-lg mb-4">Items Ordered</h3>
              <div className="divide-y divide-border border border-border rounded-lg overflow-hidden mb-8">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 bg-background">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-muted overflow-hidden shrink-0 border border-border">
                      <Image
                        src={item.product?.imageUrl || '/placeholder.jpg'}
                        alt={item.product?.name || 'Product'}
                        fill
                        sizes="(max-width: 640px) 80px, 96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 sm:gap-4">
                        <div>
                          <Link href={`/products/${item.product?.slug || item.product?.id}`} className="font-semibold text-base sm:text-lg hover:underline underline-offset-4">
                            {item.product?.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="font-semibold text-lg">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      {order.status === 'DELIVERED' ? (
                        <div className="mt-4 flex flex-col sm:flex-row justify-end items-end sm:items-center gap-4 print:hidden">
                          <ProductInteractions product={item.product} compact className="mt-0" />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setReviewModalData({ productId: item.product?.id, productName: item.product?.name })}
                          >
                            Write a Review
                          </Button>
                        </div>
                      ) : order.status !== 'CANCELLED' ? (
                        <div className="mt-3 flex justify-end print:hidden">
                          <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md">
                            Feedback & review available after delivery
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary & Shipping Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-border pt-8">
                <div>
                  <h3 className="font-semibold mb-3 text-muted-foreground uppercase text-xs tracking-wider">Shipping Details</h3>
                  <p className="text-sm font-medium mb-1">Standard Delivery</p>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    <p>{order.address}</p>
                    <p>{order.city}, {order.zip}</p>
                    <p>Phone: {order.phoneNumber}</p>
                    {order.landmark && <p>Landmark: {order.landmark}</p>}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-muted-foreground uppercase text-xs tracking-wider">Payment Information</h3>
                  <p className="text-sm font-medium mb-1">{order.paymentMethod}</p>
                  
                  <div className="mt-4 space-y-2 text-sm border-t border-border pt-4">
                    {(() => {
                      const subtotal = order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0;
                      const shipping = order.total - subtotal;
                      return (
                        <>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span>৳{subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Shipping</span>
                            <span>৳{shipping.toFixed(2)}</span>
                          </div>
                        </>
                      );
                    })()}

                    <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-border">
                      <span>Total</span>
                      <span>৳{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer Actions */}
              <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-3 print:hidden">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto px-8" 
                  onClick={handleBuyAgain}
                  disabled={isBuyingAgain}
                >
                  {isBuyingAgain ? 'Adding to cart...' : 'Buy Again'}
                </Button>
              </div>

            </div>
          </div>
        </div>
      </Container>
      
      {reviewModalData && (
        <LeaveReviewModal
          productId={reviewModalData.productId}
          productName={reviewModalData.productName}
          onClose={() => setReviewModalData(null)}
          onSuccess={() => {
            setReviewModalData(null);
            alert("Review submitted successfully!");
          }}
        />
      )}
    </div>
  );
}
