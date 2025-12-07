import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import useAuth from '../hooks/useAuth'
import SkeletonDetails from '../components/SkeletonDetails'
import Error404 from '../components/Error404'
import Error500 from '../components/Error500'

export default function GigDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [gig, setGig] = useState(null)
  const [owner, setOwner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  useEffect(() => {
    fetchGigDetails()
  }, [id])

  const fetchGigDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/api/gigs/${id}`)
      setGig(res.data)
      
      // Fetch owner details if available
      if (res.data.owner_id) {
        try {
          const ownerRes = await api.get(`/api/users/${res.data.owner_id}`)
          setOwner(ownerRes.data)
        } catch (err) {
          console.warn('Could not fetch owner details', err)
        }
      }
    } catch (err) {
      console.error('Failed to fetch gig', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (e) => {
    e.preventDefault()
    
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/gigs/${id}` } } })
      return
    }

    if (!coverLetter.trim()) {
      toast.error('Please write a cover letter')
      return
    }

    setApplying(true)
    try {
      await api.post(`/api/gigs/${id}/apply`, { 
        cover_letter: coverLetter,
        proposal: coverLetter // For backward compatibility
      })
      setApplied(true)
      setShowApplicationForm(false)
      toast.success('Application submitted successfully!')
    } catch (err) {
      console.error('Apply failed', err)
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || 'Failed to submit application'
      toast.error(errorMsg)
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return <SkeletonDetails />
  }

  if (error) {
    if (error.response?.status === 404) {
      return <Error404 />
    }
    return <Error500 error={error} onRetry={fetchGigDetails} />
  }

  if (!gig) {
    return <Error404 />
  }

  const isOwner = user && gig.owner_id === user.uid
  const deadlineDate = gig.deadline ? new Date(gig.deadline) : null
  const isExpired = deadlineDate && deadlineDate < new Date()

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Back button */}
      <Link 
        to="/gigs" 
        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 font-medium"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Gigs
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {gig.title}
          </h1>
          
          {/* Meta badges */}
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              {gig.budget_type === 'hourly' ? 'Hourly Rate' : 'Fixed Price'}
            </span>
            {gig.location && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {gig.location}
              </span>
            )}
            {isExpired && (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                Expired
              </span>
            )}
          </div>

          {/* Owner info */}
          {owner && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {owner.name?.charAt(0).toUpperCase() || owner.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium text-gray-900">{owner.name || 'Anonymous'}</p>
                <p className="text-sm text-gray-600">{owner.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {gig.description}
          </p>
        </div>

        {/* Skills Required */}
        {gig.skills_required && gig.skills_required.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {gig.skills_required.map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Budget and Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 p-6 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Budget</h3>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              <span className="text-2xl font-bold text-gray-900">
                ${gig.budget?.toLocaleString() || 'TBD'}
                {gig.budget_type === 'hourly' && <span className="text-lg text-gray-600">/hr</span>}
              </span>
            </div>
          </div>

          {deadlineDate && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Deadline</h3>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-semibold text-gray-900">
                  {deadlineDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Application Section */}
        <div className="border-t pt-6">
          {isOwner ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium">This is your gig listing</p>
              <Link 
                to="/dashboard"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-block mt-2"
              >
                View applications in dashboard →
              </Link>
            </div>
          ) : applied ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-green-800 font-semibold">Application Submitted</p>
                <p className="text-green-700 text-sm">You have already applied to this gig</p>
              </div>
            </div>
          ) : isExpired ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">This gig has expired</p>
              <p className="text-red-700 text-sm mt-1">Applications are no longer being accepted</p>
            </div>
          ) : !showApplicationForm ? (
            <button
              onClick={() => {
                if (!user) {
                  navigate('/login', { state: { from: { pathname: `/gigs/${id}` } } })
                } else {
                  setShowApplicationForm(true)
                }
              }}
              className="w-full sm:w-auto px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold text-lg shadow-md hover:shadow-lg"
            >
              Apply for This Gig
            </button>
          ) : (
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter *
                </label>
                <textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                  required
                  placeholder="Explain why you're the best fit for this gig. Highlight relevant experience and skills..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 50 characters ({coverLetter.length}/50)
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={applying || coverLetter.length < 50}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowApplicationForm(false)
                    setCoverLetter('')
                  }}
                  className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
