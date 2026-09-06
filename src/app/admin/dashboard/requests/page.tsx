import { getProductRequests } from "./actions";
import { FileText, Package, User, Clock, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function AdminRequestsPage() {
  let requests = [];
  try {
    requests = await getProductRequests();
  } catch (error) {
    // console.error(error);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'REVIEWED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FULFILLED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Product Requests</h1>
      </div>

      <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
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
              {requests.map((req: any) => (
                <tr key={req.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{req.customerName}</div>
                    <div className="text-xs text-muted-foreground">{req.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{req.title}</div>
                    <div className="text-xs text-muted-foreground">Model: {req.model || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4">
                    {req.images && req.images.length > 0 && (
                      <div className="flex gap-2">
                        {req.images.map((img: string, i: number) => (
                          <div key={i} className="relative w-8 h-8 rounded border border-border overflow-hidden">
                            <Image src={img} alt="Ref" fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/dashboard/requests/${req.id}`}
                      className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded hover:opacity-90 transition-opacity"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6" />
                    </div>
                    No product requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
