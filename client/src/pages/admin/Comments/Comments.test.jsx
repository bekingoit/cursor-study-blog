import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import { useAdminComments } from '@/hooks'
import Comments from './Comments'

vi.mock('@/hooks', () => ({
  useAdminComments: vi.fn()
}))

describe('Comments', () => {
  it('renders comments table when data is loaded', () => {
    vi.mocked(useAdminComments).mockReturnValue({
      comments: [
        {
          _id: 'c1',
          content: 'Needs review',
          blogTitle: 'Post A',
          isApproved: false
        }
      ],
      loading: false,
      refetch: vi.fn()
    })

    renderWithProviders(<Comments />)
    expect(screen.getByText('Needs review')).toBeInTheDocument()
  })
})
