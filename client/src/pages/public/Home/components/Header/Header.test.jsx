import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import Header from './Header'

const mockSetInput = vi.fn()

vi.mock('@/context/AppContext', () => ({
  useAppContext: () => ({
    setInput: mockSetInput,
    input: ''
  })
}))

describe('Header', () => {
  beforeEach(() => {
    mockSetInput.mockClear()
  })

  it('calls setInput when search is submitted', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Header />)

    const searchInput = screen.getByPlaceholderText(/search/i)
    await user.type(searchInput, 'react')
    await user.keyboard('{Enter}')

    expect(mockSetInput).toHaveBeenCalled()
  })
})
