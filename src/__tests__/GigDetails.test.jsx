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

test('renders gig details and apply button', async () => {
  const api = require('../lib/api')
  api.get.mockResolvedValue({ data: gig })

  render(
    <MemoryRouter initialEntries={["/gigs/1"]}>
      <Routes>
        <Route path="/gigs/:id" element={<GigDetails />} />
      </Routes>
    </MemoryRouter>
  )

  await waitFor(() => expect(screen.getByText('Gig One')).toBeInTheDocument())
  expect(screen.getByText('Apply')).toBeInTheDocument()
})
