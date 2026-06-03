import { renderHook, waitFor } from '@testing-library/react'
import { adminApi } from '@/api'
import { useAdminComments } from './useAdminComments'

vi.mock('@/api', () => ({
  adminApi: {
    getComments: vi.fn()
  }
}))

describe('useAdminComments', () => {
  it('maps comments from successful response', async () => {
    adminApi.getComments.mockResolvedValue({
      data: { success: true, comments: [{ _id: 'c1', content: 'Hi' }] }
    })

    const { result } = renderHook(() => useAdminComments())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.comments[0].content).toBe('Hi')
  })
})
