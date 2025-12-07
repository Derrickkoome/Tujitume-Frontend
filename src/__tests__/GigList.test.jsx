import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GigList from '../pages/GigList'

jest.mock('../lib/api', () => ({
  get: jest.fn()
}))

const mockGigs = [
  { id: '1', title: 'Test Gig A', category: 'Dev', description: 'A gig', pricing: '$50' },
  { id: '2', title: 'Test Gig B', category: 'Design', description: 'B gig', pricing: '$80' }
]

test('renders gig list from API', async () => {
  const api = require('../lib/api')
  api.get.mockResolvedValue({ data: mockGigs })

  render(
    <MemoryRouter>
      <GigList />
    </MemoryRouter>
  )

  await waitFor(() => expect(screen.getByText('Test Gig A')).toBeInTheDocument())
  expect(screen.getByText('Test Gig B')).toBeInTheDocument()
})
