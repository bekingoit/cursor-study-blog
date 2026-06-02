import { useApiMutation } from '../../core'
import { blogApi } from '../../../api'
import { MESSAGES } from '../../../constants/messages'

export function useBlogGenerator() {
  const { mutate, loading, error, reset } = useApiMutation({ showToast: false })

  const generateBody = async (payload, { onSuccess, onError } = {}) => {
    return mutate(
      () => blogApi.generateBody(payload),
      {
        showSuccessToast: false,
        errorMessage: MESSAGES.ERROR_GENERIC,
        onSuccess,
        onError
      }
    )
  }

  return {
    generateBody,
    loading,
    inProgress: loading,
    error,
    reset
  }
}
