"use client";

import React, { useEffect, useState } from "react";
import { getAllAdminOrders, deleteAdminOrder } from "@/services/adminOrderService";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await getAllAdminOrders(1, 50, statusFilter);
      setOrders(data.orders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm(`Are you sure you want to delete order ${id.slice(0, 8).toUpperCase()}? This action cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteAdminOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      await fetchOrders();
    } catch (err: any) {
      alert(err.message || "Failed to delete order");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'PROCESSING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Order Management</h1>
          <p className="text-muted-foreground">View and manage all customer orders.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-background border border-border px-3 py-2 rounded-lg shadow-sm">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Filter by Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer outline-none w-32"
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors border-b border-border">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {order.id.slice(0, 8).toUpperCase()}...
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{order.user.firstName} {order.user.lastName}</div>
                      <div className="text-xs text-muted-foreground">{order.user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ৳{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/dashboard/orders/${order.id}`}
                          className="text-xs bg-primary text-primary-foreground px-2.5 py-1.5 rounded hover:opacity-90 transition-opacity"
                        >
                          Details
                        </Link>
                        <Link 
                          href={`/orders/${order.id}`}
                          target="_blank"
                          className="text-xs bg-muted text-muted-foreground px-2.5 py-1.5 rounded hover:opacity-90 transition-opacity hidden sm:inline-block"
                        >
                          Customer View
                        </Link>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          disabled={deletingId === order.id}
                          className="text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 p-1.5 rounded transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                    
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
