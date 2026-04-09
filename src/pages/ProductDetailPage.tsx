import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getRelatedProducts } from '@/lib/mock-api';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductReviews } from '@/components/product/ProductReviews';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setIsLoading(true);
      const p = await getProductById(id);
      if (p) {
        setProduct(p);
        const related = await getRelatedProducts(p.category, p.id);
        setRelatedProducts(related);
      }
      setIsLoading(false);
    };

    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
            <Skeleton className="h-14 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images} />
        <ProductInfo product={product} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-10 text-2xl font-bold tracking-tight text-black">You Might Also Like</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
