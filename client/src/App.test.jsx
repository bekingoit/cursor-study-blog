import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import { useAppContext } from '@/context/AppContext'
import App from './App'

vi.mock('@/context/AppContext', () => ({
  useAppContext: vi.fn()
}))

describe('App', () => {
  it('shows login on admin route when unauthenticated', () => {
    vi.mocked(useAppContext).mockReturnValue({
      token: null
    })

    renderWithProviders(<App />, { route: '/admin' })

    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument()
  })

  it('shows admin layout when authenticated', () => {
    vi.mocked(useAppContext).mockReturnValue({
      token: 'jwt-token'
    })

    renderWithProviders(<App />, { route: '/admin' })

    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument()
  })
})
