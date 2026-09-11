"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { deleteProduct } from "../../actions";

interface DeleteProductButtonProps {
  productId: string;
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productId);
      router.push("/admin/dashboard/products");
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleDelete}
      disabled={isDeleting}
      className="gap-2 text-red-500 border-red-500 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" /> {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
