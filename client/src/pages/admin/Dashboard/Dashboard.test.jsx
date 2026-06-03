import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import { commentApi } from '@/api'
import { useAdminDashboard } from '@/hooks'
import Dashboard from './Dashboard'

vi.mock('@/hooks', () => ({
  useAdminDashboard: vi.fn()
}))

vi.mock('@/api', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    commentApi: {
      ...actual.commentApi,
      approve: vi.fn(),
      delete: vi.fn(),
      unapprove: vi.fn()
    }
  }
})

describe('Dashboard', () => {
  const refetch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAdminDashboard).mockReturnValue({
      dashboardData: {
        blogs: 1,
        comments: 1,
        drafts: 0,
        recentBlogs: [
          {
            _id: 'b1',
            title: 'Recent Blog',
            createdAt: '2024-01-01',
            isPublished: true,
            commentsCount: 2
          }
        ],
        recentComments: [
          {
            _id: 'c1',
            content: 'Pending comment',
            blogTitle: 'Recent Blog',
            isApproved: false
          }
        ]
      },
      loading: false,
      refetch
    })
  })

  it('renders recent blog rows', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('Recent Blog')).toBeInTheDocument()
    expect(screen.getByText('Pending comment')).toBeInTheDocument()
  })

  it('approves comment and refetches dashboard', async () => {
    commentApi.approve.mockResolvedValue({
      data: { success: true, message: 'Approved' }
    })

    const user = userEvent.setup()
    const { container } = renderWithProviders(<Dashboard />)

    const approveButton = container.querySelector('.admin-action-btn-approve')
    expect(approveButton).toBeTruthy()
    await user.click(approveButton)

    await waitFor(() => {
      expect(commentApi.approve).toHaveBeenCalledWith('c1')
      expect(refetch).toHaveBeenCalled()
    })
  })
})
