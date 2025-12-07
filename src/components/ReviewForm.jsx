import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import StarRating from './StarRating'

export default function ReviewForm({ gigId, reviewedUserId, reviewedUserName, onSuccess, onCancel }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/api/reviews', {
        gig_id: gigId,
        reviewed_user_id: reviewedUserId,
        rating,
        comment: comment.trim() || null
      })
      toast.success('Review submitted successfully!')
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error('Failed to submit review', err)
      const errorMsg = err.response?.data?.detail || 'Failed to submit review'
      toast.error(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border-2 border-orange-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Leave a Review for {reviewedUserName}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size="lg"
          />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comment (Optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your experience working together..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            {comment.length} characters
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
