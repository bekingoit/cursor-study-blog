import React, { useMemo } from 'react'
import { Flex, theme } from 'antd'
import DOMPurify from 'dompurify'
import { formatBlogContentForDisplay } from '@/utils/blogContent'
import './BlogContent.css'

const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img', 'span', 'div', 'hr'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel', 'data-list'],
    ALLOW_DATA_ATTR: true
  })
}

function BlogContent({ content }) {
  const { token } = theme.useToken()

  const sanitizedHtml = useMemo(() => {
    const formatted = formatBlogContentForDisplay(content)
    return sanitizeHtml(formatted)
  }, [content])

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
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </Flex>
  )
}

export default BlogContent
