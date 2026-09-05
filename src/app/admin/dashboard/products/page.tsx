"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { deleteProduct } from "../actions";
import { Button } from "@/components/ui/Button";
import { Plus, Edit, Trash2, Search, Package } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  imageUrl: string;
  category?: { name: string };
  isTrending: boolean;
  status: string;
  visibleStatus: string;
}

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3005/products?limit=100"); // higher limit for admin
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your store's inventory</p>
        </div>
        <Link href="/admin/dashboard/products/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Product
          </Button>
        </Link>
      </div>

      <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading products...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-1">No products found</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first product.</p>
              <Link href="/admin/dashboard/products/create">
                <Button>Add New Product</Button>
              </Link>
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
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
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
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase w-max ${
                          product.visibleStatus === 'not show' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {product.visibleStatus || 'Show'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
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
