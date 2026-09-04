"use client";

import { useState, useEffect } from "react";
import { createCategory } from "../actions";
import { Button } from "@/components/ui/Button";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  parentId: string | null;
}

export default function CategoriesAdminPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3005/products/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const parentId = formData.get("parentId") as string;

    try {
      await createCategory({ 
        name, 
        slug, 
        imageUrl: imageUrl || null,
        parentId: parentId || null
      });
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      fetchCategories(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Build tree for UI
  const renderCategoryTree = (parentId: string | null, level = 0) => {
    const children = categories.filter(c => c.parentId === parentId);
    if (children.length === 0) return null;

    return (
      <ul className={level > 0 ? "pl-6 mt-2 space-y-2 border-l-2 border-muted" : "space-y-4"}>
        {children.map(child => (
          <li key={child.id}>
            <div className="flex items-center gap-3 bg-card p-3 rounded-lg border border-border shadow-sm">
              {child.imageUrl && (
                <img src={child.imageUrl} alt={child.name} className="w-10 h-10 rounded-md object-cover" />
              )}
              <div>
                <p className="font-medium">{child.name}</p>
                <p className="text-xs text-muted-foreground">/{child.slug}</p>
              </div>
            </div>
            {renderCategoryTree(child.id, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manage Categories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Form */}
        <div className="bg-background rounded-2xl p-6 shadow-sm border border-border h-fit">
          <h2 className="text-lg font-bold mb-4">Create New Category</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name</label>
              <input 
                name="name" 
                required 
                type="text" 
                className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
                placeholder="e.g. Electronics" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug (URL friendly)</label>
              <input 
                name="slug" 
                required 
                type="text" 
                className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
                placeholder="e.g. electronics" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL (Optional)</label>
              <input 
                name="imageUrl" 
                type="url" 
                className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
                placeholder="https://..." 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Parent Category (Optional)</label>
              <select 
                name="parentId" 
                className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <option value="">None (Top Level)</option>
                {categories?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
            {success && <p className="text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg">Category created successfully!</p>}

            <Button type="submit" disabled={loading} className="w-full mt-4">
              {loading ? "Creating..." : "Create Category"}
            </Button>
          </form>
        </div>

        {/* Category List */}
        <div className="bg-background rounded-2xl p-6 shadow-sm border border-border">
          <h2 className="text-lg font-bold mb-4">Category Tree</h2>
          {loadingCategories ? (
            <p className="text-sm text-muted-foreground">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories found.</p>
          ) : (
            renderCategoryTree(null)
          )}
        </div>
      </div>
    </div>
  );
}
