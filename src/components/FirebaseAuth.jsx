import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function FirebaseAuth() {
  const [user, setUser] = useState(null);
  const [idTokenPreview, setIdTokenPreview] = useState('');
  const backendUrl = import.meta.env.VITE_AUTH_BACKEND_URL || '/api/auth/session';

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const token = await u.getIdToken();
          setIdTokenPreview(token.slice(0, 40) + '...');
          // automatically send token to backend after sign-in
          try {
            const res = await fetch(backendUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ uid: u.uid })
            });
            const data = await res.json().catch(() => null);
            console.log('Auto backend response:', data);
          } catch (err) {
            console.warn('Auto-send token failed', err);
          }
        } catch (e) {
          console.error('Error getting token', e);
          setIdTokenPreview('error');
        }
      } else {
        setIdTokenPreview('');
      }
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Signed in user:', result.user);
    } catch (err) {
      console.error('Sign-in error', err);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      console.log('Signed out');
    } catch (err) {
      console.error('Sign-out error', err);
    }
  };

  const sendTokenToBackend = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uid: user.uid })
      });
      const data = await res.json();
      console.log('Backend response:', data);
      alert('Backend response: ' + JSON.stringify(data));
    } catch (e) {
      console.error('Error sending token to backend', e);
      alert('Error sending token to backend: ' + e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Account</h3>
        <div className="flex items-center gap-2">
          {!user ? (
            <button
              onClick={signInWithGoogle}
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Sign in with Google"
            >
              Sign in
            </button>
          ) : (
            <button
              onClick={signOutUser}
              className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Sign out"
            >
              Sign out
            </button>
          )}

          {user && (
            <button
              onClick={sendTokenToBackend}
              className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Send ID token to backend"
            >
              Send Token
            </button>
          )}
        </div>
      </div>

      {user && (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            {user.photoURL && (
              <img src={user.photoURL} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{user.displayName || user.email}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-700 dark:text-gray-300" aria-live="polite">
            <div>ID token preview: <code className="break-all">{idTokenPreview}</code></div>
            <div className="mt-2 text-xs text-gray-500">Backend URL: <code className="wrap-break-word">{backendUrl}</code></div>
          </div>
        </div>
      )}
    </div>
  );
}
