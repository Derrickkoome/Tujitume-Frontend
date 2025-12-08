import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

export default function ApplicationsList() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    // Fetch user's applications from backend
    api.get('/api/users/me/applications')
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

  if (loading) return (
    <div className="min-h-screen p-4 sm:p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading applications...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">My Applications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track the gigs you've applied to</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">You haven't applied to any gigs yet.</p>
            <Link to="/gigs" className="inline-flex items-center justify-center px-6 py-3 bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all font-medium">
              Browse Available Gigs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border-l-4 border-indigo-600">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                        {app.gig?.title || 'Gig Title'}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {app.gig?.location && `📍 ${app.gig.location}`}
                      </p>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400"><span className="font-medium">Budget:</span></p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {app.gig?.budget ? `$${app.gig.budget}` : 'N/A'}
                            {app.gig?.budget_type && ` (${app.gig.budget_type})`}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400"><span className="font-medium">Status:</span></p>
                          <p className="text-base font-semibold mt-1">
                            <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                              app.status === 'accepted' ? 'bg-green-600' :
                              app.status === 'rejected' ? 'bg-red-600' :
                              'bg-yellow-600'
                            }`}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                        Applied on {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Link 
                      to={`/gigs/${app.gig_id}`} 
                      className="shrink-0 px-4 sm:px-6 py-2 bg-linear-to-r from-indigo-600 to-indigo-700 text-white text-sm rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all font-medium whitespace-nowrap text-center"
                    >
                      View Gig
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
