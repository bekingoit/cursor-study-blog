import { renderHook, act } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useApiRequest } from './useApiRequest'

describe('useApiRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns success when API succeeds', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: true, message: 'OK' }
    })

    const { result } = renderHook(() => useApiRequest({ showToast: false }))

    let requestResult
    await act(async () => {
      requestResult = await result.current.execute(apiCall)
    })

    expect(requestResult).toEqual({ success: true, data: { success: true, message: 'OK' } })
  })

  it('sets error when API returns success false', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: false, message: 'Bad request' }
    })

    const { result } = renderHook(() => useApiRequest({ showToast: false }))

    await act(async () => {
      await result.current.execute(apiCall)
    })

    expect(result.current.error).toBe('Bad request')
  })

  it('handles axios errors', async () => {
    const apiCall = vi.fn().mockRejectedValue({
      response: { data: { message: 'Unauthorized' } }
    })

    const { result } = renderHook(() => useApiRequest({ showToast: true }))

    let requestResult
    await act(async () => {
      requestResult = await result.current.execute(apiCall)
    })

    expect(requestResult.success).toBe(false)
    expect(result.current.error).toBe('Unauthorized')
    expect(toast.error).toHaveBeenCalled()
  })

  it('reset clears loading and error', async () => {
    const apiCall = vi.fn().mockRejectedValue(new Error('fail'))

    const { result } = renderHook(() => useApiRequest({ showToast: false }))

    await act(async () => {
      await result.current.execute(apiCall)
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })
})
