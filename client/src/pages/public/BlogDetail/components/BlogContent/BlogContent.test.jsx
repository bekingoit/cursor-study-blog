import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import BlogContent from './BlogContent'

describe('BlogContent', () => {
  it('renders safe HTML content', () => {
    renderWithProviders(<BlogContent content="<p>Hello world</p>" />)

    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('strips script tags from rendered HTML', () => {
    const { container } = renderWithProviders(
      <BlogContent content='<p>Safe</p><script>alert("xss")</script>' />
    )

    const richText = container.querySelector('.rich-text')
    expect(richText.innerHTML).not.toContain('<script')
    expect(screen.getByText('Safe')).toBeInTheDocument()
  })
})
