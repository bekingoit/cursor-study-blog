import { useState } from 'react'
import { parse } from 'marked'
import { useApiMutation } from '../../core'
import { blogApi } from '../../../api'
import toast from 'react-hot-toast'
import { MESSAGES } from '../../../constants/messages'

export function useBlogGenerator() {
  const [generatedContent, setGeneratedContent] = useState(null)
  const { mutate, loading, error } = useApiMutation()

  const generateContent = async (prompt) => {
    if (!prompt || !prompt.trim()) {
      toast.error('Please enter a title')
      return { success: false, message: 'Title required' }
    }

    const result = await mutate(
      () => blogApi.generate(prompt),
      {
        successMessage: 'Content generated successfully!',
        errorMessage: MESSAGES.ERROR_GENERIC,
        onSuccess: (data) => {
          setGeneratedContent(parse(data.content))
        }
      }
    )

    if (result.success) {
      return { success: true, content: parse(result.data.content) }
    }

    return result
  }

  const clearContent = () => {
    setGeneratedContent(null)
  }

  return {
    generateContent,
    clearContent,
    generatedContent,
    isGenerating: loading,
    inProgress: loading,
    error
  }
}
