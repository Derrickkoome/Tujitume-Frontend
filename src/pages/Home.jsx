import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Tujitume</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Find gigs or hire skilled workers in your area.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/gigs" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Browse Gigs</Link>
            <Link to="/post-gig" className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300">Post a Gig</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition p-6">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Post a Gig</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create a listing to share the work you need done.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition p-6">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Browse Gigs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Explore available gigs and apply for work.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition p-6">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Manage Applications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Review applicants and select the best fit.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
