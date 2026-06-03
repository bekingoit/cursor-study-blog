import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import toast from 'react-hot-toast'
import { renderWithProviders } from '@/test/render'
import ResetPassword from './ResetPassword'

const mockNavigate = vi.fn()

vi.mock('@/context/AppContext', () => ({
  useAppContext: () => ({
    navigate: mockNavigate
  })
}))

describe('ResetPassword', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    mockNavigate.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('requires email before submit', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ResetPassword />)

    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    expect(await screen.findByText(/please enter your email/i)).toBeInTheDocument()
  })

  it('shows success toast and navigates after valid submit', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ResetPassword />)

    await user.type(screen.getByPlaceholderText('hello@studysprint.com'), 'user@example.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    expect(toast.success).toHaveBeenCalled()

    vi.advanceTimersByTime(2000)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin')
    })
  })
})
