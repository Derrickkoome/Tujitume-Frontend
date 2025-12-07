import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (e) {
      console.error('Sign-out failed', e);
    }
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-bold text-indigo-600">Tujitume</Link>
            <Link to="/post-gig" className="text-sm text-gray-600 hover:text-gray-800">Post Gig</Link>
          </div>

          <div className="flex items-center gap-4">
            {!loading && !user && (
              <Link to="/login" className="text-sm px-3 py-1 bg-indigo-600 text-white rounded">Sign in</Link>
            )}

            {user && (
              <div className="flex items-center gap-3">
                {user.photoURL && <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full object-cover" />}
                <div className="text-sm text-gray-700 dark:text-gray-200">{user.displayName || user.email}</div>
                <button onClick={handleSignOut} className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Sign out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
