import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firebase-utils';

export interface PlatformSettings {
  sellerFeePercentage: number;
}

export function usePlatformSettings() {
  const [settings, setSettings] = useState<PlatformSettings>({ sellerFeePercentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = 'settings/platform';
    const unsub = onSnapshot(doc(db, 'settings', 'platform'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as PlatformSettings);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsub();
  }, []);

  const updateSettings = async (newSettings: PlatformSettings) => {
    const path = 'settings/platform';
    try {
      await setDoc(doc(db, 'settings', 'platform'), newSettings);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  return { settings, loading, updateSettings };
}
