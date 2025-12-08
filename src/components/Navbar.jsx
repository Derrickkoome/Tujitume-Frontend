import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setDropdownOpen(false);
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Sign-out failed', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">Tujitume</Link>
            <div className="hidden sm:flex gap-6">
              <Link to="/gigs" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Browse</Link>
              <Link to="/post-gig" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Post Gig</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!loading && !user && (
              <>
                <Link to="/login" className="text-sm px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800">Login</Link>
                <Link to="/post-gig" className="text-sm px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Post a Gig</Link>
              </>
            )}

            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-sm px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {user.photoURL && <img src={user.photoURL} alt="avatar" className="w-6 h-6 rounded-full object-cover" />}
                  <div className="hidden sm:block text-gray-700 dark:text-gray-200 max-w-xs truncate text-left">{user.displayName || user.email}</div>
                  <span className="text-gray-600 dark:text-gray-400">▼</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg border border-gray-100 z-10">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                    <Link to="/applications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Applications</Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
