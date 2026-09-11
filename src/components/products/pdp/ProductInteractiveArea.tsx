"use client";

import { useState } from "react";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { VariantSelector } from "./VariantSelector";
import { PurchaseActions } from "./PurchaseActions";
import { TrustFeatures } from "./TrustFeatures";
import { ProductDetails } from "./ProductDetails";
import { ProductInteractions } from "./ProductInteractions";
import { Product } from "@/types/product";

interface ProductInteractiveAreaProps {
  product: Product;
}

export function ProductInteractiveArea({ product }: ProductInteractiveAreaProps) {
  const defaultImages = product.images?.length > 0 ? product.images : [product.imageUrl];
  const [activeIndex, setActiveIndex] = useState(0);
  const [overrideImage, setOverrideImage] = useState<string | null>(null);

  const handleVariantSelect = (imageUrl?: string) => {
    if (!imageUrl) {
      setOverrideImage(null);
      return;
    }
    
    const idx = defaultImages.indexOf(imageUrl);
    if (idx !== -1) {
      setActiveIndex(idx);
      setOverrideImage(null);
    } else {
      setOverrideImage(imageUrl);
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-12 lg:gap-16">
      {/* Top Section - Gallery & Product Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 xl:gap-16 items-start">
        {/* Left Column - Gallery (40%) */}
        <div className="lg:col-span-2 lg:sticky lg:top-24 self-start">
          <ProductGallery 
            images={defaultImages} 
            alt={product.name} 
            activeIndex={activeIndex}
            setActiveIndex={(idx) => {
              setActiveIndex(idx);
              setOverrideImage(null);
            }}
            overrideImage={overrideImage}
          />
        </div>

        {/* Right Column - Product Info & Purchasing (60%) */}
        <div className="lg:col-span-3 flex flex-col">
          <ProductInfo
            title={product.name}
            brand={product.brand}
            price={product.price}
            originalPrice={product.originalPrice}
            offerPrice={product.offerPrice}
            discountExpiryDate={product.discountExpiryDate}
            rating={product.rating}
            reviewCount={product.reviewCount}
            isNew={product.isNew}
          />

          {product.status === "upcoming" && product.expectedArrivalDate && (
            <div className="mt-4 p-4 rounded-lg bg-blue-50/50 border border-blue-100 text-blue-800">
              <h3 className="font-semibold mb-1">Coming Soon</h3>
              <p className="text-sm">Expected Arrival: {new Date(product.expectedArrivalDate).toLocaleDateString()}</p>
            </div>
          )}

          {product.variants && product.variants.length > 0 && (
            <div className="mt-6">
              <VariantSelector 
                variants={product.variants} 
                onVariantChange={(type, opt) => handleVariantSelect(opt.image || undefined)} 
              />
            </div>
          )}

          <PurchaseActions product={product} />
          <TrustFeatures />
          <ProductInteractions product={product} />
        </div>
      </div>

      {/* Bottom Section - Full Width Product Details */}
      <div className="w-full border-t border-border pt-10">
        <ProductDetails
          description={product.description}
          features={product.features}
          specifications={product.specifications}
        />
      </div>
    </div>
  );
}
