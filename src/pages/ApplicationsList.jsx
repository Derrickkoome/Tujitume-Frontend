import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

export default function ApplicationsList() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    // TODO: fetch user's applications from backend
    api.get('/applications')
      .then((res) => {
        if (!mounted) return
        setApplications(res.data || [])
      })
      .catch((err) => {
        console.error('Failed to fetch applications', err)
        setError('Failed to load applications')
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  if (loading) return <div className="p-6 text-center">Loading applications...</div>

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Applications</h1>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't applied to any gigs yet.</p>
            <Link to="/gigs" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Browse Gigs
            </Link>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-indigo-600">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{app.gigTitle || 'Gig Title'}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Posted by {app.posterName || 'Unknown'}</p>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="text-gray-700 dark:text-gray-300"><strong>Budget:</strong> ${app.budget || 'N/A'}</p>
                    <p className="text-gray-700 dark:text-gray-300"><strong>Status:</strong> <span className="font-semibold text-indigo-600">{app.status || 'Pending'}</span></p>
                    <p className="text-gray-600 dark:text-gray-400"><strong>Applied:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Link to={`/gigs/${app.gigId}`} className="px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
                  View Gig
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
