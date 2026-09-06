"use client";

import React, { useEffect, useState } from "react";
import { getAllCustomers } from "../actions";
import { Loader2, User } from "lucide-react";
import Link from "next/link";

export default function AdminCustomersPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await getAllCustomers(1, 50);
      setData(res);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const customers = data?.users || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Customer Management</h1>
        <p className="text-muted-foreground">View all registered customers and their purchase history.</p>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
                <th className="px-6 py-4 font-semibold">Total Orders</th>
                <th className="px-6 py-4 font-semibold">Total Spent</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer: any) => (
                  <tr key={customer.id} className="hover:bg-muted/30 transition-colors border-b border-border">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {customer.firstName ? customer.firstName[0].toUpperCase() : <User className="w-5 h-5" />}
                        </div>
                        <div>
                          <Link href={`/admin/dashboard/customers/${customer.id}`} className="font-medium text-foreground hover:underline">
                            {customer.firstName || 'Unknown'} {customer.lastName || ''}
                          </Link>
                          <div className="text-xs text-muted-foreground">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${customer.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'}`}>
                        {customer.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {customer.orderCount}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ৳{customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/dashboard/customers/${customer.id}`}
                        className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded hover:opacity-90 transition-opacity"
                      >
                        View Details
                      </Link>
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
