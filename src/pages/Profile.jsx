import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import api from '../lib/api'
import StarRating from '../components/StarRating'

export default function Profile() {
  const { user, loading } = useAuth()
  const [reviews, setReviews] = useState([])
  const [reviewStats, setReviewStats] = useState(null)
  const [loadingReviews, setLoadingReviews] = useState(false)

  useEffect(() => {
    if (user?.uid) {
      fetchReviews()
    }
  }, [user])

  const fetchReviews = async () => {
    setLoadingReviews(true)
    try {
      const res = await api.get(`/api/reviews/${user.uid}`)
      setReviewStats({
        average_rating: res.data.average_rating,
        total_reviews: res.data.total_reviews
      })
      setReviews(res.data.reviews || [])
    } catch (err) {
      console.error('Failed to fetch reviews', err)
    } finally {
      setLoadingReviews(false)
    }
  }

  if (loading) return <div className="p-6 text-center">Loading profile...</div>
  if (!user) return <div className="p-6 text-center">Not authenticated</div>

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          {user.photoURL && (
            <img src={user.photoURL} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.displayName || 'User'}</h1>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Account Info</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Email verified: {user.emailVerified ? 'Yes' : 'No'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">User ID: {user.uid}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Rating</h3>
            {loadingReviews ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
            ) : reviewStats && reviewStats.total_reviews > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={Math.round(reviewStats.average_rating)} readOnly size="sm" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {reviewStats.average_rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {reviewStats.total_reviews} {reviewStats.total_reviews === 1 ? 'review' : 'reviews'}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">No reviews yet</p>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StarRating rating={review.rating} readOnly size="sm" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {review.rating}/5
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        by {review.reviewer?.name || 'Anonymous'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
