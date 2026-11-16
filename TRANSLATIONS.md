# Translated guides

Since November 16, 2026 some guides exist in other languages. This is a measured trial, not a second site: about 60%
of the site's Google clicks come from countries where English is not the first language, and for most of those
languages nobody publishes a real guide for this game. We translate the pages whose facts change least, watch Search
Console for a month, and only then decide whether to do more.

## What exists

| Piece | Where |
|---|---|
| Languages and their interface words | `src/data/languages.ts` (a language shows up on the site once it has a translation) |
| Translations | `src/content/translations/<lang>/<guide id>.md` (collection `translations` in `src/content.config.ts`) |
| Pages | `/<lang>/guides/<guide id>/` (`src/pages/[lang]/guides/[slug].astro`, `src/layouts/TranslatedGuideLayout.astro`) and a list per language at `/<lang>/` |
| Links between versions | `src/utils/translations.ts`: every version carries `hreflang` links to all the others, the English guide shows "Also in:", the footer lists the languages |
| Official game terms | `research/translations/glossary-2026-11-16.md`, read from Ubisoft's localized pages |
| Check | `node scripts/check-translations.mjs` (part of `npm run build`) |

## Rules

- **Same facts, nothing more.** A translation says what the English guide says: same numbers, dates and links. It never
  adds a claim, and it never carries a fact the English page does not have. Fix the English first, then the translations.
- **The game's own words.** Where Ubisoft has an official term in that language (the glossary), use it. Where the
  glossary says "not verified", the name stays in English: weapon, talent, gear and menu names are in English until the
  owner records the game in that language. Every translated page says so in one line.
- **Ubisoft's sentences stay Ubisoft's.** A quoted official sentence keeps its English wording, followed by a
  translation in parentheses.
- **Dates.** A translation shows the English guide's "last updated" date as it was when the translation was made
  (`sourceUpdated`). When the English guide changes, the translated page shows a line saying it may be behind, and the
  build check lists it. Bring the translation up to date, then set `sourceUpdated` to the English guide's new date.
- **No ads on translated pages for now** (`noAds` in the layout). Journey does not require English, but the trial is
  about reach first; switch ads on per language once a language has real traffic.
- **No comments** on translated pages (comments belong to the English page).
- **Pick pages that hold still.** Requirements, crossplay, download, controller support. Not codes, news or builds.
- **Written by someone who knows the language.** Natural phrasing, the informal address a gaming site would use, no
  em or en dashes. A translation nobody has checked against the English does not ship.

## Adding a translation

1. Copy the front matter keys from an existing translation: `lang`, `source`, `title`, `description`, `imageAlt`,
   `sourceUpdated` (the English guide's `lastUpdated`), `translatedAt`, `faqs`, `sources`.
2. Internal links go to the translated page when one exists in that language, otherwise to the English page with
   "(in English)" in that language after the link text: once per page in running text (the first time the link
   appears), and on every English entry in a list of links, so a list never looks half translated.
3. Sizes and prices that a store shows differently per country (the App Store size, for one) are written as "about",
   in the English guide too.
4. `npm run build`: the check compares links, FAQ and source counts with the English guide.
5. Look at the page at phone and desktop widths, and at the language's list page.

## Adding a language

Add it to `LANGS` in `src/data/languages.ts` with every interface word, then add the first translation. Use a language
the game itself is in (English, French, Italian, German, Spanish, Japanese, Korean, Brazilian Portuguese, Simplified
and Traditional Chinese) or one where players use the English client and we can still write natively.

## What to measure

In Search Console, filter Pages by `/de/`, `/fr/`, `/es/` and `/pt-br/` four weeks after launch. If a language gets
impressions, translate the next guide for it. If it gets none, stop there.
