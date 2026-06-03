import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import { ROUTES } from '@/constants/routes'
import Footer from './Footer'

const mockNavigate = vi.fn()

vi.mock('@/context/AppContext', () => ({
  useAppContext: () => ({
    navigate: mockNavigate
  })
}))

describe('Footer', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders app name and quick links', () => {
    renderWithProviders(<Footer />)

    expect(screen.getAllByText(/StudySprint/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/quick links/i)).toBeInTheDocument()
    expect(screen.getByText(/follow us/i)).toBeInTheDocument()
  })

  it('navigates home when all articles link is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Footer />)

    await user.click(screen.getByText(/all articles/i))

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.HOME)
  })
})
