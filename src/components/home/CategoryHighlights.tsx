import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Men', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800', href: '/products?category=Men' },
  { name: 'Women', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800', href: '/products?category=Women' },
  { name: 'Kids', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800', href: '/products?category=Kids' },
];

export function CategoryHighlights() {
  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="mb-12 text-5xl font-black uppercase italic tracking-tighter">Shop by Category</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {categories.map((cat) => (
          <Link key={cat.name} to={cat.href} className="group relative aspect-[4/5] overflow-hidden bg-secondary rounded-[2rem] shadow-xl">
            <img 
              src={cat.image} 
              alt={cat.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-2xl font-bold text-white">{cat.name}</h3>
              <span className="mt-2 inline-block text-sm font-medium text-white underline underline-offset-4">Shop Now</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
