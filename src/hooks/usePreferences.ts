import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import { handleFirestoreError, OperationType } from '@/lib/firebase-utils';

export interface Preferences {
  notifications: {
    email: boolean;
    push: boolean;
    orders: boolean;
  };
  language: string;
  appearance: 'light' | 'dark' | 'system';
}

const defaultPreferences: Preferences = {
  notifications: {
    email: true,
    push: true,
    orders: true,
  },
  language: 'English (US)',
  appearance: 'light',
};

export function usePreferences() {
  const { user } = useAuthStore();
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const path = `users/${user.uid}/settings/preferences`;
    const prefRef = doc(db, 'users', user.uid, 'settings', 'preferences');

    const unsub = onSnapshot(prefRef, (snapshot) => {
      if (snapshot.exists()) {
        setPreferences(snapshot.data() as Preferences);
      } else {
        // Initialize with defaults if not exists
        setDoc(prefRef, defaultPreferences);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsub();
  }, [user]);

  const updatePreferences = async (newPrefs: Partial<Preferences>) => {
    if (!user) return;
    const path = `users/${user.uid}/settings/preferences`;
    try {
      const prefRef = doc(db, 'users', user.uid, 'settings', 'preferences');
      await setDoc(prefRef, { ...preferences, ...newPrefs }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  return { preferences, loading, updatePreferences };
}
