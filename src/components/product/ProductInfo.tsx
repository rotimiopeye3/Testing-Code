'use client';

import React from 'react';
import { useState } from 'react';
import { Star, Ruler, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { useAnimationStore } from '@/store/useAnimationStore';

import { useWishlist } from '@/hooks/useWishlist';

export function ProductInfo({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const triggerCartAnimation = useAnimationStore((state) => state.triggerCartAnimation);
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    // Trigger animation
    const rect = e.currentTarget.getBoundingClientRect();
    triggerCartAnimation({ x: rect.left, y: rect.top }, product.images[0]);

    addItem({ ...product, selectedSize, quantity: 1 });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {product.rating >= 4.5 && (
          <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
            Best Seller
          </div>
        )}
        {product.isNewRelease && (
          <div className="bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            New Release
          </div>
        )}
        {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
          <div className="bg-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
            Low Stock: {product.stock} Left
          </div>
        )}
        {product.stock === 0 && (
          <div className="bg-destructive text-destructive-foreground px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            Out of Stock
          </div>
        )}
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">{product.brand}</p>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-black">{product.rating} (120 Reviews)</span>
          </div>
        </div>
        <h1 className="text-4xl font-black uppercase italic leading-none tracking-tighter md:text-5xl text-black">
          {product.name}
        </h1>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-black text-muted-foreground">{formatPrice(product.price)}</p>
          {product.stock !== undefined && (
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Availability</p>
              <p className={cn("font-bold text-sm", product.stock > 0 ? "text-green-500" : "text-destructive")}>
                {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="text-base leading-relaxed text-muted-foreground">
        {product.description}
      </p>

      {/* Size Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-wider text-black">Select Size (US)</span>
          <button className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary underline underline-offset-4">
            <Ruler className="h-3 w-3" /> Size Guide
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {(product.sizes || []).map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={cn(
                "flex h-12 items-center justify-center rounded-md border-2 text-sm font-bold transition-all",
                selectedSize === size 
                  ? "border-black bg-black text-white" 
                  : "border-secondary hover:border-gray-400 text-black"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button 
          size="lg" 
          className="h-14 rounded-full text-base font-bold uppercase"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
        </Button>
        <Button 
          size="lg" 
          variant={isInWishlist(product.id) ? "secondary" : "outline"}
          className={cn("h-14 rounded-full text-base font-bold uppercase", isInWishlist(product.id) ? "text-primary" : "text-black")}
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart className={cn("mr-2 h-5 w-5", isInWishlist(product.id) && "fill-current")} /> 
          {isInWishlist(product.id) ? "In Wishlist" : "Add to Wishlist"}
        </Button>
      </div>
    </div>
  );
}
