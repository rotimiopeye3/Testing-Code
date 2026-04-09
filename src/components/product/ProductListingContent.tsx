'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchProducts } from '@/lib/mock-api';
import { ProductCard } from './ProductCard';
import { ProductSkeleton } from './ProductSkeleton';
import { useSearchStore } from '@/store/useSearchStore';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export function ProductListingContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { query } = useSearchStore();

  const currentFilters = {
    category: searchParams.get('category') || 'All',
    brand: searchParams.get('brand') || undefined,
    sort: searchParams.get('sort') || 'newest',
  };

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', currentFilters],
    queryFn: () => fetchProducts(currentFilters),
  });

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.brand.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  ) || [];

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-black">
          {currentFilters.category} Shoes 
          <span className="ml-2 text-sm font-normal normal-case italic text-muted-foreground tracking-normal">
            ({filteredProducts.length} items)
          </span>
        </h1>

        <Select onValueChange={handleSortChange} value={currentFilters.sort}>
          <SelectTrigger className="w-[180px] rounded-full">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      
      {!isLoading && filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium">No products found.</p>
          <p className="text-muted-foreground">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
