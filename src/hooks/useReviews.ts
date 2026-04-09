import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firebase-utils';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export function useReviews(productId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const path = `products/${productId}/reviews`;
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsub();
  }, [productId]);

  const addReview = async (reviewData: Omit<Review, 'id' | 'productId' | 'createdAt'>) => {
    const path = `products/${productId}/reviews`;
    try {
      await addDoc(collection(db, path), {
        ...reviewData,
        productId,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  return { reviews, loading, addReview };
}
