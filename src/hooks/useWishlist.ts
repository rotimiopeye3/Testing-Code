import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, query, where, serverTimestamp, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import { handleFirestoreError, OperationType } from '@/lib/firebase-utils';

export interface WishlistItem {
  id: string;
  productId: string;
  createdAt: any;
}

export function useWishlist() {
  const { user } = useAuthStore();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    const path = `users/${user.uid}/wishlist`;
    const unsub = onSnapshot(collection(db, path), (snapshot) => {
      setWishlist(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WishlistItem)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsub();
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    if (!user) return;
    const path = `users/${user.uid}/wishlist`;
    
    try {
      const q = query(collection(db, path), where('productId', '==', productId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        await addDoc(collection(db, path), {
          productId,
          createdAt: serverTimestamp()
        });
      } else {
        await deleteDoc(doc(db, path, snapshot.docs[0].id));
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.productId === productId);
  };

  return { wishlist, loading, toggleWishlist, isInWishlist };
}
