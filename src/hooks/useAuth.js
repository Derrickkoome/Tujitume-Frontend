import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const getIdToken = useCallback(async (forceRefresh = false) => {
    if (!auth.currentUser) return null;
    try {
      return await auth.currentUser.getIdToken(forceRefresh);
    } catch (e) {
      console.error('getIdToken error', e);
      return null;
    }
  }, []);

  return { user, loading, getIdToken };
}
