import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { renderWithProviders } from '@/test/render'
import Layout from './Layout'

vi.mock('@/context/AppContext', () => ({
  useAppContext: () => ({
    setToken: vi.fn(),
    navigate: vi.fn()
  })
}))

describe('Admin Layout', () => {
  it('renders sidebar and outlet content', () => {
    renderWithProviders(
      <Routes>
        <Route path="/admin" element={<Layout />}>
          <Route index element={<div>Admin child page</div>} />
        </Route>
      </Routes>,
      { route: '/admin' }
    )

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
    expect(screen.getByText('Admin child page')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument()
  })
})
