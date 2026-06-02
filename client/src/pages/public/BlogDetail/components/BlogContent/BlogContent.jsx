import React from 'react'
import { Flex, theme } from 'antd'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import './BlogContent.css'

// Sanitize HTML content to prevent XSS attacks
const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel'],
    ALLOW_DATA_ATTR: false
  })
}

function BlogContent({ content }) {
  const { token } = theme.useToken()
  const rawContent = content || ''
  const looksLikeHtml = /<[^>]+>/.test(rawContent)
  const renderedHtml = looksLikeHtml
    ? rawContent
    : marked.parse(rawContent, { gfm: true, breaks: true })

  return (
    <Flex
      vertical
      gap={token.marginMD}
      className="blog-content"
      style={{
        width: '100%',
        maxWidth: 910,
        color: token.colorTextBase
      }}
    >
      <div
        className="rich-text"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(renderedHtml) }}
      />
    </Flex>
  )
}

export default BlogContent
