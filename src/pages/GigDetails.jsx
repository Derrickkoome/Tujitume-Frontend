import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'

export default function GigDetails() {
  const { id } = useParams()
  const [gig, setGig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    api.get(`/gigs/${id}`)
      .then((res) => {
        if (!mounted) return
        setGig(res.data)
      })
      .catch((err) => {
        console.error('Failed to fetch gig', err)
        setError('Failed to load gig')
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [id])

  if (loading) return <div className="p-6">Loading gig...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!gig) return <div className="p-6">Gig not found</div>

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-2">{gig.title}</h1>
      <div className="text-sm text-gray-600 mb-4">Category: {gig.category || 'General'}</div>
      <p className="text-gray-800 whitespace-pre-wrap">{gig.description}</p>

      <div className="mt-6">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md">Apply</button>
      </div>
    </div>
  )
}
