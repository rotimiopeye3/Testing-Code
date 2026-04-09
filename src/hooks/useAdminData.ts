import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, updateDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firebase-utils';

export interface Announcement {
  id: string;
  content: string;
  type: 'info' | 'warning' | 'success';
  createdAt: any;
}

export interface Discount {
  id: string;
  code: string;
  percentage: number;
  active: boolean;
  usageLimit?: number;
  usedCount?: number;
  createdAt: any;
}

export function useAdminData(options: { includeDiscounts?: boolean } = {}) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const annPath = 'announcements';
    const qAnnouncements = query(collection(db, annPath), orderBy('createdAt', 'desc'));

    const unsubAnnouncements = onSnapshot(qAnnouncements, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
      if (!options.includeDiscounts) setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, annPath);
    });

    let unsubDiscounts: (() => void) | undefined;

    if (options.includeDiscounts) {
      const discPath = 'discounts';
      const qDiscounts = query(collection(db, discPath), orderBy('createdAt', 'desc'));

      unsubDiscounts = onSnapshot(qDiscounts, (snapshot) => {
        setDiscounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Discount)));
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, discPath);
      });
    }

    return () => {
      unsubAnnouncements();
      if (unsubDiscounts) unsubDiscounts();
    };
  }, [options.includeDiscounts]);

  const addAnnouncement = async (content: string, type: Announcement['type'] = 'info') => {
    const path = 'announcements';
    try {
      await addDoc(collection(db, path), {
        content,
        type,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    const path = `announcements/${id}`;
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const addDiscount = async (code: string, percentage: number, usageLimit?: number) => {
    const path = 'discounts';
    try {
      await addDoc(collection(db, path), {
        code: code.toUpperCase(),
        percentage,
        active: true,
        usageLimit: usageLimit || 0,
        usedCount: 0,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const toggleDiscount = async (id: string, active: boolean) => {
    const path = `discounts/${id}`;
    try {
      await updateDoc(doc(db, 'discounts', id), { active });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteDiscount = async (id: string) => {
    const path = `discounts/${id}`;
    try {
      await deleteDoc(doc(db, 'discounts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return {
    announcements,
    discounts,
    loading,
    addAnnouncement,
    deleteAnnouncement,
    addDiscount,
    toggleDiscount,
    deleteDiscount,
  };
}
