'use client';

import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ProductGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnails */}
      <div className="flex flex-row gap-4 md:flex-col">
        {(images || []).map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={cn(
              "relative aspect-square w-20 overflow-hidden rounded-lg border-2 bg-secondary transition-all",
              selectedImage === idx ? "border-primary" : "border-transparent hover:border-gray-300"
            )}
          >
            <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-2xl bg-secondary">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <img
              src={images?.[selectedImage] || 'https://picsum.photos/seed/placeholder/400/400'}
              alt="Product Main Image"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
