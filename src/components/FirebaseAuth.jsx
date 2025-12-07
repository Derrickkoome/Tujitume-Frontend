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
    <div className="space-y-2">
      <div className="space-x-2">
        {!user ? (
          <button onClick={signInWithGoogle} className="px-4 py-2 bg-blue-500 text-white rounded">Sign in with Google</button>
        ) : (
          <button onClick={signOutUser} className="px-4 py-2 bg-gray-200 rounded">Sign out</button>
        )}
        {user && (
          <button onClick={sendTokenToBackend} className="px-4 py-2 bg-green-500 text-white rounded">Send ID token to backend</button>
        )}
      </div>

      {user && (
        <div className="mt-2 p-2 border rounded">
          <div className="flex items-center gap-3">
            {user.photoURL && <img src={user.photoURL} alt="avatar" className="w-10 h-10 rounded-full" />}
            <div>
              <div className="font-semibold">{user.displayName || user.email}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-700">ID token preview: <code>{idTokenPreview}</code></div>
          <div className="mt-2 text-xs text-gray-500">Backend URL: <code>{backendUrl}</code></div>
        </div>
      )}
    </div>
  );
}
