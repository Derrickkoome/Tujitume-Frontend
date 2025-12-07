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

test('GigList renders with accessible heading and filter buttons', async () => {
  const api = require('../lib/api')
  api.get.mockResolvedValue({ data: mockGigs })

  const { container } = render(
    <MemoryRouter>
      <GigList />
    </MemoryRouter>
  )

  // wait for heading to render
  await waitFor(() => expect(screen.getByRole('heading', { name: /explore gigs/i })).toBeInTheDocument())

  // main heading is present and accessible
  const heading = screen.getByRole('heading', { name: /explore gigs/i })
  expect(heading).toBeInTheDocument()

  // filter dropdowns are rendered as comboboxes (select elements)
  const filterSelects = screen.getAllByRole('combobox')
  expect(filterSelects.length).toBeGreaterThan(0)

  // search input is accessible
  const searchInput = screen.getByPlaceholderText(/search gigs/i)
  expect(searchInput).toBeInTheDocument()

  // gig cards are rendered as links with text content
  const gigLinks = screen.getAllByRole('link')
  expect(gigLinks.length).toBeGreaterThanOrEqual(2)

  gigLinks.forEach((link) => {
    // each link should be keyboard accessible (has href or is a clickable element)
    expect(link.getAttribute('href')).toBeTruthy()
  })

  // no images with missing alt text (unless explicitly aria-hidden)
  const imgs = container.querySelectorAll('img')
  imgs.forEach((img) => {
    expect(img.getAttribute('alt') || img.getAttribute('aria-hidden')).toBeTruthy()
  })
})
