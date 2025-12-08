import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth'
import api from '../lib/api'
import StarRating from '../components/StarRating'

export default function Profile() {
  const { user, loading } = useAuth()
  const [reviews, setReviews] = useState([])
  const [reviewStats, setReviewStats] = useState(null)
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    skills: [],
    phone: '',
    location: ''
  })
  const [newSkill, setNewSkill] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user?.uid) {
      fetchUserProfile()
      fetchReviews()
    }
  }, [user])

  const fetchUserProfile = async () => {
    try {
      const res = await api.get('/api/users/me')
      setProfileData({
        name: res.data.name || '',
        bio: res.data.bio || '',
        skills: res.data.skills || [],
        phone: res.data.phone || '',
        location: res.data.location || ''
      })
    } catch (err) {
      console.error('Failed to fetch user profile', err)
    }
  }

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

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await api.put('/api/users/me', profileData)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
      fetchUserProfile()
    } catch (err) {
      console.error('Failed to update profile', err)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(s => s !== skillToRemove)
    })
  }

  if (loading) return <div className="p-6 text-center">Loading profile...</div>
  if (!user) return <div className="p-6 text-center">Not authenticated</div>

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {user.photoURL && (
              <img src={user.photoURL} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profileData.name || user.displayName || 'User'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Edit Mode */}
        {isEditing && (
          <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                placeholder="Tell us about yourself and your experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skills
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Add a skill"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {/* Profile Info Section */}
        {!isEditing && (
          <div className="mb-6 space-y-4">
            {profileData.bio && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{profileData.bio}</p>
              </div>
            )}
            
            {profileData.skills && profileData.skills.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileData.phone && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Phone</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.phone}</p>
                </div>
              )}
              
              {profileData.location && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Location</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">📍 {profileData.location}</p>
                </div>
              )}
            </div>
          </div>
        )}

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
