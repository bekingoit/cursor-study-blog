import { renderHook, waitFor } from '@testing-library/react'
import { blogApi } from '@/api'
import { useBlogs } from './useBlogs'

vi.mock('@/api', () => ({
  blogApi: {
    getAll: vi.fn()
  }
}))

describe('useBlogs', () => {
  it('maps blogs from successful response', async () => {
    blogApi.getAll.mockResolvedValue({
      data: { success: true, blogs: [{ _id: '1', title: 'Post' }] }
    })

    const { result } = renderHook(() => useBlogs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.blogs).toEqual([{ _id: '1', title: 'Post' }])
    expect(result.current.error).toBeNull()
  })

  it('returns empty array when data is missing', async () => {
    blogApi.getAll.mockResolvedValue({
      data: { success: true }
    })

    const { result } = renderHook(() => useBlogs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.blogs).toEqual([])
  })
})
