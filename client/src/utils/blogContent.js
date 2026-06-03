import { marked } from 'marked'

marked.setOptions({
  breaks: true,
  gfm: true
})

export function isHtmlContent(content) {
  if (!content || typeof content !== 'string') return false
  const trimmed = content.trim()
  return /^<[a-z][\s\S]*>/i.test(trimmed)
}

export function formatBlogContentForDisplay(content) {
  if (!content) return ''
  if (isHtmlContent(content)) {
    return content
  }
  return marked.parse(content)
}
