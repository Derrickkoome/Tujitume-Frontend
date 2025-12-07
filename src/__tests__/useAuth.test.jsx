import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import useAuth from '../hooks/useAuth'

// Mock firebase/auth and firebaseConfig used by the hook
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn()
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
  onAuthStateChanged.mockImplementation((auth, cb) => {
    setTimeout(() => cb({ email: 'test@example.com', uid: 'u1' }), 0)
    return () => {}
  })

  render(<TestComponent />)

  // wait for the mocked user to be rendered
  await waitFor(() => expect(screen.getByText(/test@example.com/)).toBeInTheDocument())
  expect(screen.getByText(/auth/)).toBeInTheDocument()
})
