import { renderHook, act } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useApiMutation } from './useApiMutation'

describe('useApiMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  it('returns success when API succeeds', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: true, message: 'Done' }
    })

    const { result } = renderHook(() => useApiMutation({ showToast: false }))

    let mutationResult
    await act(async () => {
      mutationResult = await result.current.mutate(apiCall)
    })

    expect(mutationResult).toEqual({ success: true, data: { success: true, message: 'Done' } })
    expect(result.current.loading).toBe(false)
  })

  it('sets error when API returns success false', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: false, message: 'Failed' }
    })

    const { result } = renderHook(() => useApiMutation({ showToast: false }))

    await act(async () => {
      await result.current.mutate(apiCall)
    })

    expect(result.current.error).toBe('Failed')
  })

  it('returns cancelled when confirm is declined', async () => {
    vi.stubGlobal('confirm', vi.fn(() => false))
    const apiCall = vi.fn()

    const { result } = renderHook(() => useApiMutation())

    let mutationResult
    await act(async () => {
      mutationResult = await result.current.mutate(apiCall, {
        confirmMessage: 'Are you sure?'
      })
    })

    expect(mutationResult).toEqual({ success: false, cancelled: true })
    expect(apiCall).not.toHaveBeenCalled()
  })

  it('shows success toast when enabled', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: true, message: 'Saved' }
    })

    const { result } = renderHook(() => useApiMutation({ showToast: true }))

    await act(async () => {
      await result.current.mutate(apiCall, { successMessage: 'Saved' })
    })

    expect(toast.success).toHaveBeenCalledWith('Saved')
  })
})
