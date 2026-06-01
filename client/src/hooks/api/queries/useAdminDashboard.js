import { useApiQuery } from '../../core'
import { adminApi } from '../../../api'
import { MESSAGES } from '../../../constants/messages'

const defaultDashboard = {
  blogs: 0,
  comments: 0,
  drafts: 0,
  recentBlogs: [],
  recentComments: []
}

export function useAdminDashboard() {
  const { data, loading, error, refetch } = useApiQuery(
    () => adminApi.getDashboard(),
    {
      errorMessage: MESSAGES.ERROR_GENERIC
    }
  )

  return {
    dashboardData: data?.dashboardData || defaultDashboard,
    loading,
    error,
    refetch
  }
}
