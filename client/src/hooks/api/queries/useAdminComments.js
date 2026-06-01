import { useApiQuery } from '../../core'
import { adminApi } from '../../../api'
import { MESSAGES } from '../../../constants/messages'

export function useAdminComments() {
  const { data, loading, error, refetch } = useApiQuery(
    () => adminApi.getComments(),
    {
      errorMessage: MESSAGES.ERROR_FETCH_COMMENTS
    }
  )

  return {
    comments: data?.comments || [],
    loading,
    error,
    refetch
  }
}
