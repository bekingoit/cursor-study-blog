import { renderHook, waitFor, act } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useApiQuery } from './useApiQuery'

describe('useApiQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('skips fetch when enabled is false', async () => {
    const apiCall = vi.fn()

    const { result } = renderHook(() =>
      useApiQuery(apiCall, { enabled: false })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(apiCall).not.toHaveBeenCalled()
    expect(result.current.data).toBeNull()
  })

  it('sets data when API returns success', async () => {
    const payload = { success: true, blogs: [{ _id: '1' }] }
    const apiCall = vi.fn().mockResolvedValue({ data: payload })

    const { result } = renderHook(() => useApiQuery(apiCall))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(payload)
    expect(result.current.error).toBeNull()
  })

  it('sets error when API returns success false', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: false, message: 'Not found' }
    })

    const { result } = renderHook(() =>
      useApiQuery(apiCall, { showErrorToast: false })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Not found')
    expect(result.current.data).toBeNull()
  })

  it('sets error on network failure', async () => {
    const apiCall = vi.fn().mockRejectedValue({
      response: { data: { message: 'Server error' } }
    })

    const { result } = renderHook(() =>
      useApiQuery(apiCall, { showErrorToast: true })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Server error')
    expect(toast.error).toHaveBeenCalled()
  })

  it('refetch re-invokes the API call', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: true, blogs: [] }
    })

    const { result } = renderHook(() => useApiQuery(apiCall))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.refetch()
    })

    expect(apiCall).toHaveBeenCalledTimes(2)
  })
})
