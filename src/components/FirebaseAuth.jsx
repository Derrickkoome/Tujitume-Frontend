import React from 'react';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup, signOut } from 'firebase/auth';

export default function FirebaseAuth() {
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

  return (
    <div className="space-x-2">
      <button onClick={signInWithGoogle} className="px-4 py-2 bg-blue-500 text-white rounded">Sign in with Google</button>
      <button onClick={signOutUser} className="px-4 py-2 bg-gray-200 rounded">Sign out</button>
    </div>
  );
}
