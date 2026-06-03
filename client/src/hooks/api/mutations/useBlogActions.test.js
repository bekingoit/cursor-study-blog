import { renderHook, act } from '@testing-library/react'
import { blogApi } from '@/api'
import { useBlogActions } from './useBlogActions'

vi.mock('@/api', () => ({
  blogApi: {
    deleteBlog: vi.fn(),
    publish: vi.fn()
  }
}))

describe('useBlogActions', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  it('deletes blog after confirmation', async () => {
    blogApi.deleteBlog.mockResolvedValue({
      data: { success: true, message: 'Deleted' }
    })

    const { result } = renderHook(() => useBlogActions())

    let deleteResult
    await act(async () => {
      deleteResult = await result.current.deleteBlog('blog-1')
    })

    expect(confirm).toHaveBeenCalled()
    expect(blogApi.deleteBlog).toHaveBeenCalled()
    expect(deleteResult.success).toBe(true)
  })

  it('publishes blog on success', async () => {
    blogApi.publish.mockResolvedValue({
      data: { success: true, message: 'Published' }
    })

    const { result } = renderHook(() => useBlogActions())

    let publishResult
    await act(async () => {
      publishResult = await result.current.publishBlog('blog-1')
    })

    expect(publishResult.success).toBe(true)
    expect(blogApi.publish).toHaveBeenCalled()
  })
})
