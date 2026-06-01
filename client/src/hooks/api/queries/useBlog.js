import { useApiQuery } from '../../core'
import { blogApi } from '../../../api'
import { MESSAGES } from '../../../constants/messages'

export function useBlog(id) {
  const { data, loading, error, refetch } = useApiQuery(
    () => blogApi.getById(id),
    {
      enabled: !!id,
      dependencies: [id],
      errorMessage: MESSAGES.ERROR_FETCH_BLOG
    }
  )

  return {
    blog: data?.blog ?? null,
    loading,
    error,
    refetch
  }
}
