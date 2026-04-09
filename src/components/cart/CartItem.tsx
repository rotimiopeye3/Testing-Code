'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    updateQuantity(item.id, item.selectedSize, newQty);
  };

  return (
    <div className="flex gap-4 py-6 first:pt-0 last:pb-0 border-b last:border-0">
      <Link 
        to={`/products/${item.id}`} 
        className="relative aspect-square h-24 w-24 overflow-hidden rounded-lg bg-secondary sm:h-32 sm:w-32"
      >
        <img
          src={item.images?.[0] || 'https://picsum.photos/seed/placeholder/400/400'}
          alt={item.name}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-tight sm:text-lg text-black">
              <Link to={`/products/${item.id}`} className="hover:underline">
                {item.name}
              </Link>
            </h3>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{item.category}</p>
            <p className="mt-1 text-xs font-medium sm:text-sm text-black">Size: {item.selectedSize}</p>
          </div>
          <p className="text-sm font-black sm:text-base text-black">{formatPrice(item.price)}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1 rounded-full border border-secondary p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-bold text-black">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(item.id, item.selectedSize)}
          >
            <Trash2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
