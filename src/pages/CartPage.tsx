'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, Tag, Loader2, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { CartItem } from '@/components/cart/CartItem';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, increment } from 'firebase/firestore';

export default function CartPage() {
  const { items, totalPrice, discountedPrice, coupon, setCoupon } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = totalPrice();
  const discountedSubtotal = discountedPrice();
  const savings = subtotal - discountedSubtotal;
  const shipping = discountedSubtotal > 150 ? 0 : 15;
  const tax = discountedSubtotal * 0.08;
  const total = discountedSubtotal + shipping + tax;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplying(true);
    setError(null);

    try {
      const q = query(collection(db, 'discounts'), where('code', '==', couponCode.toUpperCase()), where('active', '==', true));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError('Invalid or expired coupon code.');
      } else {
        const discountDoc = snapshot.docs[0];
        const data = discountDoc.data();

        if (data.usageLimit > 0 && (data.usedCount || 0) >= data.usageLimit) {
          setError('This coupon has reached its usage limit.');
        } else {
          setCoupon({ code: data.code, percentage: data.percentage });
          // Note: We'll increment usedCount on actual checkout, but for now we just validate
          setCouponCode('');
        }
      }
    } catch (err) {
      setError('Failed to apply coupon. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-secondary p-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-3xl font-black uppercase italic tracking-tighter text-black">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added any kicks yet.</p>
        <Button asChild className="mt-8 rounded-full px-8" size="lg">
          <Link to="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-10 text-black">Your Bag</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8">
          <div className="flex flex-col">
            {items.map((item) => (
              <CartItem key={`${item.id}-${item.selectedSize}`} item={item} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl bg-secondary/30 p-8">
            <h2 className="text-xl font-bold uppercase tracking-tight mb-6 text-black">Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold text-black">{formatPrice(subtotal)}</span>
              </div>
              
              {coupon && (
                <div className="flex justify-between text-sm text-green-600">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    Discount ({coupon.code})
                  </span>
                  <span className="font-bold">-{formatPrice(savings)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Shipping & Handling</span>
                <span className="font-bold text-black">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Tax</span>
                <span className="font-bold text-black">{formatPrice(tax)}</span>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between text-lg font-black uppercase italic text-black">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Coupon Input */}
            <div className="mt-8">
              {!coupon ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="PROMO CODE"
                      className="flex-1 bg-white border rounded-xl px-4 text-sm font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button 
                      onClick={handleApplyCoupon}
                      disabled={isApplying || !couponCode}
                      className="rounded-xl px-6"
                    >
                      {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                    </Button>
                  </div>
                  {error && <p className="text-[10px] font-bold text-destructive uppercase ml-2">{error}</p>}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-bold uppercase text-green-600">{coupon.code} Applied</span>
                  </div>
                  <button 
                    onClick={() => setCoupon(null)}
                    className="p-1 hover:bg-green-500/20 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-green-600" />
                  </button>
                </div>
              )}
            </div>

            <Button asChild className="w-full mt-8 h-14 rounded-full text-base font-bold uppercase tracking-wider" size="lg">
              <Link to="/checkout">
                Checkout <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Truck className="h-4 w-4" /> Free over $150
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="h-4 w-4" /> Secure Payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
