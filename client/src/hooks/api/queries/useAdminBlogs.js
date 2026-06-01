import { useApiQuery } from '../../core'
import { adminApi } from '../../../api'
import { MESSAGES } from '../../../constants/messages'

export function useAdminBlogs() {
  const { data, loading, error, refetch } = useApiQuery(
    () => adminApi.getBlogs(),
    {
      errorMessage: MESSAGES.ERROR_FETCH_BLOGS
    }
  )

  return {
    blogs: data?.blogs || [],
    loading,
    error,
    refetch
  }
}
