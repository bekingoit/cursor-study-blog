import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import { ROUTES } from '@/constants/routes'
import Sidebar from './Sidebar'

vi.mock('@/context/AppContext', () => ({
  useAppContext: () => ({
    navigate: vi.fn()
  })
}))

describe('Sidebar', () => {
  it('renders admin navigation links', () => {
    renderWithProviders(<Sidebar />, { route: ROUTES.ADMIN_DASHBOARD })

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
    expect(screen.getAllByText(/add article/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/all articles/i)).toBeInTheDocument()
    expect(screen.getByText(/comments/i)).toBeInTheDocument()
  })
})
