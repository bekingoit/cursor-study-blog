import React from 'react'
import { render } from '@testing-library/react'
import { ConfigProvider } from 'antd'
import { MemoryRouter } from 'react-router-dom'
import '@/i18n'

export const defaultAppContext = {
  axios: {},
  navigate: vi.fn(),
  token: null,
  setToken: vi.fn(),
  blogs: [],
  setBlogs: vi.fn(),
  input: '',
  setInput: vi.fn(),
  fetchBlogs: vi.fn()
}

const testTheme = {
  token: {
    colorPrimary: '#fa541c'
  }
}

function TestProviders({
  children,
  route = '/',
  withRouter = true
}) {
  let content = children

  if (withRouter) {
    content = (
      <MemoryRouter initialEntries={[route]}>
        {content}
      </MemoryRouter>
    )
  }

  return (
    <ConfigProvider theme={testTheme}>
      {content}
    </ConfigProvider>
  )
}

export function renderWithProviders(ui, options = {}) {
  const { route = '/', withRouter = true, ...renderOptions } = options

  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders route={route} withRouter={withRouter}>
        {children}
      </TestProviders>
    ),
    ...renderOptions
  })
}
