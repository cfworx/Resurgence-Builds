# Workflow Guide — Resurgence Builds

A plain-English guide for day-to-day content management. No coding experience required beyond basic text editing and Git commands.

## Prerequisites

You need:
- A text editor (VS Code recommended — free at https://code.visualstudio.com)
- Git installed (https://git-scm.com)
- Node.js installed (https://nodejs.org — use the LTS version)
- Access to the GitHub repository

## How to Add a Build Guide

1. **Open the project folder** in your text editor
2. **Navigate to** `src/content/builds/`
3. **Copy the template:** Right-click `_template.md` → Copy → Paste → Rename to your build slug (e.g., `demolitionist-explosive-dps.md`)
4. **Edit the frontmatter** (the section between the `---` markers at the top):
   - Change `title` to your build name
   - Set `specialization` to one of: `Demolitionist`, `Tech Operator`, `Bulwark`, `Vanguard`, `Field Medic`
   - Set `playstyle` to one of: `DPS`, `Tank`, `Support`, `Hybrid`, `Solo`
   - Set `pve` and `pvp` to `true` or `false`
   - Set `lastUpdated` to today's date (YYYY-MM-DD format, e.g., `2026-04-20`)
   - Set `patch` to the current game version (e.g., `"1.2.0"`)
   - Add relevant `tags` in the array
   - Write a `description` (this appears in search results — keep it under 160 characters)
   - Set `author` to your name
5. **Write the build guide** below the second `---` using Markdown
6. **Save the file**
7. **Deploy** (see "How to Deploy Changes" below)

## How to Update a Tier List After a Patch

1. Open the tier list file in `src/content/tier-lists/` (e.g., `weapon-tier-list-s1.md`)
2. Move weapons/items between tiers as needed
3. Update the `lastUpdated` field in the frontmatter to today's date
4. Update the `patch` field to the new patch version
5. Add a note to the **Changelog** section at the bottom of the file:
   ```
   - **April 20, 2026 (Patch 1.3.0):** Moved X from B to A tier after buff. Added Y to S tier.
   ```
6. Save and deploy

## How to Publish Patch Notes

1. Copy `src/content/patch-notes/_template.md` → `patch-X-Y-Z.md` (use dashes, e.g., `patch-1-3-0.md`)
2. Fill in the frontmatter:
   - `title`: e.g., "Patch 1.3.0 — Mid-Season Balance Update"
   - `version`: e.g., "1.3.0"
   - `patchDate`: The date the patch went live
   - `author`: Your name
   - `summary`: One-sentence summary
3. Write the patch notes in the body (use headings for sections like "Balance Changes", "Bug Fixes", etc.)
4. Save and deploy

## How to Deploy Changes

### If you're comfortable with Git (recommended):

```bash
# Open terminal in the project folder
git add .
git commit -m "Added new build: Demolitionist Explosive DPS"
git push
```

Cloudflare Pages will automatically build and deploy within ~30 seconds.

### If you prefer GitHub's web interface:

1. Go to the repository on GitHub.com
2. Navigate to the file you want to edit
3. Click the pencil icon (Edit)
4. Make your changes
5. Click "Commit changes" with a descriptive message
6. The site deploys automatically

## How to Preview Before Publishing

```bash
npm run dev
```

This starts a local server at `http://localhost:4321`. Open it in your browser to see your changes live. Press `q + Enter` in the terminal to stop.

## How to Rollback If Something Breaks

### Quick fix — revert the last commit:

```bash
git revert HEAD
git push
```

This creates a new commit that undoes the last change. The site will redeploy automatically.

### If the build itself is broken:

1. Go to the Cloudflare Pages dashboard
2. Find the last successful deployment in the deployment list
3. Click on it → "Rollback to this deployment"
4. The site immediately serves the older version
5. Fix the issue locally, then push again

### If you can't figure out what's wrong:

1. Check the build log in Cloudflare Pages → your project → Deployments → click the failed deployment
2. The error message usually tells you what's wrong (missing frontmatter field, typo in a filename, etc.)
3. Common fixes are listed in "Common Troubleshooting" below

## How to Moderate Comments (If Giscus Is Added)

If Giscus (GitHub Discussions-based comments) is added in the future:

1. Comments are managed through GitHub Discussions on the repository
2. To delete a comment: Go to the Discussion → find the comment → click ⋯ → Delete
3. To lock a discussion: Go to the Discussion → click Lock conversation
4. To ban a user: Report them through GitHub's built-in reporting
5. Giscus respects GitHub's moderation tools — no separate admin panel needed

## Common Troubleshooting

### "Build failed" after adding a new file

**Cause:** Usually a frontmatter validation error — a required field is missing or has the wrong type.

**Fix:** Check the error message. It will say something like `"specialization" is required`. Open your file and add the missing field. The valid values are listed in `src/content.config.ts`.

### "Page shows 404" after deploying

**Cause:** The file might be in the wrong directory, or the slug doesn't match.

**Fix:** Make sure the file is in the correct `src/content/<collection>/` directory. The filename becomes the URL slug (e.g., `my-build.md` → `/builds/my-build/`).

### "Deploy takes longer than usual"

**Cause:** Cloudflare might be experiencing delays, or the build is queued.

**Fix:** Check the Cloudflare status page at https://www.cloudflarestatus.com. Builds typically take 30–90 seconds.

### "Search isn't finding new content"

**Cause:** The Pagefind search index is generated at build time. If you added content and deployed, it should be indexed automatically.

**Fix:** If search still doesn't find it, trigger a manual rebuild in Cloudflare Pages (Deployments → Retry deployment on the latest).

### "Images aren't showing"

**Cause:** Images must be in the `public/` directory or referenced via an absolute URL.

**Fix:** Place images in `public/images/` and reference them as `/images/filename.png` in your Markdown.

## SEO Best Practices for New Content

To ensure our schema markup and SEO remain flawless when you create new builds and guides:

1. **Keep Titles Concise:** Search engines truncate titles that exceed ~600px width (roughly 55-60 characters). Because the site automatically appends " · Resurgence Builds" to the end of every title, aim to keep your Markdown `title` field under **45 characters**. 
   - *Bad:* `title: "The Absolute Best PvE DPS Builds in The Division Resurgence"`
   - *Good:* `title: "Best PvE DPS Builds"`

2. **Optimize Images and Alt Text:** Always include a `featuredImage`.
   - Name the image file with descriptive keywords separated by dashes (e.g., `best-pve-dps-builds-division.png` instead of `image1.png`).
   - Write a rich, descriptive `imageAlt` that explains exactly what is in the image. This helps AI parsers and image search.

3. **Use the `howTo` Schema for Procedural Guides:** If a guide has step-by-step instructions (like the Center-ADS trick), include the `howTo` object in the frontmatter. This qualifies the page for rich results on Google. Example:
   ```yaml
   howTo:
     name: "How to Perform a Center-ADS Release"
     description: "Five-input technique for peeking from cover."
     totalTime: "PT2M"
     tool: ["Any rifle or LMG"]
     steps:
       - name: "Hold cover"
         text: "Press and hold the cover button."
   ```

4. **Descriptive Descriptions:** Keep the `description` field under 150 characters, but pack it with relevant terms. This is what shows up underneath the blue link on Google.

## Mandatory Post Checklist (Every Post, Every Time)

Before publishing ANY post (build, guide, or news), every item below must be checked. No exceptions.

### Frontmatter Requirements

- [ ] **`title`** - Under 45 characters (site appends " · Resurgence Builds" automatically)
- [ ] **`description`** - Under 150 characters, keyword-rich
- [ ] **`featuredImage`** - Path to image in `/public/images/`, filename uses keyword-dashes (e.g., `division-resurgence-vanguard-scout-build.png`)
- [ ] **`imageAlt`** - Descriptive alt text with keywords (for AI parsers and image search)
- [ ] **`shareTitle`** - Short, punchy title for X/Reddit share cards
- [ ] **`shareText`** - One sentence that makes people click (shows under the card title on X)
- [ ] **`faqs`** - At minimum 3 FAQ entries, maximum 6. Every FAQ must:
  - Hit a primary search keyword in the question
  - Be genuinely funny (our audience is middle-aged male gamers with edgy humor)
  - Provide a real, useful answer underneath the joke
- [ ] **`author`** - Always "RapidF5" unless crediting a community creator

### Build-Specific Requirements

- [ ] **`plannerHash`** - URL parameter string for the "Open in Build Planner" button
- [ ] **Tier List Override** - Add the build name to `src/pages/tier-list.astro` in the `assignTier()` function
- [ ] **`specialization`** - Must match one of: Demolitionist, Tech Operator, Bulwark, Vanguard, Field Medic
- [ ] **`playstyle`** - Must match one of: DPS, Tank, Support, Hybrid, Solo

### Image Requirements

- [ ] Image generated or sourced (no placeholders ever)
- [ ] Filename uses SEO-friendly keyword-dashes (NOT `image1.png` or `screenshot.png`)
- [ ] File placed in `public/images/` (or `public/images/news/` for news posts)
- [ ] Image is at least 1024x1024 for proper X card rendering

### Style Rules

- [ ] **NO em dashes** (the — character). Use commas, periods, or rewrite the sentence
- [ ] Voice matches site tone: sarcastic, data-driven, funny. Think "Reddit shitposter with a journalism degree"
- [ ] All game mechanic claims are cited or hedged ("from our understanding" / "community testing suggests")
- [ ] Cross-links to related posts on the site (internal linking for SEO)

### X (Twitter) Card Verification

The site has `twitter:card = summary_large_image`, `twitter:image`, `og:image`, `og:image:width`, and `og:image:height` set globally via `SEO.astro`. For cards to display correctly on X:

1. The `featuredImage` path must point to a real file in `/public/images/`
2. The image must be at least 800x418 pixels (we use 1024x1024)
3. After deploying, X caches old cards aggressively. Use the [X Card Validator](https://cards-dev.twitter.com/validator) to force a re-crawl, or post a new tweet (X re-crawls on first share)
4. Our `twitter:site` is `@ResurgenceBuild` (no trailing 's')

### Pre-Publish Build Check

Always run `npx astro build` before deploying. The build must complete with zero errors. Warnings about "Duplicate id" are from Astro's content cache and can be ignored.
