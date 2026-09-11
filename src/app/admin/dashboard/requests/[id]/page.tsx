"use client";

import React, { useEffect, useState } from "react";
import { getProductRequestById, updateProductRequestStatus, deleteProductRequest } from "../actions";
import { Loader2, ArrowLeft, Image as ImageIcon, MapPin, Calendar, CheckCircle, Clock, XCircle, Info, Phone, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function ProductRequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  
  const [request, setRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      setIsLoading(true);
      const data = await getProductRequestById(id);
      setRequest(data);
    } catch (err) {
      console.error("Failed to fetch product request", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      setIsUpdating(true);
      await updateProductRequestStatus(id, status);
      await fetchRequest();
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!confirm(`Are you sure you want to delete this product request for "${request?.title || 'this item'}"? This action cannot be undone.`)) return;
    try {
      setIsDeleting(true);
      await deleteProductRequest(id);
      router.push("/admin/dashboard/requests");
    } catch (err: any) {
      alert(err.message || "Failed to delete product request");
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'REVIEWED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FULFILLED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
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

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <h2 className="text-2xl font-bold mb-2">Request Not Found</h2>
        <p className="text-muted-foreground mb-4">The product request you are looking for does not exist.</p>
        <Link href="/admin/dashboard/requests" className="text-primary hover:underline">
          Back to Requests
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link href="/admin/dashboard/requests" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Requests
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{request.title}</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4" />
            Requested on {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleDeleteRequest}
            disabled={isDeleting}
            className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 text-sm font-medium gap-1.5"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {isDeleting ? "Deleting..." : "Delete Request"}
          </Button>
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(request.status)}`}>
            {request.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Customer Details & Actions */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Customer Details
              </h3>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <div className="flex flex-col border-b border-border pb-3">
                <span className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Name</span>
                <span className="font-medium">{request.customerName}</span>
              </div>
              <div className="flex flex-col border-b border-border pb-3">
                <span className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Phone</span>
                <span className="font-medium flex items-center gap-2">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  {request.customerPhone}
                </span>
              </div>
              {request.user && (
                <div className="flex flex-col pt-2">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Registered User</span>
                  <Link href={`/admin/dashboard/customers/${request.userId}`} className="font-medium text-primary hover:underline">
                    {request.user.firstName} {request.user.lastName}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Update Status
              </h3>
            </div>
            <div className="p-5 space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
                onClick={() => handleUpdateStatus('PENDING')}
                disabled={isUpdating || request.status === 'PENDING'}
              >
                <Clock className="w-4 h-4 mr-2" /> Mark as Pending
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                onClick={() => handleUpdateStatus('REVIEWED')}
                disabled={isUpdating || request.status === 'REVIEWED'}
              >
                <Info className="w-4 h-4 mr-2" /> Mark as Reviewed
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                onClick={() => handleUpdateStatus('FULFILLED')}
                disabled={isUpdating || request.status === 'FULFILLED'}
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Mark as Fulfilled
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                onClick={() => handleUpdateStatus('REJECTED')}
                disabled={isUpdating || request.status === 'REJECTED'}
              >
                <XCircle className="w-4 h-4 mr-2" /> Mark as Rejected
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Request Details & Images */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Product Specifics
              </h3>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs uppercase tracking-wider">Model</p>
                <p className="font-medium">{request.model || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs uppercase tracking-wider">Color</p>
                <p className="font-medium">{request.color || 'Any'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs uppercase tracking-wider">Size</p>
                <p className="font-medium">{request.size || 'Any'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs uppercase tracking-wider">Quantity</p>
                <p className="font-medium">{request.quantity || 1}</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                Reference Images
              </h3>
            </div>
            <div className="p-6">
              {request.images && request.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {request.images.map((img: string, i: number) => (
                    <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="block relative aspect-square rounded-xl border border-border overflow-hidden hover:opacity-90 transition-opacity">
                      <Image src={img} alt={`Reference ${i + 1}`} fill className="object-cover" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                  <p>No reference images provided</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
