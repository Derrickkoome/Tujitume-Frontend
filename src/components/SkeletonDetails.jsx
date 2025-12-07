import React from 'react'

export default function SkeletonDetails() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow p-6 sm:p-8 animate-pulse">
        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        
        {/* Meta info skeleton */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="h-6 bg-gray-200 rounded-full w-32"></div>
          <div className="h-6 bg-gray-200 rounded-full w-28"></div>
          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
        
        {/* Skills skeleton */}
        <div className="mb-6">
          <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="flex flex-wrap gap-2">
            <div className="h-8 bg-gray-200 rounded-full w-20"></div>
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
            <div className="h-8 bg-gray-200 rounded-full w-16"></div>
            <div className="h-8 bg-gray-200 rounded-full w-28"></div>
          </div>
        </div>
        
        {/* Budget and deadline skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="h-5 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-28"></div>
          </div>
        </div>
        
        {/* Action buttons skeleton */}
        <div className="flex gap-3">
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  )
}
