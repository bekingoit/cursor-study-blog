import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import toast from 'react-hot-toast'
import { renderWithProviders } from '@/test/render'
import NewsletterForm from './NewsletterForm'

describe('NewsletterForm', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows error toast for invalid email', async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewsletterForm />)

    const input = screen.getByPlaceholderText(/email/i)
    await user.type(input, 'not-an-email')
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    expect(toast.error).toHaveBeenCalled()
  })

  it('shows success toast for valid email', async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewsletterForm />)

    await user.type(screen.getByPlaceholderText(/email/i), 'user@example.com')
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    vi.advanceTimersByTime(1000)

    expect(toast.success).toHaveBeenCalled()
  })
})
