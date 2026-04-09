'use client';

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const CATEGORIES = ['All', 'Men', 'Women', 'Kids', 'Running', 'Lifestyle'];
const BRANDS = ['Nike', 'Adidas', 'New Balance', 'Puma', 'Reebok'];

export function FilterSidebar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (type: string, value: string) => {
    navigate(`/products?${createQueryString(type, value)}`);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-black">Categories</h3>
        <div className="space-y-3">
          {CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox 
                id={cat} 
                checked={searchParams.get('category') === cat || (!searchParams.get('category') && cat === 'All')}
                onCheckedChange={() => handleFilterChange('category', cat)}
              />
              <Label htmlFor={cat} className="text-sm font-medium cursor-pointer">{cat}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-black">Price Range</h3>
        <Slider
          defaultValue={[500]}
          max={500}
          step={10}
          className="mt-6"
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>$0</span>
          <span>$500+</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-black">Brands</h3>
        <div className="space-y-3">
          {BRANDS.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox 
                id={brand} 
                checked={searchParams.get('brand') === brand}
                onCheckedChange={() => handleFilterChange('brand', brand)}
              />
              <Label htmlFor={brand} className="text-sm font-medium cursor-pointer">{brand}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
