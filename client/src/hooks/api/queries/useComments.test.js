import { renderHook, waitFor, act } from '@testing-library/react'
import { commentApi } from '@/api'
import { useComments } from './useComments'

vi.mock('@/api', () => ({
  commentApi: {
    getByBlogId: vi.fn(),
    add: vi.fn()
  }
}))

describe('useComments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not fetch when blogId is missing', async () => {
    const { result } = renderHook(() => useComments(null))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(commentApi.getByBlogId).not.toHaveBeenCalled()
    expect(result.current.comments).toEqual([])
  })

  it('loads comments on success', async () => {
    commentApi.getByBlogId.mockResolvedValue({
      data: { success: true, comments: [{ _id: '1', name: 'Ada', content: 'Hi' }] }
    })

    const { result } = renderHook(() => useComments('blog-1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.comments).toHaveLength(1)
    expect(result.current.comments[0].name).toBe('Ada')
  })

  it('refetches after successful addComment', async () => {
    commentApi.getByBlogId.mockResolvedValue({
      data: { success: true, comments: [] }
    })
    commentApi.add.mockResolvedValue({
      data: { success: true, message: 'Added' }
    })

    const { result } = renderHook(() => useComments('blog-1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      const addResult = await result.current.addComment({ blog: 'blog-1', name: 'Bob', content: 'Nice' })
      expect(addResult.success).toBe(true)
    })

    expect(commentApi.getByBlogId).toHaveBeenCalledTimes(2)
  })
})
