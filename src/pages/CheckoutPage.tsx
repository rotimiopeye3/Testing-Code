'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, increment, addDoc, Timestamp } from 'firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, totalPrice, discountedPrice, coupon, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = totalPrice();
  const discountedSubtotal = discountedPrice();
  const savings = subtotal - discountedSubtotal;
  const shipping = discountedSubtotal > 150 ? 0 : 15;
  const tax = discountedSubtotal * 0.08;
  const total = discountedSubtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // If a coupon was used, increment its usedCount in Firestore
      if (coupon) {
        const q = query(collection(db, 'discounts'), where('code', '==', coupon.code));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const discountDoc = snapshot.docs[0];
          await updateDoc(doc(db, 'discounts', discountDoc.id), {
            usedCount: increment(1)
          });
        }
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create Order in Firestore
      if (user) {
        const sellerIds = Array.from(new Set(items.map(item => item.sellerId).filter(Boolean)));
        const orderData = {
          userId: user.uid,
          customerEmail: user.email,
          items: items.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            sellerId: item.sellerId || 'system',
            status: 'awaiting'
          })),
          total: total,
          status: 'pending',
          sellerIds: sellerIds.length > 0 ? sellerIds : ['system'],
          createdAt: Timestamp.now(),
          shippingAddress: {
            street: (document.getElementById('address') as HTMLInputElement).value,
            city: (document.getElementById('city') as HTMLInputElement).value,
            zip: (document.getElementById('zip') as HTMLInputElement).value,
          }
        };

        await addDoc(collection(db, 'orders'), orderData);
      }
      
      clearCart();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-8 text-black">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Contact Info */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-black">Contact Information</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" required placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" required placeholder="(555) 000-0000" />
                </div>
              </div>
            </section>

            {/* Shipping Info */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-black">Shipping Address</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" required placeholder="123 Kick St" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required placeholder="New York" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" required placeholder="10001" />
                </div>
              </div>
            </section>

            {/* Payment Info */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-black">Payment Method</h2>
              <RadioGroup defaultValue="card" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer font-bold">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex-1 cursor-pointer font-bold">PayPal</Label>
                </div>
              </RadioGroup>

              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" required placeholder="0000 0000 0000 0000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" required placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" required placeholder="000" />
                  </div>
                </div>
              </div>
            </section>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-full text-base font-bold uppercase tracking-wider" 
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
            </Button>
          </form>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border p-8 bg-secondary/10">
            <h2 className="text-xl font-bold uppercase tracking-tight mb-6 text-black">Order Summary</h2>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <img 
                      src={item.images?.[0] || 'https://picsum.photos/seed/placeholder/400/400'} 
                      alt={item.name} 
                      className="h-full w-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h4 className="text-sm font-bold text-black">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                    <p className="text-sm font-black mt-1 text-black">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold text-black">{formatPrice(subtotal)}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({coupon.code})</span>
                  <span className="font-bold">-{formatPrice(savings)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-bold text-black">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-bold text-black">{formatPrice(tax)}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-xl font-black uppercase italic text-black">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
