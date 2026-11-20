/**
 * Strict allow-list for stored image references:
 *  - app-relative paths under /images/
 *  - https:// URLs
 *  - base64 data URLs whose DECODED bytes carry a PNG, JPEG or WebP signature, max ~2 MB
 * Everything else (javascript:, data:text/html, SVG, http:, file:, ...) is rejected.
 */
const MAX_DATA_URL_CHARS = 2_800_000

export function isSafeImageUrl(url: string): boolean {
  if (typeof url !== 'string' || url.length === 0) return false
  if (url.startsWith('/images/') && !url.includes('..') && !url.includes('//')) return true
  if (url.startsWith('https://')) {
    try {
      new URL(url)
      return url.length <= 2048
    } catch {
      return false
    }
  }
  const m = /^data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=]+)$/.exec(url)
  if (!m || url.length > MAX_DATA_URL_CHARS) return false
  const head = Buffer.from(m[2].slice(0, 32), 'base64')
  const isPng = head.length >= 8 && head.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  const isJpeg = head.length >= 3 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff
  const isWebp = head.length >= 12 && head.subarray(0, 4).toString('ascii') === 'RIFF' && head.subarray(8, 12).toString('ascii') === 'WEBP'
  return isPng || isJpeg || isWebp
}

/** Safe link for message attachments: https or same-site relative only. */
export function isSafeLinkUrl(url: string): boolean {
  if (typeof url !== 'string' || url.length === 0 || url.length > 2048) return false
  if (url.startsWith('/') && !url.startsWith('//')) return true
  try {
    return new URL(url).protocol === 'https:'
  } catch {
    return false
  }
}
