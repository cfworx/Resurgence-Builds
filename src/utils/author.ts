/**
 * Get the canonical author profile URL slug.
 * Strips "via ..." credits (with or without parentheses) and normalises to a URL-safe slug.
 * 
 * Examples:
 *   "RapidF5 (via RogueMadras)" → "rapidf5"
 *   "RapidF5 via AgentHuntzman"  → "rapidf5"
 *   "RapidF5"                    → "rapidf5"
 */
export function getAuthorSlug(author: string): string {
  return author
    .replace(/\s*\(.*?\)\s*/g, '')   // strip "(via ...)" parenthetical
    .replace(/\s+via\s+.*/i, '')     // strip "via ..." without parentheses
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

/**
 * Get the full author profile path.
 * e.g. "RapidF5 (via RogueMadras)" → "/author/rapidf5/"
 */
export function getAuthorUrl(author: string): string {
  return `/author/${getAuthorSlug(author)}/`;
}
