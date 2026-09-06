"use client";

import { useState, useEffect, Suspense, useRef, Fragment } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteProduct, updateProduct, createProduct } from "../actions";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { Plus, Edit, Trash2, Search, Package, MoreVertical, X } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  imageUrl: string;
  category?: { name: string };
  isNew: boolean;
  isTrending: boolean;
  status: string;
  visibleStatus: string;
  offerPrice: number | null;
  discountExpiryDate: string | null;
  expectedArrivalDate: string | null;
  description?: string;
  variants?: any[];
  specifications?: any[];
  newArrivalOrder?: number;
  discountOrder?: number;
}

const TABS = [
  { id: "all", label: "All Products" },
  { id: "new", label: "New Arrivals" },
  { id: "discount", label: "Discounted" },
  { id: "upcoming", label: "Upcoming" },
];

function ProductsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const activeTab = searchParams.get("filter") || "all";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [discountModalProduct, setDiscountModalProduct] = useState<Product | null>(null);

  // States for Modals
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountExpiry, setDiscountExpiry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = new URL("http://localhost:3005/products");
      url.searchParams.set("limit", "10");
      url.searchParams.set("page", currentPage.toString());
      if (activeTab !== "all") {
        url.searchParams.set("filter", activeTab);
      }

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeTab, currentPage]);

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tabId === "all") {
      params.delete("filter");
    } else {
      params.set("filter", tabId);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setDeletingId(id);
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleNewArrival = async (product: Product) => {
    setActiveMenuId(null);
    try {
      await updateProduct(product.id, { isNew: !product.isNew });
      fetchProducts();
    } catch (err: any) {
      alert(err.message || "Failed to update product");
    }
  };

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountModalProduct) return;
    setIsSubmitting(true);
    try {
      await updateProduct(discountModalProduct.id, {
        offerPrice: parseFloat(discountAmount),
        discountExpiryDate: discountExpiry ? new Date(discountExpiry).toISOString() : null,
      });
      setDiscountModalProduct(null);
      setDiscountAmount("");
      setDiscountExpiry("");
      fetchProducts();
    } catch (err: any) {
      alert(err.message || "Failed to apply discount");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwapOrder = async (product: Product, direction: "up" | "down", index: number) => {
    // Assuming products array is already sorted based on order
    const swapTargetIndex = direction === "up" ? index - 1 : index + 1;
    if (swapTargetIndex < 0 || swapTargetIndex >= products.length) return;
    
    const targetProduct = products[swapTargetIndex];
    
    try {
      if (activeTab === "new") {
        const orderA = product.newArrivalOrder || index;
        const orderB = targetProduct.newArrivalOrder || swapTargetIndex;
        // Swap them
        await Promise.all([
          updateProduct(product.id, { newArrivalOrder: orderB }),
          updateProduct(targetProduct.id, { newArrivalOrder: orderA })
        ]);
      } else if (activeTab === "discount") {
        const orderA = product.discountOrder || index;
        const orderB = targetProduct.discountOrder || swapTargetIndex;
        await Promise.all([
          updateProduct(product.id, { discountOrder: orderB }),
          updateProduct(targetProduct.id, { discountOrder: orderA })
        ]);
      }
      fetchProducts();
    } catch (err: any) {
      alert("Failed to swap order");
    }
  };

  const handleRemoveFromList = async (product: Product) => {
    try {
      if (activeTab === "new") {
        await updateProduct(product.id, { isNew: false });
      } else if (activeTab === "discount") {
        await updateProduct(product.id, { offerPrice: null, discountExpiryDate: null });
      }
      fetchProducts();
    } catch (err) {
      alert("Failed to remove product from list");
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your store's inventory</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === "upcoming" && (
            <Link href="/admin/dashboard/products/create?upcoming=true">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4" /> Create Upcoming Product
              </Button>
            </Link>
          )}
          <Link href="/admin/dashboard/products/create">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add New Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-border gap-4">
          <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 bg-muted rounded-md flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                  <div className="w-16 h-4 bg-muted rounded" />
                  <div className="w-12 h-4 bg-muted rounded" />
                  <div className="w-20 h-6 bg-muted rounded-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-1">No products found</h3>
              <p className="text-muted-foreground mb-4">No products match your current filters.</p>
              {activeTab !== "all" && (
                <Button variant="outline" onClick={() => handleTabChange("all")}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Inventory</th>
                  <th className="px-6 py-4 font-medium">Status & Visibility</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product, idx) => (
                  <Fragment key={product.id}>
                    <tr 
                      onClick={() => router.push(`/admin/dashboard/products/${product.id}`)}
                      className="hover:bg-muted/30 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="48px" />
                          ) : (
                            <Package className="w-6 h-6 m-auto mt-3 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {product.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ৳{product.price.toFixed(2)}
                      {product.offerPrice && (
                        <div className="text-[10px] text-green-600 font-bold">Offer: ৳{product.offerPrice.toFixed(2)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      {product.stock > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase w-max ${
                          product.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                          product.status === 'restricted' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {product.status || 'Active'}
                        </span>
                        {product.isNew && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase w-max bg-purple-100 text-purple-700">
                            New Arrival
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 relative" onClick={(e) => e.stopPropagation()}>
                        {activeTab === "new" || activeTab === "discount" ? (
                          <>
                            <div className="flex flex-col gap-0 border border-border rounded overflow-hidden mr-2">
                              <button 
                                onClick={() => handleSwapOrder(product, "up", idx)}
                                disabled={idx === 0}
                                className="px-2 py-0.5 bg-muted hover:bg-muted/80 disabled:opacity-30 border-b border-border text-xs"
                              >
                                ▲
                              </button>
                              <button 
                                onClick={() => handleSwapOrder(product, "down", idx)}
                                disabled={idx === products.length - 1}
                                className="px-2 py-0.5 bg-muted hover:bg-muted/80 disabled:opacity-30 text-xs"
                              >
                                ▼
                              </button>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRemoveFromList(product)}
                              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-transparent hover:border-red-200"
                            >
                              Remove
                            </Button>
                          </>
                        ) : (
                          <>
                            <Link href={`/admin/dashboard/products/${product.id}/edit`}>
                              <Button variant="outline" size="sm" className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-transparent hover:border-blue-200">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDelete(product.id)}
                              disabled={deletingId === product.id}
                              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-transparent hover:border-red-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>

                            <div className="relative">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setActiveMenuId(activeMenuId === product.id ? null : product.id)}
                                className="h-8 px-2 border-transparent hover:border-border hover:bg-muted"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                              
                              {activeMenuId === product.id && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                                  <div className="absolute right-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg z-20 py-1 overflow-hidden">
                                    <button
                                      onClick={() => handleToggleNewArrival(product)}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                                    >
                                      {product.isNew ? "Remove from New Arrivals" : "Send to New Arrival"}
                                    </button>
                                    <button
                                      onClick={() => {
                                        setDiscountModalProduct(product);
                                        setActiveMenuId(null);
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                                    >
                                      Send to Discount
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {!loading && products.length > 0 && (
          <div className="px-6 pb-6">
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        )}
      </div>

      {/* Discount Modal removed for brevity in chunking, wait no, keeping Discount Modal, but removing Upcoming Modal */}
      {discountModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-bold text-lg">Apply Discount</h3>
              <button onClick={() => setDiscountModalProduct(null)} className="p-1 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleApplyDiscount} className="p-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-4">Applying discount to: <span className="font-semibold text-foreground">{discountModalProduct.name}</span></p>
                
                <label className="block text-sm font-medium mb-1">New Offer Price (৳)</label>
                <input 
                  type="number" 
                  required
                  step="0.01"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 99.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount Expiry Date</label>
                <input 
                  type="datetime-local" 
                  required
                  value={discountExpiry}
                  onChange={(e) => setDiscountExpiry(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => setDiscountModalProduct(null)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Applying..." : "Apply Discount"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsListPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse">Loading dashboard...</div>}>
      <ProductsListContent />
    </Suspense>
  );
}
