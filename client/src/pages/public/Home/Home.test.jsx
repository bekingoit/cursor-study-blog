import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import Home from './Home'

vi.mock('@/context/AppContext', () => ({
  useAppContext: () => ({
    blogs: [],
    input: '',
    navigate: vi.fn(),
    token: null
  })
}))

describe('Home', () => {
  it('renders main home sections', () => {
    renderWithProviders(<Home />)

    expect(screen.getAllByText(/StudySprint/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByText(/never miss a blog/i)).toBeInTheDocument()
  })
})
