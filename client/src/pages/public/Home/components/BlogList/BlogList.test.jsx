import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import BlogList from './BlogList'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

vi.mock('@/context/AppContext', () => ({
  useAppContext: () => ({
    blogs: [
      { _id: '1', title: 'React Tips', category: 'Tech', description: '<p>Desc</p>', image: '/a.jpg' },
      { _id: '2', title: 'Cooking', category: 'Lifestyle', description: '<p>Recipe</p>', image: '/b.jpg' }
    ],
    input: ''
  })
}))

describe('BlogList', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders blog cards', () => {
    renderWithProviders(<BlogList />)
    expect(screen.getByText('React Tips')).toBeInTheDocument()
    expect(screen.getByText('Cooking')).toBeInTheDocument()
  })

  it('filters blogs by category tab', async () => {
    const user = userEvent.setup()
    renderWithProviders(<BlogList />)

    await user.click(screen.getByRole('tab', { name: 'Lifestyle' }))

    expect(screen.queryByText('React Tips')).not.toBeInTheDocument()
    expect(screen.getByText('Cooking')).toBeInTheDocument()
  })

  it('navigates to blog detail on card click', async () => {
    const user = userEvent.setup()
    renderWithProviders(<BlogList />)

    await user.click(screen.getByText('React Tips'))

    expect(mockNavigate).toHaveBeenCalledWith('/blog/1')
  })
})
