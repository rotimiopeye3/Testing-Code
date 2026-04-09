'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';

export function CartButton() {
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <Link 
      id="cart-button"
      to="/cart" 
      className="group relative p-2 transition-colors hover:bg-secondary rounded-full"
      aria-label="View Cart"
    >
      <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
      {totalItems > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
