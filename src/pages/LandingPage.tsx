import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Hero } from '@/components/home/Hero';
import { CategoryHighlights } from '@/components/home/CategoryHighlights';
import { ProductCard } from '@/components/product/ProductCard';
import { fetchProducts } from '@/lib/mock-api';
import { useAdminProducts } from '@/hooks/useProducts';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function LandingPage() {
  const { data: mockProducts } = useQuery({
    queryKey: ['products', { featured: true }],
    queryFn: () => fetchProducts({ sort: 'rating' }),
  });

  const { products: firestoreProducts } = useAdminProducts();

  // Merge products
  const allProducts = [...(mockProducts || []), ...firestoreProducts];

  const featuredProducts = allProducts.filter(p => p.isFeatured).slice(0, 4);
  const newReleases = allProducts.filter(p => p.isNewRelease).slice(0, 4);
  
  const clothes = allProducts.filter(p => p.category === 'Clothing').slice(0, 4);
  const watches = allProducts.filter(p => p.category === 'Watch').slice(0, 4);
  const singlets = allProducts.filter(p => p.category === 'Singlet').slice(0, 4);
  const boxers = allProducts.filter(p => p.category === 'Boxers').slice(0, 4);

  const renderSection = (title: string, items: any[]) => {
    if (items.length === 0) return null;
    return (
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="container mx-auto px-4"
      >
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">{title}</h2>
          <button className="text-sm font-bold uppercase tracking-wider hover:underline underline-offset-4">
            Shop All
          </button>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </motion.section>
    );
  };

  return (
    <div className="flex flex-col gap-20 pb-20">
      <Hero />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <CategoryHighlights />
      </motion.div>

      {renderSection("New Releases", newReleases)}
      {renderSection("Clothes", clothes)}
      {renderSection("Watches", watches)}
      {renderSection("Singlets", singlets)}
      {renderSection("Boxers", boxers)}
      {renderSection("Featured Drops", featuredProducts)}

      {/* Promotional Banner */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="container mx-auto px-4"
      >
        <div className="relative w-full overflow-hidden rounded-[3rem] bg-black px-8 py-20 text-white md:px-20">
          <div className="relative z-10 max-w-lg">
            <h2 className="text-5xl font-black uppercase italic leading-none tracking-tighter md:text-7xl">
              Join the <br /> Club.
            </h2>
            <p className="mt-6 text-xl text-gray-400">
              Become a member and get exclusive access to limited drops, free shipping, and more.
            </p>
            <button className="mt-10 rounded-full bg-white px-10 py-4 text-sm font-bold uppercase text-black transition-transform hover:scale-105">
              Join for Free
            </button>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000" 
            alt="Promo"
            className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-50 grayscale md:opacity-100"
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.section>
    </div>
  );
}
