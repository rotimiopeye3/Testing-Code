import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import { handleFirestoreError, OperationType } from '@/lib/firebase-utils';

export function useUserProducts() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const path = 'products';
    const q = query(collection(db, path), where('sellerId', '==', user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => {
        const data = doc.data();
        return { ...data, id: doc.id };
      }));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsub();
  }, [user]);

  const addProduct = async (product: any) => {
    if (!user) return;
    const path = 'products';
    const newProduct = {
      ...product,
      sellerId: user.uid,
      sellerName: user.displayName,
      sellerEmail: user.email,
      createdAt: new Date().toISOString(),
      rating: 5,
      stock: product.stock || 0,
      isFeatured: false,
      isNewRelease: true
    };
    try {
      await addDoc(collection(db, path), newProduct);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const removeProduct = async (id: string) => {
    if (!user) {
      console.error('[User] No user logged in, cannot delete product');
      return;
    }
    const path = `products/${id}`;
    console.log(`[User] Attempting to delete product: ${id} by user: ${user.uid}`);
    try {
      await deleteDoc(doc(db, 'products', id));
      console.log(`[User] Successfully deleted product: ${id}`);
    } catch (error) {
      console.error(`[User] Failed to delete product: ${id}`, error);
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return { products, loading, addProduct, removeProduct };
}

export function useAdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = 'products';
    const unsub = onSnapshot(collection(db, path), (snapshot) => {
      setProducts(snapshot.docs.map(doc => {
        const data = doc.data();
        return { ...data, id: doc.id };
      }));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsub();
  }, []);

  const removeProduct = async (id: string) => {
    const path = `products/${id}`;
    console.log(`[Admin] Attempting to delete product: ${id}`);
    try {
      await deleteDoc(doc(db, 'products', id));
      console.log(`[Admin] Successfully deleted product: ${id}`);
    } catch (error) {
      console.error(`[Admin] Failed to delete product: ${id}`, error);
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return { products, loading, removeProduct };
}
