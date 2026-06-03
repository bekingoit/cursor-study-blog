import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import { useAdminBlogs } from '@/hooks'
import Articles from './Articles'

vi.mock('@/hooks', () => ({
  useAdminBlogs: vi.fn()
}))

describe('Articles', () => {
  it('renders blog table when data is loaded', () => {
    vi.mocked(useAdminBlogs).mockReturnValue({
      blogs: [
        {
          _id: '1',
          title: 'Draft Post',
          createdAt: '2024-01-01',
          isPublished: false
        }
      ],
      loading: false,
      refetch: vi.fn()
    })

    renderWithProviders(<Articles />)
    expect(screen.getByText('Draft Post')).toBeInTheDocument()
  })
})
