"use client";

import { useState, useEffect } from "react";
import { getProductRequests, deleteProductRequest } from "./actions";
import { FileText, Trash2, Loader2, Search, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const STATUS_FILTERS = [
  { id: "ALL", label: "All Requests" },
  { id: "PENDING", label: "Pending" },
  { id: "REVIEWED", label: "Reviewed" },
  { id: "FULFILLED", label: "Fulfilled" },
  { id: "REJECTED", label: "Rejected" },
];

export default function AdminRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await getProductRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (e: React.MouseEvent, req: any) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete the product request for "${req.title}"?`)) {
      return;
    }

    try {
      setDeletingId(req.id);
      await deleteProductRequest(req.id);
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
    } catch (err: any) {
      alert(err.message || "Failed to delete product request");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "REVIEWED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "FULFILLED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesFilter = activeFilter === "ALL" || req.status === activeFilter;
    const matchesQuery =
      !searchQuery ||
      req.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.customerPhone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.model?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Product Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review, manage, and process customer custom product requests.
          </p>
        </div>
      </div>

      <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
        {/* Filters & Search Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-border gap-4">
          <div className="flex flex-wrap gap-1 bg-muted/50 p-1 rounded-lg">
            {STATUS_FILTERS.map((filter) => {
              const count =
                filter.id === "ALL"
                  ? requests.length
                  : requests.filter((r) => r.status === filter.id).length;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                    activeFilter === filter.id
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  <span>{filter.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeFilter === filter.id
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
              <p className="text-sm">Loading product requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-1">No product requests found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {searchQuery || activeFilter !== "ALL"
                  ? "No requests match your current filters."
                  : "Customers haven't submitted any product requests yet."}
              </p>
              {(searchQuery || activeFilter !== "ALL") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveFilter("ALL");
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Requested Product</th>
                  <th className="px-6 py-4 font-semibold">Images</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRequests.map((req: any) => (
                  <tr
                    key={req.id}
                    onClick={() => router.push(`/admin/dashboard/requests/${req.id}`)}
                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{req.customerName}</div>
                      <div className="text-xs text-muted-foreground">{req.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{req.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Model: {req.model || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {req.images && req.images.length > 0 ? (
                        <div className="flex gap-2">
                          {req.images.slice(0, 3).map((img: string, i: number) => (
                            <div
                              key={i}
                              className="relative w-9 h-9 rounded-md border border-border overflow-hidden shrink-0 bg-muted"
                            >
                              <Image src={img} alt="Ref" fill className="object-cover" />
                            </div>
                          ))}
                          {req.images.length > 3 && (
                            <span className="text-xs text-muted-foreground self-center">
                              +{req.images.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className="flex items-center justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/admin/dashboard/requests/${req.id}`}
                          className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, req)}
                          disabled={deletingId === req.id}
                          className="p-1.5 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 rounded-lg transition-colors border border-red-200"
                          title="Delete Request"
                        >
                          {deletingId === req.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
