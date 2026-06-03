import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import { ROUTES } from '@/constants/routes'
import Navbar from './Navbar'

const mockNavigate = vi.fn()

vi.mock('@/context/AppContext', () => ({
  useAppContext: vi.fn()
}))

import { useAppContext } from '@/context/AppContext'

describe('Navbar', () => {
  beforeEach(() => {
    vi.mocked(useAppContext).mockReturnValue({
      navigate: mockNavigate,
      token: null
    })
    mockNavigate.mockClear()
  })

  it('shows login when user is not authenticated', () => {
    renderWithProviders(<Navbar />)
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
  })

  it('shows dashboard when user is authenticated', () => {
    vi.mocked(useAppContext).mockReturnValue({
      navigate: mockNavigate,
      token: 'jwt-token'
    })

    renderWithProviders(<Navbar />)
    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /register/i })).not.toBeInTheDocument()
  })

  it('navigates home when logo is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Navbar />)

    await user.click(screen.getByText(/StudySprint/i))

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.HOME)
  })

  it('navigates home when home button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Navbar />)

    await user.click(screen.getByRole('button', { name: /home/i }))

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.HOME)
  })
})
