import { renderWithProviders } from '@/test/render'
import Loader from './Loader'

describe('Loader', () => {
  it('renders a centered loading spinner', () => {
    const { container } = renderWithProviders(<Loader />)
    expect(container.querySelector('.loader-container')).toBeInTheDocument()
    expect(container.querySelector('.ant-spin')).toBeInTheDocument()
  })
})
