"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  activeIndex?: number;
  setActiveIndex?: (index: number) => void;
  overrideImage?: string | null;
}

export function ProductGallery({ images, alt, activeIndex: controlledIndex, setActiveIndex: setControlledIndex, overrideImage }: ProductGalleryProps) {
  const [localIndex, setLocalIndex] = useState(0);

  const activeIndex = controlledIndex !== undefined ? controlledIndex : localIndex;
  const setActiveIndex = setControlledIndex || setLocalIndex;

  if (!images?.length) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square md:aspect-[4/5] bg-muted rounded-2xl overflow-hidden group">
        <Image
          src={overrideImage || images[activeIndex]}
          alt={`${alt} - Image ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="object-cover transition-transform duration-500 md:group-hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2 -mb-2 snap-x">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative h-20 w-20 md:h-24 md:w-24 shrink-0 rounded-xl overflow-hidden bg-muted snap-start",
                "ring-2 ring-offset-2 transition-all duration-200",
                activeIndex === idx
                  ? "ring-foreground ring-offset-background"
                  : "ring-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={image}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 33vw, 20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
