export function isEmptyRichText(html) {
  if (!html || typeof html !== 'string') return true
  const trimmed = html.trim()
  if (!trimmed || trimmed === '<p><br></p>') return true
  return richTextPlainLength(html) === 0
}

export function richTextPlainLength(html) {
  if (!html || typeof html !== 'string') return 0
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent || '').trim().length
}
