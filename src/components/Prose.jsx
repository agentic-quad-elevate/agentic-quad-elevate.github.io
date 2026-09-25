import { identifiers } from '../content.js'

// Controller and skill identifiers mentioned in prose are shown as inline code,
// matching the Method Overview caption. Longest ids first so `wall_high_reach`
// is not split by `wall_reach`.
const identifierPattern = new RegExp(
  `(${[...new Set(identifiers)].sort((a, b) => b.length - a.length).join('|')})`,
  'g',
)

export default function Prose({ text }) {
  return text
    .split(identifierPattern)
    .map((part, index) => (index % 2 === 1 ? <code key={index}>{part}</code> : part))
}
