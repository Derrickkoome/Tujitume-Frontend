import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import useAuth from '../hooks/useAuth'

// Mock the api module to avoid import.meta.env issues in Jest
jest.mock('../lib/api', () => ({
  default: {
    post: jest.fn(() => Promise.resolve({ data: {} })),
    get: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} }))
  }
}))

// Mock firebase/auth and firebaseConfig used by the hook
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  signInWithPopup: jest.fn(),
  signInWithRedirect: jest.fn(),
  getRedirectResult: jest.fn(() => Promise.resolve(null)),
  signOut: jest.fn(),
  getIdToken: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateProfile: jest.fn()
}))

jest.mock('../firebaseConfig', () => ({
  auth: {},
  googleProvider: {}
}))

function TestComponent() {
  const { user, loading, isAuthenticated } = useAuth()
  if (loading) return <div>loading</div>
  return <div>{user ? user.email : 'no-user'} - {isAuthenticated ? 'auth' : 'noauth'}</div>
}

test('useAuth updates when onAuthStateChanged fires', async () => {
  const { onAuthStateChanged } = require('firebase/auth')
  // Simulate onAuthStateChanged invoking callback with a fake user
  const mockUser = {
    email: 'test@example.com',
    uid: 'u1',
    getIdToken: jest.fn(() => Promise.resolve('mock-token'))
  }
  onAuthStateChanged.mockImplementation((auth, cb) => {
    setTimeout(() => cb(mockUser), 0)
    return () => {}
  })

  render(<TestComponent />)

  // wait for the mocked user to be rendered
  await waitFor(() => expect(screen.getByText(/test@example.com/)).toBeInTheDocument())
  expect(screen.getByText(/auth/)).toBeInTheDocument()
})
