import { renderHook, act } from '@testing-library/react'
import { blogApi } from '@/api'
import { useCreateBlog } from './useCreateBlog'

vi.mock('@/api', () => ({
  blogApi: {
    create: vi.fn()
  }
}))

describe('useCreateBlog', () => {
  it('rejects invalid image file without calling API', async () => {
    const { result } = renderHook(() => useCreateBlog())

    let createResult
    await act(async () => {
      createResult = await result.current.createBlog({ title: 'T' }, true)
    })

    expect(createResult.success).toBe(false)
    expect(createResult.message).toBe('Invalid image file')
    expect(blogApi.create).not.toHaveBeenCalled()
  })

  it('calls blogApi.create with FormData for valid input', async () => {
    blogApi.create.mockResolvedValue({
      data: { success: true, message: 'Created' }
    })

    const file = new File(['img'], 'cover.png', { type: 'image/png' })
    const { result } = renderHook(() => useCreateBlog())

    await act(async () => {
      await result.current.createBlog({ title: 'T' }, file)
    })

    expect(blogApi.create).toHaveBeenCalledTimes(1)
    const formData = blogApi.create.mock.calls[0][0]
    expect(formData).toBeInstanceOf(FormData)
  })
})
