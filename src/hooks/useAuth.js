import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup as fbSignInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';

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

  const signIn = useCallback(async () => {
    try {
      const result = await fbSignInWithPopup(auth, googleProvider);
      return result.user;
    } catch (e) {
      console.error('signIn error', e);
      throw e;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.error('signOut error', e);
      throw e;
    }
  }, []);

  const isAuthenticated = Boolean(user);

  return { user, loading, getIdToken, signIn, signOut, isAuthenticated };
}
