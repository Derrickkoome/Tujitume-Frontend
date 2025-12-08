import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

export default function Dashboard() {
  const [myGigs, setMyGigs] = useState([])
  const [stats, setStats] = useState({
    totalGigs: 0,
    totalApplications: 0,
    activeGigs: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch user's gigs
      const gigsRes = await api.get('/api/users/me/gigs')
      const gigs = gigsRes.data || []
      setMyGigs(gigs)

      // Calculate stats
      const activeGigs = gigs.filter(g => g.is_completed === 'false').length
      
      // Fetch applications for all gigs
      let totalApplications = 0
      for (const gig of gigs) {
        try {
          const appsRes = await api.get(`/api/gigs/${gig.id}/applications`)
          totalApplications += (appsRes.data || []).length
        } catch (err) {
          console.warn(`Failed to fetch applications for gig ${gig.id}`, err)
        }
      }

      setStats({
        totalGigs: gigs.length,
        totalApplications,
        activeGigs
      })
    } catch (err) {
      console.error('Failed to fetch dashboard data', err)
      setError('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen p-4 sm:p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your gigs and track opportunities</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">My Gigs</h3>
                <p className="text-2xl sm:text-3xl font-bold text-indigo-600 mt-2">{stats.totalGigs}</p>
              </div>
              <div className="text-3xl">📋</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Applications Received</h3>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">{stats.totalApplications}</p>
              </div>
              <div className="text-3xl">✉️</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Gigs</h3>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">{stats.activeGigs}</p>
              </div>
              <div className="text-3xl">⚡</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Your Posted Gigs</h2>
          </div>
          <div className="p-6">
            {myGigs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't posted any gigs yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myGigs.map((g) => (
                  <div key={g.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition-all">
                    <Link to={`/gigs/${g.id}`}>
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{g.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {g.budget ? `$${g.budget}` : 'Budget not set'}
                      </p>
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          g.is_completed === 'true' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {g.is_completed === 'true' ? 'Completed' : 'Active'}
                        </span>
                      </div>
                    </Link>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <Link 
                        to={`/gigs/${g.id}/applicants`}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        View Applicants →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link to="/post-gig" className="inline-flex items-center justify-center px-4 sm:px-6 py-2 bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all font-medium text-sm sm:text-base">
                <span className="mr-2">+</span> Post New Gig
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
