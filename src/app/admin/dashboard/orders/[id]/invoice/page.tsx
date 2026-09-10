"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAdminOrderById } from "@/services/adminOrderService";
import { InvoiceTemplate } from "@/components/orders/InvoiceTemplate";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function AdminOrderInvoicePage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAdminOrderById(id);
        setOrder(data);
      } catch (err: any) {
        console.error("Failed to load admin invoice details:", err);
        setError(err.message || "Failed to load order invoice");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-sm text-muted-foreground">Generating invoice for packing & shipping...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30 text-center">
        <div className="bg-background border border-border p-8 rounded-2xl max-w-md w-full space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-destructive">Invoice Not Available</h2>
          <p className="text-sm text-muted-foreground">{error || "Could not retrieve order details."}</p>
          <Link href={`/admin/dashboard/orders/${id}`}>
            <Button variant="outline" className="w-full">
              Return to Order Management
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <InvoiceTemplate
      order={order}
      backHref={`/admin/dashboard/orders/${id}`}
      showActions={true}
    />
  );
}
