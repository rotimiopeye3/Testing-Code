import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import { handleFirestoreError, OperationType } from '@/lib/firebase-utils';

export function useProfileData() {
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const addrPath = `users/${user.uid}/addresses`;
    const payPath = `users/${user.uid}/payments`;
    const addrRef = collection(db, 'users', user.uid, 'addresses');
    const payRef = collection(db, 'users', user.uid, 'payments');

    const unsubAddr = onSnapshot(addrRef, (snapshot) => {
      setAddresses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, addrPath);
    });

    const unsubPay = onSnapshot(payRef, (snapshot) => {
      setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, payPath);
    });

    return () => {
      unsubAddr();
      unsubPay();
    };
  }, [user]);

  const addAddress = async (address: any) => {
    if (!user) return;
    const path = `users/${user.uid}/addresses`;
    try {
      await addDoc(collection(db, 'users', user.uid, 'addresses'), address);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const removeAddress = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/addresses/${id}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'addresses', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const addPayment = async (payment: any) => {
    if (!user) return;
    const path = `users/${user.uid}/payments`;
    try {
      await addDoc(collection(db, 'users', user.uid, 'payments'), payment);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const removePayment = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/payments/${id}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'payments', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return { addresses, payments, loading, addAddress, removeAddress, addPayment, removePayment };
}
