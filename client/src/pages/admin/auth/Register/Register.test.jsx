import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import toast from 'react-hot-toast'
import { renderWithProviders } from '@/test/render'
import Register from './Register'

vi.mock('@/context/AppContext', () => ({
  useAppContext: () => ({
    navigate: vi.fn()
  })
}))

describe('Register', () => {
  it('shows validation when form is empty', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Register />)

    await user.click(screen.getByRole('button', { name: /^register$/i }))

    expect(await screen.findByText(/please enter your email/i)).toBeInTheDocument()
  })

  it('shows coming soon toast on submit', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Register />)

    await user.type(screen.getByPlaceholderText('hello@studysprint.com'), 'jane@example.com')
    await user.type(screen.getAllByPlaceholderText('Password')[0], 'password1')
    await user.type(screen.getAllByPlaceholderText('Password')[1], 'password1')
    await user.click(screen.getByRole('button', { name: /^register$/i }))

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalled()
    })
  })
})
