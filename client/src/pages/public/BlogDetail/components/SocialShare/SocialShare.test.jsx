import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import SocialShare from './SocialShare'

describe('SocialShare', () => {
  it('renders share title and social buttons', () => {
    renderWithProviders(<SocialShare />)

    expect(screen.getByText(/share/i)).toBeInTheDocument()
    expect(screen.getAllByLabelText(/facebook/i).length).toBeGreaterThan(0)
    expect(screen.getAllByLabelText(/twitter/i).length).toBeGreaterThan(0)
  })
})
