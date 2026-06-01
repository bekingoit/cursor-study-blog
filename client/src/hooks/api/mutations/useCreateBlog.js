import { useApiMutation } from '../../core'
import { blogApi } from '../../../api'
import { MESSAGES } from '../../../constants/messages'

export function useCreateBlog() {
  const { mutate, loading, error } = useApiMutation()

  const createBlog = async (blogData, imageFile) => {
    if (!imageFile || typeof imageFile === 'boolean') {
      return {
        success: false,
        message: 'Invalid image file'
      }
    }

    const formData = new FormData()
    formData.append('blog', JSON.stringify(blogData))
    formData.append('image', imageFile)

    return mutate(
      () => blogApi.create(formData),
      {
        successMessage: MESSAGES.SUCCESS_BLOG_CREATED,
        errorMessage: MESSAGES.ERROR_CREATE_BLOG
      }
    )
  }

  return {
    createBlog,
    isCreating: loading,
    inProgress: loading,
    error
  }
}
