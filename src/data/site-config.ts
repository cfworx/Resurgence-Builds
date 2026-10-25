/**
 * Site-wide configuration — single source of truth for the current game
 * version label.
 *
 * NAMING RULE: Use Season/Phase naming ("Season 2", "Season 1 · Phase 3").
 * Only switch to a numeric patch version when Ubisoft publishes one.
 *
 * DATE DISCIPLINE: CURRENT_PATCH is a CEILING, not an auto-bump. A page's
 * "Last verified" badge may only move forward when that page's content has
 * actually been re-checked in-game (per the Operating Manual). Pages that
 * haven't been re-verified pass their own older label to verifiedPatch().
 */
// Live as of 2026-10-24: Season 2 Phase 2 (launched 2026-09-16, extended by Ubisoft on 2026-10-21
// "until we are ready to release a much bigger update later this year").
export const CURRENT_PATCH = 'Season 2 · Phase 2';

/** Plain variant for use inside <title> tags (no interpunct). */
export const CURRENT_PATCH_PLAIN = 'Season 2 Phase 2';

/**
 * Label for a "Last verified" badge.
 * @param pageVerified The label this specific page was last verified under.
 *                     Omit ONLY when the page has been re-checked for CURRENT_PATCH.
 */
export function verifiedPatch(pageVerified?: string): string {
  return pageVerified || CURRENT_PATCH;
}

/**
 * Date the database item templates were last edited (drop odds, build links,
 * copy fixes). This is NOT an in-game re-verification: the "Last verified"
 * badge still follows verifiedPatch() above. Bump it when the templates change.
 */
export const DATABASE_UPDATED = '2026-10-25';
