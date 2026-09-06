import { getProductRequests } from "./actions";
import { FileText, Package, User, Clock, Info } from "lucide-react";
import Image from "next/image";

export default async function AdminRequestsPage() {
  let requests = [];
  try {
    requests = await getProductRequests();
  } catch (error) {
    // console.error(error);
  }

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
                <th className="px-6 py-4 font-medium">Specifics</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
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
                    {req.images && req.images.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {req.images.map((img: string, i: number) => (
                          <div key={i} className="relative w-8 h-8 rounded border border-border overflow-hidden">
                            <Image src={img} alt="Ref" fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div><span className="font-medium text-foreground">Color:</span> {req.color || "Any"}</div>
                      <div><span className="font-medium text-foreground">Size:</span> {req.size || "Any"}</div>
                      <div><span className="font-medium text-foreground">Qty:</span> {req.quantity}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      req.status === 'FULFILLED' ? 'bg-emerald-100 text-emerald-700' :
                      req.status === 'REVIEWED' ? 'bg-blue-100 text-blue-700' :
                      req.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {req.status}
                    </span>
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
