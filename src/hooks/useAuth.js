import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup as fbSignInWithPopup, signOut as fbSignOut, getIdToken } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Listen to auth state changes and manage token
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        try {
          // Get fresh token and store it
          const idToken = await u.getIdToken();
          setToken(idToken);
          // Store token in localStorage for API requests
          localStorage.setItem('firebaseToken', idToken);
          localStorage.setItem('userId', u.uid);
        } catch (error) {
          console.error('Failed to get ID token', error);
        }
      } else {
        setUser(null);
        setToken(null);
        // Clear stored credentials
        localStorage.removeItem('firebaseToken');
        localStorage.removeItem('userId');
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Refresh token periodically (Firebase tokens expire in 1 hour)
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(async () => {
      try {
        const idToken = await user.getIdToken(true); // force refresh
        setToken(idToken);
        localStorage.setItem('firebaseToken', idToken);
      } catch (error) {
        console.error('Token refresh failed', error);
      }
    }, 50 * 60 * 1000); // Refresh every 50 minutes (tokens last 1 hour)

    return () => clearInterval(interval);
  }, [user]);

  const getIdTokenForAPI = useCallback(async (forceRefresh = false) => {
    if (!auth.currentUser) return null;
    try {
      const idToken = await auth.currentUser.getIdToken(forceRefresh);
      setToken(idToken);
      localStorage.setItem('firebaseToken', idToken);
      return idToken;
    } catch (error) {
      console.error('getIdToken error', error);
      return null;
    }
  }, []);

  const signIn = useCallback(async () => {
    try {
      const result = await fbSignInWithPopup(auth, googleProvider);
      // Token is automatically set by onAuthStateChanged listener
      return result.user;
    } catch (error) {
      console.error('signIn error', error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fbSignOut(auth);
      // Cleanup is handled by onAuthStateChanged listener
    } catch (error) {
      console.error('signOut error', error);
      throw error;
    }
  }, []);

  const isAuthenticated = Boolean(user);

  return {
    user,
    loading,
    token,
    getIdToken: getIdTokenForAPI,
    signIn,
    signOut,
    isAuthenticated,
  };
}
