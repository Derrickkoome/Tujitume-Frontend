import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import useAuth from '../hooks/useAuth'

export default function GigDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [gig, setGig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

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

  const handleApply = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/gigs/${id}` } } })
      return
    }

    setApplying(true)
    try {
      await api.post(`/gigs/${id}/apply`, { uid: user.uid })
      setApplied(true)
      toast.success('Applied successfully!')
    } catch (err) {
      console.error('Apply failed', err)
      toast.error(err.response?.data?.message || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <div className="p-6 text-center">Loading gig...</div>
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>
  if (!gig) return <div className="p-6 text-center">Gig not found</div>

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 dark:text-white">{gig.title}</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Category: <span className="font-medium">{gig.category || 'General'}</span></div>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-6">{gig.description}</p>

        {gig.pricing && <div className="mb-4 text-lg font-semibold text-indigo-600">💰 {gig.pricing}</div>}
        {gig.deliveryTime && <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">📅 Delivery: {gig.deliveryTime}</div>}

        <div className="mt-6 flex gap-3">
          {applied ? (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              You have applied
            </div>
          ) : (
            <button
              onClick={handleApply}
              disabled={applying}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applying ? 'Applying...' : 'Apply'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
