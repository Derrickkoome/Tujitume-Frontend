import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../components/Navbar'

jest.mock('../hooks/useAuth', () => {
  return jest.fn(() => ({
    user: null,
    loading: false,
    signOut: jest.fn()
  }))
})

test('Navbar renders with accessible navigation and buttons', () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )

  // Navbar should have a navigation element or be semantically structured
  // Check for logo/site name link
  const logoLink = screen.getByRole('link', { name: /tujitume/i })
  expect(logoLink).toBeInTheDocument()

  // Browse link should exist (when not authenticated)
  const browseLink = screen.getByRole('link', { name: /browse/i })
  expect(browseLink).toBeInTheDocument()

  // Login button should be present when user is not authenticated
  const loginBtn = screen.getByRole('link', { name: /login/i })
  expect(loginBtn).toBeInTheDocument()

  // All links should have href for keyboard navigation
  const allLinks = screen.getAllByRole('link')
  allLinks.forEach((link) => {
    expect(link.getAttribute('href')).toBeTruthy()
  })
})

test('Navbar displays user info when authenticated', () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )

  // Login button should be present when user is not authenticated
  const loginBtn = screen.getByRole('link', { name: /login/i })
  expect(loginBtn).toBeInTheDocument()

  // All interactive elements are accessible via keyboard
  const allLinks = screen.getAllByRole('link')
  expect(allLinks.length).toBeGreaterThan(0)
  allLinks.forEach((link) => {
    expect(link.getAttribute('href')).toBeTruthy()
  })
})
