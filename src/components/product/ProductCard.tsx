'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useState } from 'react';

import { Product } from '@/types';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/useCartStore';
import { useAnimationStore } from '@/store/useAnimationStore';

export interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const triggerCartAnimation = useAnimationStore((state) => state.triggerCartAnimation);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Trigger animation
    const rect = e.currentTarget.getBoundingClientRect();
    const mainImage = product.images?.[0] || 'https://picsum.photos/seed/placeholder/400/400';
    triggerCartAnimation({ x: rect.left, y: rect.top }, mainImage);

    addItem({
      ...product,
      selectedSize: product.sizes?.[0] || 0,
      quantity: 1,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary/50">
        <Link to={`/products/${product.id}`} className="block h-full w-full">
          <img
            src={product.images?.[0] || 'https://picsum.photos/seed/placeholder/400/400'}
            alt={product.name}
            className={cn(
              "h-full w-full object-cover transition-transform duration-700 ease-in-out",
              isHovered ? "scale-110" : "scale-100"
            )}
            referrerPolicy="no-referrer"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isFeatured && (
            <Badge className="bg-primary text-primary-foreground font-bold uppercase tracking-wider">
              Featured
            </Badge>
          )}
          {product.price < 150 && (
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-black">
              Best Seller
            </Badge>
          )}
        </div>

        <button className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-black backdrop-blur-sm transition-colors hover:bg-white hover:text-red-500">
          <Heart className="h-4 w-4" />
        </button>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-0 bottom-0 p-4"
            >
              <Button 
                onClick={handleQuickAdd}
                className="w-full rounded-full shadow-lg" 
                size="sm"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Quick Add
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            {product.brand}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{product.rating}</span>
          </div>
        </div>
        
        <Link 
          to={`/products/${product.id}`}
          className="text-sm font-bold leading-tight hover:underline underline-offset-4 decoration-2"
        >
          {product.name}
        </Link>
        
        <p className="text-sm font-medium text-muted-foreground">
          {product.category}
        </p>
        
        <p className="mt-1 text-base font-black">
          {formatPrice(product.price)}
        </p>
      </div>
    </motion.div>
  );
}
