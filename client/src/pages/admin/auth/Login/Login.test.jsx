import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import { adminApi } from '@/api'
import Login from './Login'

const mockSetToken = vi.fn()
const mockNavigate = vi.fn()

vi.mock('@/context/AppContext', () => ({
  useAppContext: () => ({
    setToken: mockSetToken,
    navigate: mockNavigate
  })
}))

vi.mock('@/api', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    adminApi: {
      ...actual.adminApi,
      login: vi.fn()
    }
  }
})

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('shows validation for empty submit', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Login />)

    await user.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText(/please enter your email/i)).toBeInTheDocument()
    expect(adminApi.login).not.toHaveBeenCalled()
  })

  it('stores token on successful login', async () => {
    adminApi.login.mockResolvedValue({
      data: { success: true, token: 'jwt-123' }
    })

    const user = userEvent.setup()
    renderWithProviders(<Login />)

    await user.type(screen.getByPlaceholderText('hello@studysprint.com'), 'admin@test.com')
    await user.type(screen.getByPlaceholderText('Password'), 'secret123')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(adminApi.login).toHaveBeenCalled()
      expect(mockSetToken).toHaveBeenCalledWith('jwt-123')
      expect(localStorage.getItem('token')).toBe('jwt-123')
    })
  })
})
