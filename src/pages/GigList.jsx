import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import SkeletonCard from '../components/SkeletonCard'
import Error500 from '../components/Error500'

export default function GigList() {
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filtering and sorting states
  const [searchQuery, setSearchQuery] = useState('')
  const [budgetType, setBudgetType] = useState('all') // all, fixed, hourly
  const [sortBy, setSortBy] = useState('newest') // newest, oldest, budget_high, budget_low
  const [selectedSkills, setSelectedSkills] = useState([])
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const gigsPerPage = 9

  useEffect(() => {
    fetchGigs()
  }, [])

  const fetchGigs = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/api/gigs')
      // Ensure we always have an array
      const gigsData = Array.isArray(res.data) ? res.data : []
      setGigs(gigsData)
    } catch (err) {
      console.error('Failed to fetch gigs', err)
      setError(err)
      setGigs([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  // Extract all unique skills from gigs
  const allSkills = useMemo(() => {
    const skillsSet = new Set()
    gigs.forEach(gig => {
      if (gig.skills_required && Array.isArray(gig.skills_required)) {
        gig.skills_required.forEach(skill => skillsSet.add(skill))
      }
    })
    return Array.from(skillsSet).sort()
  }, [gigs])

  // Filter and sort gigs
  const filteredAndSortedGigs = useMemo(() => {
    let result = [...gigs]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(g => 
        g.title?.toLowerCase().includes(query) ||
        g.description?.toLowerCase().includes(query) ||
        g.location?.toLowerCase().includes(query)
      )
    }

    // Budget type filter
    if (budgetType !== 'all') {
      result = result.filter(g => g.budget_type === budgetType)
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      result = result.filter(g => 
        g.skills_required && 
        selectedSkills.some(skill => g.skills_required.includes(skill))
      )
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0)
        case 'oldest':
          return new Date(a.created_at || 0) - new Date(b.created_at || 0)
        case 'budget_high':
          return (b.budget || 0) - (a.budget || 0)
        case 'budget_low':
          return (a.budget || 0) - (b.budget || 0)
        default:
          return 0
      }
    })

    return result
  }, [gigs, searchQuery, budgetType, selectedSkills, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedGigs.length / gigsPerPage)
  const indexOfLastGig = currentPage * gigsPerPage
  const indexOfFirstGig = indexOfLastGig - gigsPerPage
  const currentGigs = filteredAndSortedGigs.slice(indexOfFirstGig, indexOfLastGig)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, budgetType, selectedSkills, sortBy])

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setBudgetType('all')
    setSelectedSkills([])
    setSortBy('newest')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="h-12 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  if (error) {
    return <Error500 error={error} onRetry={fetchGigs} />
  }

  const hasActiveFilters = searchQuery || budgetType !== 'all' || selectedSkills.length > 0 || sortBy !== 'newest'

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Explore Gigs
        </h1>
        <p className="text-gray-600">
          {filteredAndSortedGigs.length} {filteredAndSortedGigs.length === 1 ? 'gig' : 'gigs'} available
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gigs by title, description, or location..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Budget Type Filter */}
          <select
            value={budgetType}
            onChange={(e) => setBudgetType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Budget Types</option>
            <option value="fixed">Fixed Price</option>
            <option value="hourly">Hourly Rate</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="budget_high">Highest Budget</option>
            <option value="budget_low">Lowest Budget</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Skills Filter */}
        {allSkills.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Filter by Skills:</p>
            <div className="flex flex-wrap gap-2">
              {allSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    selectedSkills.includes(skill)
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gigs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentGigs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <svg 
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600 text-lg mb-4">No gigs found</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          currentGigs.map((gig) => (
            <Link 
              key={gig.id} 
              to={`/gigs/${gig.id}`} 
              className="block bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 p-5 border border-gray-100 hover:border-orange-200"
            >
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                {gig.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {gig.description}
              </p>

              {/* Skills */}
              {gig.skills_required && gig.skills_required.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {gig.skills_required.slice(0, 3).map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {gig.skills_required.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                      +{gig.skills_required.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-orange-600 font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span>
                    ${gig.budget?.toLocaleString() || 'TBD'}
                    {gig.budget_type === 'hourly' && '/hr'}
                  </span>
                </div>
                {gig.location && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs truncate max-w-[100px]">{gig.location}</span>
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Previous
          </button>
          
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, idx) => {
              const page = idx + 1
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition ${
                      currentPage === page
                        ? 'bg-orange-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2 py-2">...</span>
              }
              return null
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
