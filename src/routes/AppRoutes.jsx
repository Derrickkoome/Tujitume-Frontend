import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import PostGigPage from '../components/PostGigPage'
import GigList from '../pages/GigList'
import GigDetails from '../pages/GigDetails'
import Profile from '../pages/Profile'
import Dashboard from '../pages/Dashboard'
import ApplicationsList from '../pages/ApplicationsList'
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
      <Route path="/gigs" element={<GigList />} />
      <Route path="/gigs/:id" element={<GigDetails />} />
      <Route
        path="/post-gig"
        element={
          <ProtectedRoute>
            <PostGigPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <ApplicationsList />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<div className="p-6">Page not found</div>} />
    </Routes>
  )
}
