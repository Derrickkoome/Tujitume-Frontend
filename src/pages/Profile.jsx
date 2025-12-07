import React from 'react'
import useAuth from '../hooks/useAuth'

export default function Profile() {
  const { user, loading } = useAuth()

  if (loading) return <div className="p-6 text-center">Loading profile...</div>
  if (!user) return <div className="p-6 text-center">Not authenticated</div>

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          {user.photoURL && (
            <img src={user.photoURL} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.displayName || 'User'}</h1>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Account Info</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Email verified: {user.emailVerified ? 'Yes' : 'No'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">User ID: {user.uid}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Stats</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Gigs Posted: 0</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Applications: 0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
