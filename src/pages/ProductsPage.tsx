import React from 'react';
import { FilterSidebar } from '@/components/product/FilterSidebar';
import { ProductListingContent } from '@/components/product/ProductListingContent';

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Sidebar - Hidden on mobile, but can be added via a drawer later */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <FilterSidebar />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <ProductListingContent />
        </main>
      </div>
    </div>
  );
}
