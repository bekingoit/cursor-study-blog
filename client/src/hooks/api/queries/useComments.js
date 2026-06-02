import { useState, useEffect } from 'react'
import { commentApi } from '../../../api'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export function useComments(blogId) {
  const { t } = useTranslation()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchComments = async () => {
    if (!blogId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await commentApi.getByBlog(blogId)

      if (response.data.success) {
        setComments(response.data.comments || [])
      } else {
        setError(response.data.message)
        toast.error(response.data.message || t('messages.error.generic'))
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || t('messages.error.generic')
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId])

  return { comments, loading, error, refetch: fetchComments }
}
