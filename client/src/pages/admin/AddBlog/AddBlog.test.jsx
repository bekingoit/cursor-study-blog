import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import { useBlogGenerator, useCreateBlog } from '@/hooks'
import AddBlog from './AddBlog'

vi.mock('quill', () => ({
  default: vi.fn().mockImplementation(function Quill() {
    this.root = { innerHTML: '<p>Generated</p>' }
    this.on = vi.fn()
    this.off = vi.fn()
  })
}))

vi.mock('@/hooks', () => ({
  useBlogGenerator: vi.fn(),
  useCreateBlog: vi.fn()
}))

describe('AddBlog', () => {
  beforeEach(() => {
    vi.mocked(useBlogGenerator).mockReturnValue({
      generateContent: vi.fn(),
      isGenerating: false,
      generatedContent: null,
      clearContent: vi.fn()
    })
    vi.mocked(useCreateBlog).mockReturnValue({
      createBlog: vi.fn(),
      isCreating: false
    })
  })

  it('renders add blog form fields', () => {
    renderWithProviders(<AddBlog />)

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0)
  })
})
