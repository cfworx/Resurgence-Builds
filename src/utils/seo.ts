/**
 * Truncates a string to a max length at a word boundary.
 * Used for meta descriptions to avoid Google SERP truncation.
 * @param {string} str - The string to truncate
 * @param {number} max - Maximum character length (default: 155)
 * @returns {string} Truncated string with ellipsis if shortened
 */
export function truncateDesc(str, max = 155) {
  if (str.length <= max) return str;
  const truncated = str.slice(0, max).replace(/\s+\S*$/, '');
  return truncated + '…';
}

/**
 * Truncates a title to max length at a clean break point.
 * Accounts for the ' · Resurgence Builds' suffix (21 chars).
 * @param {string} title - Core title (before suffix)
 * @param {number} max - Maximum character length for core title (default: 44)
 * @returns {string} Truncated title with ellipsis if shortened
 */
export function truncateTitle(title, max = 44) {
  if (title.length <= max) return title;
  return `${title.slice(0, max - 1).trim().replace(/[\s,;:—-]+$/, '')}…`;
}

/**
 * Fixes awkward singular/plural forms in raw game data strings.
 * "up to 1 enemies" → "up to 1 enemy", "20 second(s)" → "20 seconds",
 * "1 stack(s)" → "1 stack", "3 bullet(s)" → "3 bullets".
 * @param {string} text - Raw game data string
 * @returns {string} Text with plural forms corrected
 */
export function fixPlurals(text) {
  if (!text) return text;
  return text
    .replace(/\b1 enemies\b/g, '1 enemy')
    .replace(/\b1 bullets\b/g, '1 bullet')
    .replace(/\b1 seconds\b/g, '1 second')
    .replace(/\b1 stacks\b/g, '1 stack')
    .replace(/\b1 meters\b/g, '1 meter')
    .replace(/\b(\d+(?:\.\d+)?) ([A-Za-z]+)\(s\)/g, (_m, n, w) => `${n} ${w}${parseFloat(n) === 1 ? '' : 's'}`);
}

/**
 * Builds a meta description from a dedicated summary, capped at `max` chars
 * and always ending on a complete clause (sentence or semicolon boundary),
 * never mid-stat-string. Falls back to `fallback` when no summary exists.
 * @param {string|undefined} summary - Hand-written summary field
 * @param {string} fallback - Complete-sentence fallback pattern
 * @param {number} max - Maximum character length (default: 155)
 * @returns {string} Meta description ending on a complete clause
 */
export function metaDescription(summary, fallback, max = 155) {
  const source = (summary || '').trim() || fallback;
  if (source.length <= max) return source;
  // Cut at the last full sentence that fits.
  const slice = source.slice(0, max);
  const lastEnd = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('! '), slice.lastIndexOf('? '), slice.lastIndexOf('; '));
  if (lastEnd > 40) return slice.slice(0, lastEnd + 1).trim();
  // No clause boundary fits: use the fallback (guaranteed short & complete).
  return fallback.length <= max ? fallback : truncateDesc(fallback, max);
}
