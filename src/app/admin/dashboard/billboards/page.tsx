"use client";

import { useState, useEffect } from "react";
import { createBillboard, deleteBillboard, getBillboards, toggleBillboardActive } from "../actions";
import { Button } from "@/components/ui/Button";
import { ENV } from "@/lib/env";

interface Billboard {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
  order: number;
}

export default function BillboardsAdminPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loadingBillboards, setLoadingBillboards] = useState(true);

  const fetchBillboards = async () => {
    try {
      const data = await getBillboards();
      if (Array.isArray(data)) {
        setBillboards(data);
      } else {
        setBillboards([]);
      }
    } catch (err) {
      console.error("Failed to fetch billboards", err);
    } finally {
      setLoadingBillboards(false);
    }
  };

  useEffect(() => {
    fetchBillboards();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const imageFile = formData.get("imageFile") as File;
    const link = formData.get("link") as string;
    const orderStr = formData.get("order") as string;
    const order = parseInt(orderStr, 10) || 0;
    const isActive = formData.get("isActive") === "on";

    let finalImageUrl = "";

    try {
      // If a file is selected, upload it first
      if (imageFile && imageFile.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append("files", imageFile);
        uploadFormData.append("folder", "billboards");

        const uploadRes = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/upload`, {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadData = await uploadRes.json();
        if (uploadData.urls && uploadData.urls.length > 0) {
          finalImageUrl = uploadData.urls[0];
        } else {
          throw new Error("No URL returned from upload service");
        }
      } else {
        throw new Error("Image file is required");
      }

      await createBillboard({ 
        title, 
        imageUrl: finalImageUrl,
        link,
        order,
        isActive
      });
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      fetchBillboards(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const toggleIsActive = async (id: string, currentVal: boolean) => {
    try {
      await toggleBillboardActive(id, currentVal);
      fetchBillboards();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this billboard?")) return;
    try {
      await deleteBillboard(id);
      fetchBillboards();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manage Billboards</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Form */}
        <div className="bg-background rounded-2xl p-6 shadow-sm border border-border h-fit">
          <h2 className="text-lg font-bold mb-4">Create New Billboard</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input 
                name="title" 
                required 
                type="text" 
                className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
                placeholder="e.g. Summer Sale" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image File</label>
              <input 
                name="imageFile" 
                required
                type="file" 
                accept="image/*"
                className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 file:border-0 file:bg-transparent file:text-sm file:font-medium" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link Page</label>
              <input 
                name="link" 
                required
                type="text" 
                className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
                placeholder="e.g. /shop?category=electronics" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Order</label>
              <input 
                name="order" 
                type="number"
                defaultValue={0}
                className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
              />
            </div>
            <div className="flex items-center gap-2 py-2">
              <input 
                type="checkbox" 
                id="isActive" 
                name="isActive"
                defaultChecked
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                Is Active
              </label>
            </div>

            {error && <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
            {success && <p className="text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg">Billboard created successfully!</p>}

            <Button type="submit" disabled={loading} className="w-full mt-4">
              {loading ? "Creating..." : "Create Billboard"}
            </Button>
          </form>
        </div>

        {/* Billboards List */}
        <div className="bg-background rounded-2xl p-6 shadow-sm border border-border">
          <h2 className="text-lg font-bold mb-4">Current Billboards</h2>
          {loadingBillboards ? (
            <p className="text-sm text-muted-foreground">Loading billboards...</p>
          ) : billboards.length === 0 ? (
            <p className="text-sm text-muted-foreground">No billboards found.</p>
          ) : (
            <ul className="space-y-4">
              {billboards.map(billboard => (
                <li key={billboard.id} className="flex flex-col gap-3 bg-card p-4 rounded-lg border border-border shadow-sm">
                  <div className="flex items-start gap-4">
                    <img src={billboard.imageUrl} alt={billboard.title} className="w-24 h-16 rounded-md object-cover border border-border" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base truncate">{billboard.title}</p>
                      <p className="text-xs text-muted-foreground truncate" title={billboard.link}>Link: {billboard.link}</p>
                      <p className="text-xs text-muted-foreground">Order: {billboard.order}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-border">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={billboard.isActive} 
                        onChange={() => toggleIsActive(billboard.id, billboard.isActive)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      Active
                    </label>
                    <button 
                      onClick={() => handleDelete(billboard.id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
