"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createProduct } from "../../actions";
import { Button } from "@/components/ui/Button";
import { ENV } from "@/lib/env";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface Category {
  id: string;
  name: string;
}

function ProductsAdminPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUpcoming = searchParams.get("upcoming") === "true";

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // New fields state
  const [visibleStatus, setVisibleStatus] = useState("show on store");
  const [status, setStatus] = useState(isUpcoming ? "upcoming" : "active");
  const [expectedArrivalDate, setExpectedArrivalDate] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [sourceNumber, setSourceNumber] = useState("");
  const [sourceAddress, setSourceAddress] = useState("");
  
  // Variations state: array of { type: string, options: { name: string, imageFile: File | null }[] }
  const [variations, setVariations] = useState<{ type: string; options: { name: string; imageFile: File | null }[] }[]>([]);

  // Specifications state: array of { key: string, value: string }
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);

  // Description state for rich text
  const [description, setDescription] = useState("");

  // Images state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);

  useEffect(() => {
    // Fetch categories from the public endpoint for the dropdown
    fetch(`${ENV.NEXT_PUBLIC_API_URL}/products/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

  const handleAddVariation = () => {
    setVariations([...variations, { type: "", options: [{ name: "", imageFile: null }] }]);
  };

  const updateVariationType = (index: number, value: string) => {
    const newVars = [...variations];
    newVars[index].type = value;
    setVariations(newVars);
  };

  const addVariationOption = (varIndex: number) => {
    const newVars = [...variations];
    newVars[varIndex].options.push({ name: "", imageFile: null });
    setVariations(newVars);
  };

  const updateVariationOption = (varIndex: number, optIndex: number, field: "name" | "imageFile", value: any) => {
    const newVars = [...variations];
    newVars[varIndex].options[optIndex] = { ...newVars[varIndex].options[optIndex], [field]: value };
    setVariations(newVars);
  };

  const removeVariationOption = (varIndex: number, optIndex: number) => {
    const newVars = [...variations];
    newVars[varIndex].options = newVars[varIndex].options.filter((_, i) => i !== optIndex);
    setVariations(newVars);
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const updateSpecification = (index: number, field: "key" | "value", value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
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
    
    // Capture form data synchronously before any awaits!
    const formData = new FormData(e.currentTarget);
    const formElement = e.currentTarget;

    try {
      if (selectedFiles.length === 0) {
        throw new Error("Please select at least one image");
      }

      // 1. Upload files
      const uploadFormData = new FormData();
      selectedFiles.forEach(file => uploadFormData.append('files', file));
      uploadFormData.append('folder', 'product');
      
      const uploadRes = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/upload`, {
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
      const name = formData.get("name") as string;
      const slug = formData.get("slug") as string;
      const price = parseFloat(formData.get("price") as string);
      const categoryId = formData.get("categoryId") as string;
      const stock = parseInt(formData.get("stock") as string, 10);

      // Format variations JSON and upload variation images
      const formattedVariations = [];
      for (const v of variations) {
        if (!v.type) continue;
        const formattedOptions = [];
        for (const opt of v.options) {
          if (!opt.name) continue;
          let imageUrl = null;
          if (opt.imageFile) {
             const vForm = new FormData();
             vForm.append("files", opt.imageFile);
             vForm.append("folder", "product");
             const vRes = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/upload`, { method: "POST", body: vForm });
             if (vRes.ok) {
               const vData = await vRes.json();
               imageUrl = vData.urls[0];
             }
          }
          formattedOptions.push({ name: opt.name, image: imageUrl });
        }
        if (formattedOptions.length > 0) {
          formattedVariations.push({ type: v.type, options: formattedOptions });
        }
      }

      // Format specifications JSON
      const formattedSpecifications = specifications
        .filter(s => s.key && s.value)
        .map(s => ({ key: s.key, value: s.value }));

      const data = {
        name,
        slug,
        description, // from state
        price,
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
        visibleStatus,
        status,
        sourceInfo: (sourceName || sourceNumber || sourceAddress) ? { name: sourceName, number: sourceNumber, address: sourceAddress } : null,
        imageUrl: mainImageUrl,
        images: imageUrls,
        categoryId,
        stock,
        variants: formattedVariations.length > 0 ? formattedVariations : null,
        specifications: formattedSpecifications.length > 0 ? formattedSpecifications : null,
        expectedArrivalDate: expectedArrivalDate ? new Date(expectedArrivalDate).toISOString() : null,
      };

      await createProduct(data);
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/dashboard/products");
      }, 1500);
      formElement.reset();
      setDescription("");
      setVariations([]);
      setSpecifications([]);
      setSelectedFiles([]);
      setPreviews([]);
      setOfferPrice("");
      setSourceName("");
      setSourceNumber("");
      setSourceAddress("");
      setVisibleStatus("show on store");
      setStatus("active");
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
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard/products" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Create Product</h1>
        </div>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Offer Price (৳) (Optional)</label>
              <input value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} type="number" step="0.01" className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Visibility Status</label>
              <select value={visibleStatus} onChange={(e) => setVisibleStatus(e.target.value)} className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                <option value="show on store">Show on Store</option>
                <option value="not show">Not Show</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="block">Block</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
            {status === "upcoming" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Expected Coming Date</label>
                <input value={expectedArrivalDate} onChange={(e) => setExpectedArrivalDate(e.target.value)} type="date" required className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
              </div>
            )}
          </div>
          
          <div className="space-y-4 border-t border-border pt-4">
            <h3 className="text-sm font-bold">Source Info (Admin Only)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">Source Name</label>
                <input value={sourceName} onChange={(e) => setSourceName(e.target.value)} type="text" className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Source Number</label>
                <input value={sourceNumber} onChange={(e) => setSourceNumber(e.target.value)} type="text" className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Source Address</label>
                <input value={sourceAddress} onChange={(e) => setSourceAddress(e.target.value)} type="text" className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm" />
              </div>
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
            <div className="bg-background rounded-md border border-border">
              <ReactQuill theme="snow" value={description} onChange={setDescription} className="h-64 mb-12" />
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Variations (Optional)</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddVariation}>
                + Add Variation
              </Button>
            </div>
            
            {variations.map((variation, varIndex) => (
              <div key={varIndex} className="p-4 border border-border rounded-lg bg-muted/10 space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="space-y-2 flex-1">
                    <label className="text-xs font-medium">Variation Type (e.g. Size, Color)</label>
                    <input 
                      type="text" 
                      value={variation.type}
                      onChange={(e) => updateVariationType(varIndex, e.target.value)}
                      className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm" 
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={() => removeVariation(varIndex)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9">
                    Remove Type
                  </Button>
                </div>
                
                <div className="space-y-3 pl-4 border-l-2 border-border/50">
                  <label className="text-xs font-medium text-muted-foreground block">Options</label>
                  {variation.options.map((opt, optIndex) => (
                    <div key={optIndex} className="flex gap-3 items-center">
                      <input 
                        type="text"
                        placeholder="Name (e.g. Red, XL)"
                        value={opt.name}
                        onChange={(e) => updateVariationOption(varIndex, optIndex, "name", e.target.value)}
                        className="flex h-9 w-full max-w-[200px] rounded-md border border-border bg-background px-3 py-1 text-sm" 
                      />
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            updateVariationOption(varIndex, optIndex, "imageFile", e.target.files[0]);
                          }
                        }}
                        className="flex h-9 max-w-[250px] rounded-md border border-border bg-background px-3 py-1 text-xs file:border-0 file:bg-transparent file:text-xs file:font-medium hover:file:cursor-pointer"
                      />
                      {variation.options.length > 1 && (
                        <button type="button" onClick={() => removeVariationOption(varIndex, optIndex)} className="text-red-500 text-xs hover:underline">
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="ghost" size="sm" onClick={() => addVariationOption(varIndex)} className="text-xs h-8">
                    + Add Option
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Specifications (Optional)</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddSpecification}>
                + Add Specification
              </Button>
            </div>
            
            {specifications.map((spec, index) => (
              <div key={index} className="flex gap-4 items-end p-4 border border-border rounded-lg bg-muted/10">
                <div className="space-y-2 flex-1">
                  <label className="text-xs font-medium">Key (e.g. Material)</label>
                  <input 
                    type="text" 
                    value={spec.key}
                    onChange={(e) => updateSpecification(index, "key", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm" 
                  />
                </div>
                <div className="space-y-2 flex-2 w-full">
                  <label className="text-xs font-medium">Value (e.g. Cotton)</label>
                  <input 
                    type="text" 
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, "value", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm" 
                  />
                </div>
                <Button type="button" variant="outline" onClick={() => removeSpecification(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9">
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

export default function ProductsAdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsAdminPageContent />
    </Suspense>
  );
}
