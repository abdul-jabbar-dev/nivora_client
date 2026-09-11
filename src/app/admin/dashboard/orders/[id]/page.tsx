"use client";

import React, { useEffect, useState } from "react";
import { getAdminOrderById, updateOrderStatus, deleteAdminOrder } from "@/services/adminOrderService";
import { Loader2, ArrowLeft, Package, Truck, CheckCircle2, Clock, Printer, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const StatusIcon = ({ status }: { status: string }) => {
  switch (status?.toLowerCase()) {
    case 'processing': return <Clock className="w-4 h-4 text-amber-500" />;
    case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
    case 'delivered': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    default: return <Package className="w-4 h-4 text-muted-foreground" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'PENDING': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'PROCESSING': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'SHIPPED': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
    case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function AdminOrderDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Status update state
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleDeleteOrder = async () => {
    if (!order) return;
    if (!confirm(`Are you sure you want to delete order ${order.id.slice(0, 8).toUpperCase()}? This action cannot be undone.`)) return;
    try {
      setIsDeleting(true);
      await deleteAdminOrder(order.id);
      router.push("/admin/dashboard/orders");
    } catch (err: any) {
      alert(err.message || "Failed to delete order");
      setIsDeleting(false);
    }
  };

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminOrderById(id);
      setOrder(data);
      setSelectedStatus(data.status);
    } catch (err) {
      console.error("Failed to fetch admin order details", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChangeClick = () => {
    setShowStatusModal(true);
    setStatusNote('');
  };

  const submitStatusChange = async () => {
    if (!selectedStatus) return;
    try {
      setIsUpdatingStatus(true);
      await updateOrderStatus(order.id, selectedStatus, statusNote);
      await fetchOrder(); // Refresh order data
      setShowStatusModal(false);
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <p className="text-muted-foreground mb-4">Order not found.</p>
        <Link href="/admin/dashboard/orders" className="text-primary hover:underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <Link href="/admin/dashboard/orders" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Order {order.id.slice(0, 8).toUpperCase()}</h1>
          <p className="text-muted-foreground">
            Placed by {order.user.firstName} {order.user.lastName} ({order.user.email}) on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/dashboard/orders/${order.id}/invoice`}
            target="_blank"
            className="border border-border bg-background hover:bg-muted text-sm font-medium px-3.5 py-2 rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4 text-muted-foreground" /> Print Invoice
          </Link>
          <button
            onClick={handleDeleteOrder}
            disabled={isDeleting}
            className="border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 text-sm font-medium px-3.5 py-2 rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <Trash2 className="w-4 h-4" /> {isDeleting ? "Deleting..." : "Delete Order"}
          </button>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
            <button 
              onClick={handleStatusChangeClick}
              className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Update Status
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Left) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tracking History */}
          <div className="bg-background rounded-xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-6">Tracking History</h3>
            {order.statusHistory && order.statusHistory.length > 0 ? (
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
            ) : (
              <p className="text-muted-foreground text-sm">No tracking history available.</p>
            )}
          </div>

          {/* Ordered Items */}
          <div className="bg-background rounded-xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-6">Items Ordered ({order.items?.length || 0})</h3>
            <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
              {order.items?.map((item: any) => (
                <div key={item.id} className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 relative rounded-md border border-border overflow-hidden shrink-0">
                    <Image src={item.product.imageUrl || '/placeholder.jpg'} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate hover:underline underline-offset-4">
                      <Link href={`/products/${item.product.slug || item.product.id}`}>{item.product.name}</Link>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity} × ৳{item.price.toFixed(2)}</p>
                  </div>
                  <div className="font-medium">
                    ৳{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="p-4 bg-muted/30 flex justify-between items-center font-bold">
                <span>Total Amount</span>
                <span>৳{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar (Right) */}
        <div className="space-y-8">
          
          {/* Shipping Address */}
          <div className="bg-background rounded-xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 text-muted-foreground uppercase text-xs tracking-wider">Shipping Details</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-foreground">{order.user.firstName} {order.user.lastName}</p>
              <p>{order.address}</p>
              <p>{order.city}, {order.zip}</p>
              <p className="pt-2"><strong>Phone:</strong> {order.phoneNumber}</p>
              {order.landmark && <p><strong>Landmark:</strong> {order.landmark}</p>}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-background rounded-xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 text-muted-foreground uppercase text-xs tracking-wider">Payment Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Method:</strong> {order.paymentMethod}</p>
              {order.trxId && <p><strong>TrxID:</strong> {order.trxId}</p>}
              {order.bkashNumber && <p><strong>bKash:</strong> {order.bkashNumber}</p>}
            </div>
          </div>

        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-lg">Update Order Status</h3>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Status</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium">Tracking Note (Optional)</label>
                <textarea 
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Package handed off to FedEx, tracking #123456"
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
                />
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-3 bg-muted/30">
              <button 
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitStatusChange}
                disabled={isUpdatingStatus || selectedStatus === order.status}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
              >
                {isUpdatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
