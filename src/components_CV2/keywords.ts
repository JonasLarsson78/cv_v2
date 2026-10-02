const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Matches technologies from the skills table in free text, e.g. "Vue 3", "Node.js", "TypeScript".
function keywordRegex(keywords: string[]) {
  const words = keywords.filter((k) => k.length >= 3).map(escape)
  return words.length ? new RegExp(`\\b((?:${words.join('|')})(?:\\.js| \\d+)?)\\b`, 'gi') : null
}

/** Splits text into plain and keyword parts; odd indexes are hits. */
export function splitKeywords(text: string, keywords: string[]) {
  const re = keywordRegex(keywords)
  if (!re) return [{ text, hit: false }]
  return text.split(re).map((part, i) => ({ text: part, hit: i % 2 === 1 }))
}

/** Unique keyword hits in the order they appear in the text. */
export function findKeywords(text: string, keywords: string[]) {
  const re = keywordRegex(keywords)
  if (!re) return []
  return [...new Set(text.match(re) ?? [])]
}
