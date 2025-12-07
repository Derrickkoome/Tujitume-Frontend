import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import GigDetails from '../pages/GigDetails'

jest.mock('../lib/api', () => ({
  get: jest.fn(),
  post: jest.fn()
}))

jest.mock('../hooks/useAuth', () => {
  return jest.fn(() => ({ user: null }))
})

const gig = { id: '1', title: 'Gig One', category: 'Dev', description: 'Detailed gig', pricing: '$100', deliveryTime: '3 days' }

test('GigDetails renders semantic elements and accessible controls', async () => {
  const api = require('../lib/api')
  api.get.mockResolvedValue({ data: gig })

  const { container } = render(
    <MemoryRouter initialEntries={["/gigs/1"]}>
      <Routes>
        <Route path="/gigs/:id" element={<GigDetails />} />
      </Routes>
    </MemoryRouter>
  )

  // wait for content to load
  await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument())

  // heading exists
  const h1 = screen.getByRole('heading', { level: 1 })
  expect(h1).toHaveTextContent('Gig One')

  // description is displayed
  expect(screen.getByText(/Detailed gig/)).toBeInTheDocument()

  // "Budget" label is present
  expect(screen.getByText(/Budget/i)).toBeInTheDocument()

  // Apply button exists and has accessible name
  const applyBtn = screen.getByRole('button', { name: /apply/i })
  expect(applyBtn).toBeEnabled()

  // Ensure there are no elements with empty alt attributes except intentionally decorative ones
  const imgs = container.querySelectorAll('img')
  imgs.forEach((img) => {
    // if image is present, ensure it either has alt text or is marked aria-hidden
    expect(img.getAttribute('alt') || img.getAttribute('aria-hidden')).toBeTruthy()
  })
})
