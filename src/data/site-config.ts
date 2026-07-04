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
// NOTE: Season 2 status unconfirmed as of 2026-07-04. Two build articles carry
// their own "Season 2" patch labels (left untouched). Bump this constant once
// the season is confirmed live.
export const CURRENT_PATCH = 'Season 1 · Phase 3';

/** Plain variant for use inside <title> tags (no interpunct). */
export const CURRENT_PATCH_PLAIN = 'Season 1 Phase 3';

/**
 * Label for a "Last verified" badge.
 * @param pageVerified The label this specific page was last verified under.
 *                     Omit ONLY when the page has been re-checked for CURRENT_PATCH.
 */
export function verifiedPatch(pageVerified?: string): string {
  return pageVerified || CURRENT_PATCH;
}
