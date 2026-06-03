import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import CommentList from './CommentList'

describe('CommentList', () => {
  it('shows empty state when there are no comments', () => {
    renderWithProviders(<CommentList comments={[]} />)
    expect(screen.getByText(/no comments/i)).toBeInTheDocument()
  })

  it('renders comment author and content', () => {
    renderWithProviders(
      <CommentList
        comments={[
          {
            _id: '1',
            name: 'Alice',
            content: 'Nice article',
            createdAt: '2024-01-15T10:00:00.000Z'
          }
        ]}
      />
    )

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Nice article')).toBeInTheDocument()
  })
})
