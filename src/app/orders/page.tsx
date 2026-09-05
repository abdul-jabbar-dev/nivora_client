"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Package, Truck, CheckCircle2, Clock, ChevronRight, Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

import { orderService } from "@/services/orderService";

const StatusIcon = ({ status }: { status: string }) => {
  switch (status?.toLowerCase()) {
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, searchQuery]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orderService.getUserOrders(page, 10, statusFilter, searchQuery);
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(searchInput);
  };

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

        <div className="max-w-4xl mx-auto">
          
          {/* Order List */}
          <div className="flex flex-col gap-4">
            {/* Filters & Search */}
            <div className="bg-background border border-border p-4 rounded-xl flex flex-col gap-3">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search order ID..." 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </form>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select 
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-background border border-border p-5 rounded-xl h-[104px]">
                  <div className="flex justify-between items-start mb-3">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-sm">
                {error}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-background border border-border p-8 rounded-xl text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Orders Found</h3>
                <p className="text-muted-foreground mb-6">Looks like you haven't placed any orders yet.</p>
                <Link href="/shop">
                  <Button>Start Shopping</Button>
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-background border border-border hover:border-foreground/50 hover:shadow-sm rounded-xl transition-all duration-200">
                  <button
                    onClick={() => {
                      const newSet = new Set(expandedOrders);
                      if (newSet.has(order.id)) {
                        newSet.delete(order.id);
                      } else {
                        newSet.add(order.id);
                      }
                      setExpandedOrders(newSet);
                    }}
                    className="w-full text-left p-5 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-lg">{order.id.slice(0, 8).toUpperCase()}</div>
                      <StatusBadge status={order.status} />
                      {expandedOrders.has(order.id) ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="font-medium text-foreground">৳{order.total.toFixed(2)}</span>
                    </div>
                  </button>
                  {expandedOrders.has(order.id) && (
                    <div className="px-5 pb-5 space-y-4">
                      {/* Shipping Details */}
                      <div className="bg-muted/20 p-3 rounded">
                        <h4 className="font-semibold mb-1">Shipping Details</h4>
                        <p className="text-sm">{order.address}</p>
                        <p className="text-sm">{order.city}, {order.zip}</p>
                        {order.landmark && <p className="text-sm">Landmark: {order.landmark}</p>}
                        <p className="text-sm">Phone: {order.phoneNumber}</p>
                      </div>
                      {/* Ordered Items */}
                      <div className="bg-muted/20 p-3 rounded">
                        <h4 className="font-semibold mb-1">Items Ordered</h4>
                        <div className="space-y-2">
                          {order.items?.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-12 h-12 relative rounded-md overflow-hidden">
                                <img src={item.product.imageUrl || '/placeholder.jpg'} alt={item.product.name} className="object-cover w-full h-full" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                              <div className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
              <div className="flex justify-end mt-2">
                <Link href={`/orders/${order.id}`} className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded hover:opacity-90 transition-opacity">
                  View Details
                </Link>
              </div>
                    </div>
                  )}
                </div>
              ))
            )}
            
            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-between bg-background border border-border p-4 rounded-xl mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium">Page {page} of {totalPages}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
