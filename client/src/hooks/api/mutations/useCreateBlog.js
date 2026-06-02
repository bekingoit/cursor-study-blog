import { useApiMutation } from '../../core'
import { blogApi } from '../../../api'
import { MESSAGES } from '../../../constants/messages'

export function useCreateBlog() {
  const { mutate, loading, error, reset } = useApiMutation()

  const createBlog = async (formData, { onSuccess, onError, successMessage } = {}) => {
    return mutate(
      () => blogApi.create(formData),
      {
        successMessage: successMessage || 'Blog saved successfully',
        errorMessage: MESSAGES.ERROR_GENERIC,
        onSuccess,
        onError
      }
    )
  }

  return {
    createBlog,
    loading,
    inProgress: loading,
    error,
    reset
  }
}
