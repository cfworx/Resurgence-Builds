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
