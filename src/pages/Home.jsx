import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

const Home = () => {
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLatestGigs()
  }, [])

  const fetchLatestGigs = async () => {
    try {
      const response = await api.get('/gigs')
      const gigsArray = Array.isArray(response.data) ? response.data : []
      // Get last 3 gigs
      setGigs(gigsArray.slice(-3).reverse())
    } catch (error) {
      console.error('Error fetching gigs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-orange-50">
      {/* Hero Section */}
      <section className="w-full pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-8 inline-block">
            <span className="bg-emerald-200 text-emerald-800 text-sm font-medium px-4 py-2 rounded-full">
              Connecting Kenyan youth with Skills to Income
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Turn Your Skills Into <span className="text-orange-500">Income</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-gray-800 font-medium mb-10 max-w-2xl mx-auto">
            Post casual jobs like cleaning, delivery, errands, and small repairs. Connect with local workers who can get things done quickly and reliably.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/post-gig"
              className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Post a Gig Now
            </Link>
            <Link
              to="/gigs"
              className="px-8 py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition"
            >
              Find Work
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Gigs Section */}
      <section className="w-full pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Latest Gigs Available</h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-700 font-medium">Loading gigs...</p>
            </div>
          ) : gigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gigs.map((gig) => (
                <Link
                  key={gig.id}
                  to={`/gigs/${gig.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                  <div className="p-6">
                    {/* Gig Category */}
                    <div className="text-orange-500 text-sm font-semibold mb-2">
                      {gig.category || 'General'}
                    </div>
                    {/* Price */}
                    <div className="text-orange-500 text-xl font-bold mb-3">
                      KES {gig.budget}
                    </div>
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {gig.title}
                    </h3>
                    {/* Description */}
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {gig.description}
                    </p>
                    {/* Location & Time */}
                    <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                      <span>{gig.location || 'Nairobi'}</span>
                      <span>{Math.floor(Math.random() * 24) || 2} hours ago</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-700 text-lg font-medium mb-4">No gigs available yet</p>
              <Link to="/post-gig" className="text-orange-500 text-lg font-semibold hover:underline">
                Be the first to post a gig
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
