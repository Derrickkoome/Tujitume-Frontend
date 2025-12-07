import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

export default function GigList() {
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) return <div className="p-6">Loading gigs...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Available Gigs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gigs.length === 0 && <div className="p-4 text-gray-600">No gigs found.</div>}
        {gigs.map((g) => (
          <Link key={g.id} to={`/gigs/${g.id}`} className="block bg-white rounded-lg shadow p-4 hover:shadow-md">
            <h3 className="text-lg font-medium text-gray-900">{g.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{g.description?.slice(0, 120) || ''}...</p>
            <div className="mt-3 text-xs text-gray-500">Category: {g.category || 'General'}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
