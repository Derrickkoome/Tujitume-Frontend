import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { toHaveNoViolations, axe } from 'jest-axe'
import GigDetails from '../pages/GigDetails'

expect.extend(toHaveNoViolations)

jest.mock('../lib/api', () => ({
  get: jest.fn(),
  post: jest.fn()
}))

jest.mock('../hooks/useAuth', () => {
  return jest.fn(() => ({ user: null }))
})

const gig = { id: '1', title: 'Gig One', category: 'Dev', description: 'Detailed gig', pricing: '$100', deliveryTime: '3 days' }

test('GigDetails has no detectable accessibility violations', async () => {
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
  await waitFor(() => expect(container.querySelector('h1')).not.toBeNull())

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
