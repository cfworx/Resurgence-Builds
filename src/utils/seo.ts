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
