import { renderHook, waitFor } from '@testing-library/react'
import { adminApi } from '@/api'
import { useAdminBlogs } from './useAdminBlogs'

vi.mock('@/api', () => ({
  adminApi: {
    getBlogs: vi.fn()
  }
}))

describe('useAdminBlogs', () => {
  it('maps blogs from successful response', async () => {
    adminApi.getBlogs.mockResolvedValue({
      data: { success: true, blogs: [{ _id: '1' }] }
    })

    const { result } = renderHook(() => useAdminBlogs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.blogs).toHaveLength(1)
  })
})
