import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '@/types';
import { fetchProducts } from '@/lib/mock-api';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWishlistProducts = async () => {
      if (wishlistLoading) return;
      setLoading(true);
      
      try {
        const mockProducts = await fetchProducts({});
        const wishlistProducts: Product[] = [];

        for (const item of wishlist) {
          // Try mock first
          const mockMatch = mockProducts.find(p => p.id === item.productId);
          if (mockMatch) {
            wishlistProducts.push(mockMatch);
          } else {
            // Try Firestore
            const docRef = doc(db, 'products', item.productId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              wishlistProducts.push({ id: docSnap.id, ...docSnap.data() } as Product);
            }
          }
        }
        setProducts(wishlistProducts);
      } catch (error) {
        console.error("Error loading wishlist products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlistProducts();
  }, [wishlist, wishlistLoading]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary fill-primary" />
              </div>
              <h1 className="text-5xl font-black uppercase italic tracking-tighter">My Wishlist</h1>
            </div>
            <p className="text-muted-foreground font-medium max-w-md">
              Save your favorite items and track them here. We'll notify you if they go on sale!
            </p>
          </div>
          <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-3xl border">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Items</p>
              <p className="text-2xl font-black">{products.length}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/5] rounded-[2rem] bg-secondary animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-8">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-10 max-w-sm font-medium">
              Start exploring our collection and tap the heart icon to save items you love.
            </p>
            <Button 
              size="lg" 
              className="rounded-full h-14 px-10 font-bold uppercase tracking-widest"
              onClick={() => navigate('/products')}
            >
              Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group"
                >
                  <ProductCard product={product} />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-destructive hover:scale-110 transition-transform z-10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Suggested Section */}
        {products.length > 0 && (
          <div className="mt-32">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">You Might Also Like</h2>
              <Button variant="ghost" className="rounded-full font-bold uppercase tracking-widest" onClick={() => navigate('/products')}>
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            {/* We could add a horizontal scroll of related products here */}
          </div>
        )}
      </div>
    </div>
  );
}
