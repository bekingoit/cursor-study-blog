import { renderHook, act } from '@testing-library/react'
import { adminApi } from '@/api'
import { useCommentActions } from './useCommentActions'

vi.mock('@/api', () => ({
  adminApi: {
    approveComment: vi.fn(),
    deleteComment: vi.fn()
  }
}))

describe('useCommentActions', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  it('approves a comment', async () => {
    adminApi.approveComment.mockResolvedValue({
      data: { success: true, message: 'Approved' }
    })

    const { result } = renderHook(() => useCommentActions())

    let approveResult
    await act(async () => {
      approveResult = await result.current.approveComment('c1')
    })

    expect(approveResult.success).toBe(true)
    expect(adminApi.approveComment).toHaveBeenCalled()
  })

  it('deletes a comment after confirmation', async () => {
    adminApi.deleteComment.mockResolvedValue({
      data: { success: true, message: 'Deleted' }
    })

    const { result } = renderHook(() => useCommentActions())

    await act(async () => {
      await result.current.deleteComment('c1')
    })

    expect(confirm).toHaveBeenCalled()
    expect(adminApi.deleteComment).toHaveBeenCalled()
  })
})
