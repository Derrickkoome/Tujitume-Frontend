import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

export default function GigList() {
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    let mounted = true
    api.get('/gigs')
      .then((res) => {
        if (!mounted) return
        setGigs(res.data || [])
      })
      .catch((err) => {
        console.error('Failed to fetch gigs', err)
        setError('Failed to load gigs')
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  const filteredGigs = filter === 'all' ? gigs : gigs.filter((g) => g.category === filter)
  const categories = ['all', ...new Set(gigs.map((g) => g.category || 'General'))]

  if (loading) return <div className="p-6 text-center">Loading gigs...</div>
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-900 dark:text-white">Available Gigs</h2>
      
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGigs.length === 0 && <div className="p-4 text-gray-600">No gigs found.</div>}
        {filteredGigs.map((g) => (
          <Link key={g.id} to={`/gigs/${g.id}`} className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{g.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{g.description || ''}</p>
            <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Category: {g.category || 'General'}</span>
              <span>💰 {g.pricing || 'TBD'}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
