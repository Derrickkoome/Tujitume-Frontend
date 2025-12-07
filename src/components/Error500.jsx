import React from 'react'
import { Link } from 'react-router-dom'

export default function Error500({ error, onRetry }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="mb-6">
          <svg 
            className="mx-auto h-24 w-24 text-red-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
            />
          </svg>
        </div>

        {/* Error message */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Something Went Wrong</h2>
        <p className="text-gray-600 mb-2">
          We're experiencing technical difficulties. Our team has been notified and is working on a fix.
        </p>
        
        {error && (
          <details className="mt-4 mb-6 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              Technical details
            </summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded overflow-x-auto">
              {error.message || error.toString()}
            </pre>
          </details>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
            >
              Try Again
            </button>
          )}
          <Link
            to="/"
            className="px-6 py-3 bg-white text-orange-600 border-2 border-orange-600 rounded-lg hover:bg-orange-50 transition font-medium"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
