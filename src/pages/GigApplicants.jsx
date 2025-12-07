import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import useAuth from '../hooks/useAuth'
import ReviewForm from '../components/ReviewForm'

export default function GigApplicants() {
  const { gigId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [gig, setGig] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingId, setProcessingId] = useState(null)
  const [completing, setCompleting] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchData()
  }, [gigId, user])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch gig details
      const gigRes = await api.get(`/api/gigs/${gigId}`)
      setGig(gigRes.data)

      // Check if user is the owner
      if (gigRes.data.owner_id !== user.uid) {
        toast.error('You are not authorized to view applications for this gig')
        navigate('/dashboard')
        return
      }

      // Fetch applications
      const appsRes = await api.get(`/api/gigs/${gigId}/applications`)
      setApplications(appsRes.data)
    } catch (err) {
      console.error('Failed to fetch data', err)
      setError(err)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectApplicant = async (applicationId) => {
    if (!window.confirm('Are you sure you want to select this applicant? This action cannot be undone.')) {
      return
    }

    setProcessingId(applicationId)
    try {
      await api.put(`/api/applications/${applicationId}/select`)
      toast.success('Applicant selected successfully!')
      // Refresh applications list
      fetchData()
    } catch (err) {
      console.error('Failed to select applicant', err)
      const errorMsg = err.response?.data?.detail || 'Failed to select applicant'
      toast.error(errorMsg)
    } finally {
      setProcessingId(null)
    }
  }

  const handleRejectApplicant = async (applicationId) => {
    if (!window.confirm('Are you sure you want to reject this application?')) {
      return
    }

    setProcessingId(applicationId)
    try {
      await api.put(`/api/applications/${applicationId}/reject`)
      toast.success('Application rejected')
      // Refresh applications list
      fetchData()
    } catch (err) {
      console.error('Failed to reject applicant', err)
      const errorMsg = err.response?.data?.detail || 'Failed to reject application'
      toast.error(errorMsg)
    } finally {
      setProcessingId(null)
    }
  }

  const handleMarkComplete = async () => {
    if (!window.confirm('Are you sure you want to mark this gig as completed? This will allow you to leave a review.')) {
      return
    }

    setCompleting(true)
    try {
      await api.post(`/api/gigs/${gigId}/complete`)
      toast.success('Gig marked as completed!')
      // Refresh data
      fetchData()
      // Show review form
      setShowReviewForm(true)
    } catch (err) {
      console.error('Failed to mark gig as complete', err)
      const errorMsg = err.response?.data?.detail || 'Failed to mark gig as complete'
      toast.error(errorMsg)
    } finally {
      setCompleting(false)
    }
  }

  const handleReviewSubmitted = () => {
    setShowReviewForm(false)
    toast.success('Thank you for your review!')
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Applications</h3>
          <button
            onClick={fetchData}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const hasSelectedApplicant = applications.some(app => app.status === 'accepted')

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Back button */}
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 font-medium"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Applications for: {gig?.title}
            </h1>
            <p className="text-gray-600">
              {applications.length} {applications.length === 1 ? 'application' : 'applications'} received
            </p>
          </div>
          
          {/* Mark Complete Button */}
          {hasSelectedApplicant && gig?.is_completed !== 'true' && (
            <button
              onClick={handleMarkComplete}
              disabled={completing}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              {completing ? 'Marking Complete...' : 'Mark Gig as Complete'}
            </button>
          )}
          
          {gig?.is_completed === 'true' && (
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
              ✓ Completed
            </div>
          )}
        </div>
      </div>

      {/* Review Form */}
      {gig?.is_completed === 'true' && showReviewForm && hasSelectedApplicant && (
        <div className="mb-8">
          <ReviewForm
            gigId={parseInt(gigId)}
            reviewedUserId={applications.find(app => app.status === 'accepted')?.applicant_id}
            reviewedUserName={applications.find(app => app.status === 'accepted')?.applicant?.name || 'Worker'}
            onSuccess={handleReviewSubmitted}
            onCancel={() => setShowReviewForm(false)}
          />
        </div>
      )}

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-600 mb-6">
            When workers apply to your gig, their applications will appear here.
          </p>
          <Link
            to="/gigs"
            className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
          >
            Browse Gigs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className={`bg-white rounded-lg shadow-lg p-6 border-2 ${
                application.status === 'accepted'
                  ? 'border-green-500 bg-green-50'
                  : application.status === 'rejected'
                  ? 'border-red-300 bg-gray-50 opacity-75'
                  : 'border-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {application.applicant?.name?.charAt(0).toUpperCase() || 
                     application.applicant?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.applicant?.name || 'Anonymous Applicant'}
                    </h3>
                    <p className="text-sm text-gray-600">{application.applicant?.email}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    application.status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : application.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {application.status === 'accepted' && '✓ Selected'}
                  {application.status === 'rejected' && '✗ Rejected'}
                  {application.status === 'pending' && '⏳ Pending'}
                </span>
              </div>

              {/* Cover Letter */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Cover Letter:</h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                  {application.cover_letter || 'No cover letter provided'}
                </p>
              </div>

              {/* Application Date */}
              <p className="text-sm text-gray-500 mb-4">
                Applied: {new Date(application.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>

              {/* Action Buttons */}
              {application.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSelectApplicant(application.id)}
                    disabled={processingId === application.id || hasSelectedApplicant}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                  >
                    {processingId === application.id ? 'Processing...' : 'Select Applicant'}
                  </button>
                  <button
                    onClick={() => handleRejectApplicant(application.id)}
                    disabled={processingId === application.id}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                  >
                    {processingId === application.id ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              )}

              {hasSelectedApplicant && application.status === 'pending' && (
                <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  ⚠️ You have already selected an applicant for this gig. Only one applicant can be selected.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
