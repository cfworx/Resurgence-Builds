# Design system and mobile rules

The site's CSS follows one short set of tokens (in `src/styles/global.css`, `:root`). Use the token names in new
components instead of typed-in numbers, and run the design audit before shipping layout changes.

## Tokens

| Kind | Tokens | Values |
|---|---|---|
| Text sizes | `--step--2` / `--step--1` / `--step-0` / `--step-1` / `--step-2` / `--step-3` / `--step-4` / `--step-5` | 13 / 15 / 17 / 20 / 24 / 24-32 / 28-44 / 36-56px |
| What each size is for | | chips, tags, mono labels, fine print / meta, captions, card text, tables, menus / body, FAQ answers, bold card titles / h3, intros / h2 on phones / h2 / h1 / home hero |
| Older names | `--text-xs` ... `--text-5xl` | mapped onto the steps above; fine in old code, prefer `--step-*` in new code |
| Line heights | `--lh-tight` / `--lh-snug` / `--lh-small` / `--lh-body` | 1.15 headings / 1.3 bold titles / 1.45 small text / 1.6 body |
| Spacing | `--sp-1` ... `--sp-24` | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px |
| Corners | `--radius-xs` / `--radius-sm` / `--radius` / `--radius-lg` (`--border-radius` = 4px) | 4 tags, buttons, fields / 8 panels / 12 database cards / 16 sheets |
| Controls | `--control-sm` / `--control` / `--control-lg` | 36 (mouse only) / 44 / 48px tall |
| Layout | `--pad-card`, `--measure`, `--inset`, `--max-width` | card padding 16px (24px from 720px), 58ch line length, `--inset` = the card padding (text inside boxes, and the list indent), 72rem container |
| Colors | `--line-strong` | form field borders (3.5:1); `--border` is for decoration only |
| Tier colors | `--tier-s` ... `--tier-d`, `--tier-s-grad` ... `--tier-d-grad` | S orange, A blue, B green, C grey, D dark grey: solid for chips and vote bars, gradients for big tier labels (`src/styles/tier-votes.css`) |

Rules of thumb:
- Nothing under 13px. Must-read text (FAQ answers, callouts, the reasoning in a guide) is body size, 17px.
- Text never gets smaller on phones. The fluid steps (`--step-3`, `--step-4`, `--step-5`) do the scaling.
- Running text (`p`, list items, FAQ answers) is capped at `--measure`; tables, images and videos use the full column.
- Text inside a box (h2 bars, callouts, quotes, the first table column, contents, FAQ questions, the share box,
  cards and panels) starts `--inset` from the box's outer edge, borders included, and lists indent by the same
  amount, so all of it shares one edge: 16px on phones, 24px from 720px. A box with a 3px left border uses
  `padding-left: calc(var(--inset) - 3px)`; one with a 1px border, `calc(var(--inset) - 1px)`.
- Pages start and end one section padding from the header and from what follows `<main>`: the last block of an
  article has no bottom margin, and the footer ad's wrapper only takes up room once an ad is showing.
- Buttons: `min-height` sets the height (`.btn` is 48px). Filter chips are 44px (36px on database pages with a mouse,
  44px on touch). Tags are 32px; linked tags get an invisible 44px tap area on touch screens.
- Anything tapped often is at least 44x44px on touch screens. To grow a tap area without moving the layout:
  `padding-block: 10px; margin-block: -10px;`.
- Form fields: 16px text or larger (smaller makes iPhones zoom the page), 44px tall, a visible label (`sr-only` is
  fine), `--line-strong` border.
- Focus: the global 3px ring (`:focus-visible`). Don't remove outlines. Anything that fills a box with
  `overflow: hidden` (FAQ rows, whole-card links, the video button, the map) or sits in a scrolling list uses
  `outline-offset: -3px`, or the box cuts the ring off; controls in scrolling panels get `scroll-margin` too.
- The phone menu marks the rest of the page `inert` while it's open, so Tab can't wander behind it.
- The header is sticky: `html { scroll-padding-top }` keeps focused things and `#anchors` clear of it. Don't add
  `scroll-margin-top` on top of that (they add up).
- Cards that are links use one stretched link (`.card__link::after`). Any other link inside the card needs
  `position: relative; z-index: 2` or it can't be clicked.
- Grids: `minmax(0, 1fr)` for flexible columns and `repeat(auto-fit, minmax(min(100%, Xrem), 1fr))` for card grids,
  so a wide child can't push the page sideways. Long words and codes: `overflow-wrap: anywhere`.
- Images: always `width` and `height` attributes. `loading="lazy"` only below the first screen (cards take an
  `eager` prop for the first three on a listing).

## Breakpoints

Six, in `em`, each `min-width` paired with a `max-width` 0.01em smaller:

| Width | Query | Used for |
|---|---|---|
| 360px | `(max-width: 22.49em)` | narrowest phones (the Menu button drops its visible label) |
| 560px | `35em` / `34.99em` | small tweaks (social buttons in one row, form padding) |
| 720px | `45em` / `44.99em` | phone layout vs. wider: 2-column grids, 32px gutters, the map's sidebar |
| 960px | `60em` / `59.99em` | 3-column grids, the build loadout panel's weapons/skills columns and 3-wide gear grid |
| 1100px | `68.75em` / `68.74em` | 3-column database grids |
| 1152px | `72em` / `71.99em` | the one-row desktop menu (from here the logo is as far from the menu as the menu items are from each other); the sticky loadout summary beside build articles (narrower screens get the Loadout button) |

`map-engine.js` uses the same 44.99em query for its phone behaviour. The build planner (`public/css/builder-v4.css`)
is laid out like the game's loadout screen and uses the same breakpoints; from 72em (1152px) its summary column sits
beside the board. Gear sets there take the loadout panel's set colors. OS Protocol and Skill Mods are separate sections
there and in the build loadout panel (Cory, October 31). Gold is reserved for the planner's "Take your chances" slot
machine (the button, the reels and the payout card); it only ever fills slots with combinations the game allows, from
the same roll lists the pickers use. The planner page has no text block or FAQ under the tool (Cory's call).

## Checking a change

```bash
npm run build
npx http-server dist -p 4399 -s &
NODE_PATH=$(npm root -g) node scripts/design-audit.cjs --quick              # 390 and 1440px, about 10 minutes
NODE_PATH=$(npm root -g) node scripts/design-audit.cjs                      # every width from 320 to 1920px
NODE_PATH=$(npm root -g) node scripts/design-audit.cjs --pages home,map --verbose
```

The audit runs the checks from the responsive design guide (overflow with clipping switched off, text sizes, tap
targets and field text, line length, near-miss edges, focus hidden under the sticky header, contrast, floating
headings, breakpoints, the text-spacing test) plus header height, fine-print share, first-screen images and page start/end spacing, and
writes `design-audit.json` plus a summary. It needs Playwright with Chromium; it is not part of the site build.

Then look at the pages: phones at 390px and desktop at 1440px, with screenshots the size of the screen (full-page
screenshots in phone emulation are misleading).
