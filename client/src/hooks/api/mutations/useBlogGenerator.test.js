import { renderHook, act } from '@testing-library/react'
import toast from 'react-hot-toast'
import { blogApi } from '@/api'
import { useBlogGenerator } from './useBlogGenerator'

vi.mock('@/api', () => ({
  blogApi: {
    generate: vi.fn()
  }
}))

describe('useBlogGenerator', () => {
  it('rejects empty prompt', async () => {
    const { result } = renderHook(() => useBlogGenerator())

    let generateResult
    await act(async () => {
      generateResult = await result.current.generateContent('   ')
    })

    expect(generateResult.success).toBe(false)
    expect(toast.error).toHaveBeenCalled()
    expect(blogApi.generate).not.toHaveBeenCalled()
  })

  it('stores generated content on success', async () => {
    blogApi.generate.mockResolvedValue({
      data: { success: true, content: '# Hello\n\nWorld' }
    })

    const { result } = renderHook(() => useBlogGenerator())

    await act(async () => {
      await result.current.generateContent('My title')
    })

    expect(result.current.generatedContent).toContain('Hello')
  })

  it('clearContent resets generated content', async () => {
    blogApi.generate.mockResolvedValue({
      data: { success: true, content: 'Text' }
    })

    const { result } = renderHook(() => useBlogGenerator())

    await act(async () => {
      await result.current.generateContent('Title')
    })

    act(() => {
      result.current.clearContent()
    })

    expect(result.current.generatedContent).toBeNull()
  })
})
