"use client";

import { useState, useEffect } from "react";
import { createProduct } from "../actions";
import { Button } from "@/components/ui/Button";

interface Category {
  id: string;
  name: string;
}

export default function ProductsAdminPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Variations state: array of { type: string, options: string }
  const [variations, setVariations] = useState<{ type: string; options: string }[]>([]);

  // Images state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);

  useEffect(() => {
    // Fetch categories from the public endpoint for the dropdown
    fetch("http://localhost:3005/products/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

  const handleAddVariation = () => {
    setVariations([...variations, { type: "", options: "" }]);
  };

  const updateVariation = (index: number, field: "type" | "options", value: string) => {
    const newVars = [...variations];
    newVars[index][field] = value;
    setVariations(newVars);
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
      setMainImageIndex(0); // Reset to first image
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      if (selectedFiles.length === 0) {
        throw new Error("Please select at least one image");
      }

      // 1. Upload files
      const uploadFormData = new FormData();
      selectedFiles.forEach(file => uploadFormData.append('files', file));
      
      const uploadRes = await fetch("http://localhost:3005/upload", {
        method: "POST",
        body: uploadFormData,
      });
      
      if (!uploadRes.ok) {
        throw new Error("Failed to upload images");
      }
      
      const uploadData = await uploadRes.json();
      const imageUrls = uploadData.urls;
      const mainImageUrl = imageUrls[mainImageIndex] || imageUrls[0];

      // 2. Submit Product
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const slug = formData.get("slug") as string;
      const description = formData.get("description") as string;
      const price = parseFloat(formData.get("price") as string);
      const categoryId = formData.get("categoryId") as string;
      const stock = parseInt(formData.get("stock") as string, 10);

      // Format variations JSON
      const formattedVariations = variations.map(v => ({
        type: v.type,
        options: v.options.split(",").map(s => s.trim()).filter(Boolean)
      })).filter(v => v.type && v.options.length > 0);

      const data = {
        name,
        slug,
        description,
        price,
        imageUrl: mainImageUrl,
        images: imageUrls,
        categoryId,
        stock,
        variants: formattedVariations.length > 0 ? formattedVariations : null
      };

      await createProduct(data);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setVariations([]);
      setSelectedFiles([]);
      setPreviews([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const renderCategoryOptions = (parentId: string | null, level = 0): React.ReactNode[] => {
    const children = categories.filter(c => (c as any).parentId === parentId);
    return children.flatMap(child => [
      <option key={child.id} value={child.id}>
        {"\u00A0\u00A0\u00A0\u00A0".repeat(level)}{level > 0 ? "└ " : ""}{child.name}
      </option>,
      ...renderCategoryOptions(child.id, level + 1)
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manage Products</h1>
      </div>

      <div className="bg-background rounded-2xl p-6 shadow-sm border border-border">
        <h2 className="text-lg font-bold mb-4">Create New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name</label>
              <input name="name" required type="text" className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug (URL friendly)</label>
              <input name="slug" required type="text" className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (৳)</label>
              <input name="price" required type="number" step="0.01" className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock Quantity</label>
              <input name="stock" required type="number" defaultValue="10" className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select name="categoryId" required className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                <option value="">Select a category</option>
                {renderCategoryOptions(null)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Product Images</label>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              required
              onChange={handleFileChange}
              className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:file:cursor-pointer" 
            />
            
            {previews.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">Select the main thumbnail image:</p>
                <div className="flex flex-wrap gap-4">
                  {previews.map((src, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setMainImageIndex(idx)}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${mainImageIndex === idx ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent'}`}
                    >
                      <img src={src} alt={`preview-${idx}`} className="w-24 h-24 object-cover" />
                      {mainImageIndex === idx && (
                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                          MAIN
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea name="description" className="flex min-h-[100px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Variations (Optional)</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddVariation}>
                + Add Variation
              </Button>
            </div>
            
            {variations.map((variation, index) => (
              <div key={index} className="flex gap-4 items-end p-4 border border-border rounded-lg bg-muted/10">
                <div className="space-y-2 flex-1">
                  <label className="text-xs font-medium">Type (e.g. Size, Color)</label>
                  <input 
                    type="text" 
                    value={variation.type}
                    onChange={(e) => updateVariation(index, "type", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm" 
                  />
                </div>
                <div className="space-y-2 flex-2 w-full">
                  <label className="text-xs font-medium">Options (comma separated, e.g. S, M, L)</label>
                  <input 
                    type="text" 
                    value={variation.options}
                    onChange={(e) => updateVariation(index, "options", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm" 
                  />
                </div>
                <Button type="button" variant="outline" onClick={() => removeVariation(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9">
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {error && <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
          {success && <p className="text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg">Product created successfully!</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </div>
    </div>
  );
}
