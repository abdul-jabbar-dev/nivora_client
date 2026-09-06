import { getProductWithAnalytics } from "../../actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, DollarSign, TrendingUp, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminProductPage({ params }: PageProps) {
  const { id } = await params;
  
  let data;
  try {
    data = await getProductWithAnalytics(id);
  } catch (err) {
    notFound();
  }

  const { product, analytics, recentPurchases } = data;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between bg-card p-6 rounded-lg border border-border">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/products" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
              ) : (
                <Package className="w-8 h-8 m-auto mt-4 text-muted-foreground" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
              <div className="text-sm text-muted-foreground flex gap-3 mt-1">
                <span>{product.slug}</span>
                <span>•</span>
                <span className="capitalize">{product.category?.name || "Uncategorized"}</span>
                <span>•</span>
                <span className={`uppercase font-bold text-[10px] px-2 py-0.5 rounded-full ${
                  product.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                  product.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                  'bg-rose-100 text-rose-700'
                }`}>
                  {product.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/dashboard/products/${product.id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" /> Edit Product
            </Button>
          </Link>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border flex items-start gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Current Stock</p>
            <h3 className="text-2xl font-bold text-foreground">{product.stock}</h3>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg border border-border flex items-start gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Sold</p>
            <h3 className="text-2xl font-bold text-foreground">{analytics.totalSold}</h3>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg border border-border flex items-start gap-4">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
            <h3 className="text-2xl font-bold text-foreground">৳{analytics.totalRevenue.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">Description</h2>
            {product.description ? (
              <div 
                className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="text-muted-foreground italic text-sm">No description provided.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">Pricing</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Standard Price</span>
                <span className="font-medium text-foreground">৳{product.price.toFixed(2)}</span>
              </div>
              {product.originalPrice && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original Price</span>
                  <span className="font-medium text-foreground line-through">৳{product.originalPrice.toFixed(2)}</span>
                </div>
              )}
              {product.offerPrice && (
                <div className="flex justify-between text-green-600 font-medium pt-2 border-t border-border">
                  <span>Offer Price</span>
                  <span>৳{product.offerPrice.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {product.specifications && product.specifications.length > 0 && (
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">Specifications</h2>
              <ul className="space-y-2 text-sm">
                {product.specifications.map((spec: any, idx: number) => (
                  <li key={idx} className="flex flex-col">
                    <span className="font-medium text-foreground">{spec.key}</span>
                    <span className="text-muted-foreground">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.variants && product.variants.length > 0 && (
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">Variants</h2>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any, idx: number) => (
                  <span key={idx} className="px-2.5 py-1 text-xs rounded-md bg-secondary text-secondary-foreground border border-border">
                    {v.type}: {v.value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Purchases Table */}
      <div className="bg-card p-6 rounded-lg border border-border mt-6">
        <h2 className="text-lg font-bold text-foreground mb-6">Recent Purchases</h2>
        
        {recentPurchases && recentPurchases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Buyer</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Quantity</th>
                  <th className="px-6 py-4 font-medium">Amount Paid</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentPurchases.map((purchase: any) => (
                  <tr key={purchase.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{purchase.buyerName}</div>
                      <div className="text-xs text-muted-foreground">{purchase.buyerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(purchase.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {purchase.quantity}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ৳{purchase.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        purchase.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                        purchase.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                        purchase.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {purchase.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-1">No Purchases Yet</h3>
            <p className="text-muted-foreground">This product hasn't generated any sales yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
