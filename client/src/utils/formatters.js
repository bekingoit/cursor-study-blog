import Moment from 'moment'
import { formatBlogContentForDisplay, isHtmlContent } from './blogContent'

export const formatDate = (date) => {
  return Moment(date).format('MMMM Do YYYY')
}

export const formatRelativeTime = (date) => {
  return Moment(date).fromNow()
}

export const truncateText = (text, length = 80) => {
  if (!text) return ''
  return text.length > length ? text.slice(0, length) + '...' : text
}

export const stripHtmlTags = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

export const truncateHtml = (html, length = 80) => {
  const normalized = isHtmlContent(html) ? html : formatBlogContentForDisplay(html)
  const stripped = stripHtmlTags(normalized)
  return truncateText(stripped, length)
}

