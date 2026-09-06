"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { FileText, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { requestService } from "@/services/requestService";

const StatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status?.toUpperCase() || 'PENDING';
  const styles = {
    PENDING: "bg-amber-100 text-amber-800 border-amber-200",
    REVIEWED: "bg-blue-100 text-blue-800 border-blue-200",
    FULFILLED: "bg-emerald-100 text-emerald-800 border-emerald-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200"
  };
  
  const style = styles[normalizedStatus as keyof typeof styles] || "bg-muted text-muted-foreground";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
      {normalizedStatus}
    </span>
  );
};

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await requestService.getUserRequests();
      setRequests(data || []);
    } catch (err: any) {
      console.error("Failed to fetch requests:", err);
      setError(err.message || "Failed to load product requests");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-32 pb-20">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Product Requests</h1>
            <p className="text-muted-foreground">Check the status of products you've requested us to source.</p>
          </div>
          <Link href="/request-product">
            <Button>Submit New Request</Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-sm">
                {error}
              </div>
            ) : requests.length === 0 ? (
              <div className="bg-background border border-border p-8 rounded-xl text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Requests Found</h3>
                <p className="text-muted-foreground mb-6">Looks like you haven't requested any products yet.</p>
                <Link href="/request-product">
                  <Button>Request a Product</Button>
                </Link>
              </div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="bg-background border border-border rounded-xl p-5 hover:border-foreground/50 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{request.title}</h3>
                      <p className="text-sm text-muted-foreground">Model: {request.model || 'N/A'}</p>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-muted/20 p-4 rounded-lg">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase mb-1">Date Requested</p>
                      <p className="font-medium">{new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase mb-1">Color</p>
                      <p className="font-medium">{request.color || 'Any'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase mb-1">Size</p>
                      <p className="font-medium">{request.size || 'Any'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase mb-1">Quantity</p>
                      <p className="font-medium">{request.quantity}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
