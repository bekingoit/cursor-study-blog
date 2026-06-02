import { useAppContext } from '../../../context/AppContext'
import { useApiQuery } from '../../core'
import { useTranslation } from 'react-i18next'

export function useAdminComments() {
  const { axios } = useAppContext()
  const { t } = useTranslation()

  const { data, loading, error, refetch } = useApiQuery(
    () => axios.get('/api/admin/comments'),
    {
      errorMessage: t('messages.error.generic')
    }
  )

  return {
    comments: data?.comments || [],
    loading,
    error,
    refetch
  }
}
