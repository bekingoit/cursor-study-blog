import { renderHook, act } from '@testing-library/react'
import { useForm } from './useForm'

describe('useForm', () => {
  it('updates values on handleChange', () => {
    const { result } = renderHook(() => useForm({ email: '' }))

    act(() => {
      result.current.handleChange('email', 'a@b.com')
    })

    expect(result.current.values.email).toBe('a@b.com')
  })

  it('clears field error when value changes', () => {
    const { result } = renderHook(() => useForm({ email: '' }))

    act(() => {
      result.current.setFieldError('email', 'Required')
    })

    act(() => {
      result.current.handleChange('email', 'a@b.com')
    })

    expect(result.current.errors.email).toBeNull()
  })

  it('blocks submit when validation fails', async () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useForm({ email: '' }))

    await act(async () => {
      await result.current.handleSubmit(onSubmit, () => ({ email: 'Required' }))
    })

    expect(onSubmit).not.toHaveBeenCalled()
    expect(result.current.errors.email).toBe('Required')
    expect(result.current.isSubmitting).toBe(false)
  })

  it('calls onSubmit when validation passes', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useForm({ email: 'a@b.com' }))

    await act(async () => {
      await result.current.handleSubmit(onSubmit, () => ({}))
    })

    expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.com' })
  })
})
