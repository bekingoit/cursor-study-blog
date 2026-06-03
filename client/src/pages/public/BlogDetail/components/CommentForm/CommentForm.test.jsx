import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import CommentForm from './CommentForm'

describe('CommentForm', () => {
  it('shows validation when submitting empty form', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderWithProviders(<CommentForm onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument()
  })

  it('resets form after successful submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue({ success: true })

    renderWithProviders(<CommentForm onSubmit={onSubmit} />)

    await user.type(screen.getByPlaceholderText(/name/i), 'Jane')
    await user.type(screen.getByPlaceholderText(/comment/i), 'Great post')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Jane',
        content: 'Great post'
      })
    })

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/name/i)).toHaveValue('')
    })
  })
})
