import { renderHook, waitFor } from '@testing-library/react'
import { blogApi } from '@/api'
import { useBlog } from './useBlog'

vi.mock('@/api', () => ({
  blogApi: {
    getById: vi.fn()
  }
}))

describe('useBlog', () => {
  it('does not fetch without id', async () => {
    const { result } = renderHook(() => useBlog(undefined))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(blogApi.getById).not.toHaveBeenCalled()
    expect(result.current.blog).toBeNull()
  })

  it('returns blog when fetch succeeds', async () => {
    const blog = { _id: '1', title: 'Hello' }
    blogApi.getById.mockResolvedValue({
      data: { success: true, blog }
    })

    const { result } = renderHook(() => useBlog('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.blog).toEqual(blog)
  })
})
