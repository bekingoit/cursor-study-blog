import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import BlogHeader from './BlogHeader'

const blog = {
  _id: '1',
  title: 'Test Blog',
  category: 'Tech',
  subTitle: 'A subtitle',
  image: '/cover.jpg'
}

describe('BlogHeader', () => {
  it('renders title and category from blog prop', () => {
    renderWithProviders(<BlogHeader blog={blog} />)

    expect(screen.getByRole('heading', { name: 'Test Blog' })).toBeInTheDocument()
    expect(screen.getByText('Tech')).toBeInTheDocument()
    expect(screen.getByText('A subtitle')).toBeInTheDocument()
  })
})
