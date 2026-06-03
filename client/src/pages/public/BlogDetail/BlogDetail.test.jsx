import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import { useBlog, useComments } from '@/hooks'
import BlogDetail from './BlogDetail'

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useParams: () => ({ id: 'blog-1' })
  }
})

vi.mock('@/hooks', () => ({
  useBlog: vi.fn(),
  useComments: vi.fn()
}))

vi.mock('@/context/AppContext', () => ({
  useAppContext: () => ({
    navigate: vi.fn(),
    token: null
  })
}))

const mockBlog = {
  _id: 'blog-1',
  title: 'Detail Post',
  category: 'Tech',
  description: '<p>Body</p>',
  image: '/img.jpg'
}

describe('BlogDetail', () => {
  beforeEach(() => {
    vi.mocked(useComments).mockReturnValue({
      comments: [],
      addComment: vi.fn()
    })
  })

  it('shows loader while blog is loading', () => {
    vi.mocked(useBlog).mockReturnValue({
      blog: null,
      loading: true
    })

    const { container } = renderWithProviders(<BlogDetail />)
    expect(container.querySelector('.ant-spin')).toBeInTheDocument()
  })

  it('renders blog content when loaded', () => {
    vi.mocked(useBlog).mockReturnValue({
      blog: mockBlog,
      loading: false
    })

    renderWithProviders(<BlogDetail />)
    expect(screen.getByRole('heading', { name: 'Detail Post' })).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })
})
