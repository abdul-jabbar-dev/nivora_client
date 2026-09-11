"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Billboard {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
}

export function HeroCarousel({ billboards }: { billboards: Billboard[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (billboards.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % billboards.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [billboards.length]);

  if (!billboards || billboards.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[280px] sm:h-[400px] md:h-[600px] shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Link 
            href={billboards[currentIndex].link} 
            className="block w-full h-full relative cursor-pointer"
            aria-label={billboards[currentIndex].title || "Featured banner"}
          >
            <Image 
              src={billboards[currentIndex].imageUrl} 
              alt={billboards[currentIndex].title || "Featured banner"}
              fill
              priority={currentIndex === 0}
              sizes="(max-width: 1280px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <h3 className="text-white font-bold text-xl drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {billboards[currentIndex].title}
              </h3>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      {billboards.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {billboards.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
