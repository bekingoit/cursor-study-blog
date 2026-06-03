import { renderHook, waitFor } from '@testing-library/react'
import { adminApi } from '@/api'
import { useAdminDashboard } from './useAdminDashboard'

vi.mock('@/api', () => ({
  adminApi: {
    getDashboard: vi.fn()
  }
}))

describe('useAdminDashboard', () => {
  it('returns dashboard data from API', async () => {
    const dashboardData = { blogs: 2, comments: 5, drafts: 1, recentBlogs: [], recentComments: [] }
    adminApi.getDashboard.mockResolvedValue({
      data: { success: true, dashboardData }
    })

    const { result } = renderHook(() => useAdminDashboard())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.dashboardData).toEqual(dashboardData)
  })

  it('uses default dashboard when payload is missing', async () => {
    adminApi.getDashboard.mockResolvedValue({
      data: { success: true }
    })

    const { result } = renderHook(() => useAdminDashboard())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.dashboardData.blogs).toBe(0)
    expect(result.current.dashboardData.recentBlogs).toEqual([])
  })
})
