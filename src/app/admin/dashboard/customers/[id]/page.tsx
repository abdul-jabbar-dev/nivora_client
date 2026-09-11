"use client";

import React, { useEffect, useState } from "react";
import { getCustomerById } from "../../actions";
import { Loader2, ArrowLeft, User, Package, MapPin, Calendar, Clock, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setIsLoading(true);
      const data = await getCustomerById(id);
      setCustomer(data);
    } catch (err) {
      console.error("Failed to fetch customer", err);
    } finally {
      setIsLoading(false);
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

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <h2 className="text-2xl font-bold mb-2">Customer Not Found</h2>
        <p className="text-muted-foreground mb-4">The customer you are looking for does not exist.</p>
        <Link href="/admin/dashboard/customers" className="text-primary hover:underline">
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/dashboard/customers" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Customers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Contact */}
        <div className="space-y-8 lg:col-span-1">
          {/* Profile Card */}
          <div className="bg-background rounded-2xl border border-border shadow-sm p-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">
              {customer.firstName ? <span className="text-3xl">{customer.firstName[0].toUpperCase()}</span> : <User className="w-12 h-12" />}
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {customer.firstName || 'Unknown'} {customer.lastName || ''}
            </h2>
            <p className="text-muted-foreground mb-4">{customer.email}</p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${customer.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'}`}>
                Role: {customer.role}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-muted text-muted-foreground border-border flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Joined: {new Date(customer.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Contact & Shipping Info */}
          <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Contact & Shipping Details
              </h3>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between items-start border-b border-border pb-3">
                <span className="text-muted-foreground">Phone Number</span>
                <span className="font-medium text-right max-w-[200px]">{customer.phoneNumber || 'Not provided'}</span>
              </div>
              <div className="flex justify-between items-start border-b border-border pb-3">
                <span className="text-muted-foreground">Address</span>
                <span className="font-medium text-right max-w-[200px]">{customer.address || 'Not provided'}</span>
              </div>
              <div className="flex justify-between items-start border-b border-border pb-3">
                <span className="text-muted-foreground">City</span>
                <span className="font-medium text-right max-w-[200px]">{customer.city || 'Not provided'}</span>
              </div>
              <div className="flex justify-between items-start border-b border-border pb-3">
                <span className="text-muted-foreground">ZIP / Postal</span>
                <span className="font-medium text-right max-w-[200px]">{customer.zip || 'Not provided'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Landmark</span>
                <span className="font-medium text-right max-w-[200px]">{customer.landmark || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background rounded-2xl border border-border shadow-sm p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <h3 className="text-2xl font-bold tracking-tight">{customer.orders?.length || 0}</h3>
              </div>
            </div>
            <div className="bg-background rounded-2xl border border-border shadow-sm p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                <span className="text-xl font-bold">৳</span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lifetime Spent</p>
                <h3 className="text-2xl font-bold tracking-tight">৳{(customer.totalSpent || 0).toFixed(2)}</h3>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Order History
              </h3>
            </div>
            
            {(!customer.orders || customer.orders.length === 0) ? (
              <div className="p-8 text-center text-muted-foreground">
                This customer hasn't placed any orders yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/10 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Order ID</th>
                      <th className="px-6 py-3 font-semibold">Date</th>
                      <th className="px-6 py-3 font-semibold">Items</th>
                      <th className="px-6 py-3 font-semibold">Total</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {customer.orders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium">
                          {order.id.slice(0, 8).toUpperCase()}...
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {order.items?.length || 0} items
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
                          <Link 
                            href={`/admin/dashboard/orders/${order.id}`}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
