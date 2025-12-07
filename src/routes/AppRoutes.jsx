import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import PostGigPage from '../components/PostGigPage'
import useAuth from '../hooks/useAuth'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/post-gig"
        element={
          <ProtectedRoute>
            <PostGigPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<div className="p-6">Page not found</div>} />
    </Routes>
  )
}
