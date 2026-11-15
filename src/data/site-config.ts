/**
 * Site-wide configuration: single source of truth for the current game
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
export const DATABASE_UPDATED = '2026-10-29';

/**
 * Google Analytics 4 measurement ID ("G-XXXXXXXXXX"). Empty means no analytics tag on any page.
 * Mediavine's application (Journey included) reads traffic from Google Analytics, so the site
 * needs GA4 running about 30 days before applying. Paste the ID from the GA4 property's
 * Admin > Data streams > Web stream; set the property's time zone to New York, as Mediavine asks.
 */
export const GA4_ID = 'G-HWT2GX34EX'; // live since 2026-10-26

/**
 * Ads: Journey by Mediavine, approved November 15, 2026. JOURNEY_TAG is the script from the Journey dashboard
 * (Settings, Ad setup), kept byte for byte. BaseLayout puts it in <head> on every page that may carry ads, and on
 * the privacy page, where the script adds Mediavine's privacy notice.
 * Journey is exclusive: no other ad network's code (AdSense included) may run next to it.
 * The site ID also names the ads.txt file Journey hosts for us: public/_redirects sends /ads.txt there.
 * Empty JOURNEY_SITE_ID means no ad script anywhere.
 */
export const JOURNEY_SITE_ID = 'b13678c1-e113-4fd6-ab62-f638361f9c37';
export const JOURNEY_TAG = JOURNEY_SITE_ID
  ? `<script type="text/javascript" async="async" data-noptimize="1" data-cfasync="false" src="//scripts.scriptwrapper.com/tags/${JOURNEY_SITE_ID}.js"></script>`
  : '';

/**
 * Email signup for Resurgence Builds (separate from Inland Care Jobs' list). Works with any provider
 * whose form posts an email address to a URL. Empty action means no signup box anywhere.
 * When set, a box shows on build guides and tier list pages. Resurgence uses Kit's free plan: set KIT_FORM_ID.
 *   Kit (free plan):  action 'https://app.kit.com/forms/<FORM_ID>/subscriptions', emailField 'email_address'
 *   Buttondown:       action 'https://buttondown.com/api/emails/embed-subscribe/<USERNAME>', emailField 'email', hidden { embed: '1' }
 * public/_headers form-action must allow the action's origin (Kit and Buttondown already are).
 */
export const KIT_FORM_ID = ''; // Kit (kit.com) form ID: the number in the form's embed code. Empty keeps the box hidden.
export const NEWSLETTER_FORM: { action: string; emailField: string; hidden?: Record<string, string> } = {
  action: KIT_FORM_ID ? `https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions` : '',
  emailField: 'email_address',
};
