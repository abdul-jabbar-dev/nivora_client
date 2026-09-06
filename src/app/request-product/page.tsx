"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Upload, X, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ENV } from "@/lib/env";

export default function RequestProductPage() {
  const { user } = useAuthStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [model, setModel] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      const name = user.user_metadata?.full_name || user.user_metadata?.first_name 
        ? `${user.user_metadata.first_name || ''} ${user.user_metadata.last_name || ''}`.trim()
        : "";
      if (name) setCustomerName(name);
      if (user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Upload images first
      const uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("files", file));
        formData.append("folder", "requests");

        const uploadRes = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.urls) {
            uploadedUrls.push(...uploadData.urls);
          }
        }
      }

      // 2. Submit request
      const payload = {
        title,
        model,
        images: uploadedUrls,
        customerName,
        customerPhone,
        color,
        size,
        quantity: parseInt(quantity, 10),
        userId: user?.id || null,
      };

      const res = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/product-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit request");
      }

      setSuccess(true);
      // Reset form
      setTitle("");
      setModel("");
      setColor("");
      setSize("");
      setQuantity("1");
      setSelectedFiles([]);
      setPreviews([]);
      if (!user) {
        setCustomerName("");
        setCustomerPhone("");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-muted/30 border-b border-border">
        <Container className="pt-32 pb-12 md:pt-40 md:pb-16">
          <Breadcrumb items={[{ label: "Request a Product", href: "/request-product" }]} />
          <h1 className="text-4xl md:text-5xl font-bold mt-6 tracking-tight">Request a Product</h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg">
            Can't find what you're looking for? Let us know, and we'll source it for you.
          </p>
        </Container>
      </div>

      <Container className="py-12 max-w-3xl">
        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 p-12 rounded-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-900">Request Submitted!</h2>
            <p className="text-emerald-700">
              Thank you for your request. Our team will look into sourcing this product and contact you soon.
            </p>
            <Button onClick={() => setSuccess(false)} variant="outline" className="mt-4">
              Submit Another Request
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 rounded-2xl border border-border shadow-sm">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b border-border pb-2">Product Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name / Title <span className="text-red-500">*</span></label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. iPhone 15 Pro Max"
                    className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Model / Version <span className="text-red-500">*</span></label>
                  <input
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. 256GB / 2023"
                    className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color (Optional)</label>
                  <input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Titanium Blue"
                    className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Size (Optional)</label>
                  <input
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. XL"
                    className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium block">Reference Images (Optional)</label>
                <div className="flex flex-wrap gap-4 items-center">
                  {previews.map((preview, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group">
                      <Image src={preview} alt="Preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors">
                    <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-[10px] text-muted-foreground font-medium">Upload</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b border-border pb-2 mt-8">Your Contact Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
                  <input
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Doe"
                    className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+8801234567890"
                    className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Button type="submit" disabled={loading} className="w-full md:w-auto md:px-12 h-12 text-base">
                {loading ? "Submitting Request..." : "Submit Product Request"}
              </Button>
            </div>
          </form>
        )}
      </Container>
    </div>
  );
}
