"use client";

import { useState, useEffect } from "react";
import { createCategory, updateCategory, deleteCategory, updateCategoryNav } from "../actions";
import { Button } from "@/components/ui/Button";
import { ENV } from "@/lib/env";
import { Edit, Trash2, X, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  parentId: string | null;
  showNav: boolean;
}

export default function CategoriesAdminPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Edit category states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editParentId, setEditParentId] = useState("");
  const [editShowNav, setEditShowNav] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/products/categories`);
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
    const showNav = formData.get("showNav") === "on";

    try {
      await createCategory({ 
        name, 
        slug, 
        imageUrl: imageUrl || null,
        parentId: parentId || null,
        showNav
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

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditImageUrl(cat.imageUrl || "");
    setEditParentId(cat.parentId || "");
    setEditShowNav(cat.showNav);
    setEditError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setIsUpdating(true);
    setEditError(null);
    try {
      await updateCategory(editingCategory.id, {
        name: editName,
        slug: editSlug,
        imageUrl: editImageUrl || null,
        parentId: editParentId || null,
        showNav: editShowNav,
      });
      setEditingCategory(null);
      fetchCategories();
    } catch (err: any) {
      setEditError(err.message || "Failed to update category");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? Any subcategories and products will be detached.`)) return;
    setDeletingId(id);
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleShowNav = async (id: string, currentVal: boolean) => {
    try {
      await updateCategoryNav(id, !currentVal);
      fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  // Build tree for UI
  const renderCategoryTree = (parentId: string | null, level = 0) => {
    const children = categories.filter(c => c.parentId === parentId);
    if (children.length === 0) return null;

    return (
      <ul className={level > 0 ? "pl-6 mt-2 space-y-2 border-l-2 border-muted" : "space-y-4"}>
        {children.map(child => (
          <li key={child.id}>
            <div className="flex items-center justify-between bg-card p-3 rounded-lg border border-border shadow-sm">
              <div className="flex items-center gap-3">
                {child.imageUrl && (
                  <img src={child.imageUrl} alt={child.name} className="w-10 h-10 rounded-md object-cover" />
                )}
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {child.name}
                    {child.showNav && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Nav</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">/{child.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 cursor-pointer mr-1">
                  Nav
                  <input 
                    type="checkbox" 
                    checked={child.showNav} 
                    onChange={() => toggleShowNav(child.id, child.showNav)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => startEdit(child)}
                  className="p-1.5 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                  title="Edit Category"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(child.id, child.name)}
                  disabled={deletingId === child.id}
                  className="p-1.5 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 rounded transition-colors"
                  title="Delete Category"
                >
                  {deletingId === child.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
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
            <div className="flex items-center gap-2 py-2">
              <input 
                type="checkbox" 
                id="showNav" 
                name="showNav" 
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="showNav" className="text-sm font-medium cursor-pointer">
                Show in Navigation
              </label>
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

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-2xl shadow-xl w-full max-w-md border border-border overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-lg">Edit Category</h3>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Slug (URL friendly)</label>
                <input
                  type="text"
                  required
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL (Optional)</label>
                <input
                  type="url"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Parent Category</label>
                <select
                  value={editParentId}
                  onChange={(e) => setEditParentId(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="">None (Top Level)</option>
                  {categories
                    .filter((c) => c.id !== editingCategory.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="editShowNav"
                  checked={editShowNav}
                  onChange={(e) => setEditShowNav(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="editShowNav" className="text-sm font-medium cursor-pointer">
                  Show in Navigation
                </label>
              </div>

              {editError && (
                <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg">
                  {editError}
                </p>
              )}

              <div className="pt-3 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <Button type="submit" disabled={isUpdating} className="min-w-[120px]">
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
