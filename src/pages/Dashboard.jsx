import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

export default function Dashboard() {
  const [myGigs, setMyGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    // TODO: fetch user's gigs from backend
    api.get('/gigs/my')
      .then((res) => {
        if (!mounted) return
        setMyGigs(res.data || [])
      })
      .catch((err) => {
        console.error('Failed to fetch my gigs', err)
        setError('Failed to load gigs')
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  if (loading) return <div className="p-6 text-center">Loading dashboard...</div>

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Gigs</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{myGigs.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Applications Received</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Gigs</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">My Gigs</h2>
        {myGigs.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't posted any gigs yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myGigs.map((g) => (
              <Link key={g.id} to={`/gigs/${g.id}`} className="border border-gray-200 dark:border-gray-700 rounded p-4 hover:shadow">
                <h3 className="font-semibold text-gray-900 dark:text-white">{g.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{g.category}</p>
              </Link>
            ))}
          </div>
        )}
        <Link to="/post-gig" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Post New Gig
        </Link>
      </div>
    </div>
  )
}
