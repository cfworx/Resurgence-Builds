# Developer Guide — Resurgence Builds

Everything you need to get the site hosted, create content, and keep it ranking. Written for someone who has never deployed a website before.

---

## Table of Contents

1. [Getting Started Locally](#getting-started-locally)
2. [Getting Hosted on Cloudflare Pages (Step by Step)](#getting-hosted-on-cloudflare-pages)
3. [Connecting a Custom Domain](#connecting-a-custom-domain)
4. [Creating & Publishing New Content](#creating--publishing-new-content)
5. [SEO Guide for Content Creators](#seo-guide-for-content-creators)
6. [Security Checklist](#security-checklist)
7. [Site Architecture Reference](#site-architecture-reference)
8. [Mobile Optimization](#mobile-optimization)
9. [Troubleshooting](#troubleshooting)

---

## Getting Started Locally

### What You Need

- **Node.js** (v18 or newer) — download from [nodejs.org](https://nodejs.org)
- **Git** — download from [git-scm.com](https://git-scm.com)
- A code editor like **VS Code** — [code.visualstudio.com](https://code.visualstudio.com)
- A **GitHub account** — [github.com](https://github.com)

### First-Time Setup

Open a terminal (PowerShell on Windows, Terminal on Mac) and run:

```bash
git clone https://github.com/YOUR-USERNAME/resurgence-builds.git
cd resurgence-builds
npm install
npm run dev
```

This starts a dev server at `http://localhost:4321`. Open that URL in your browser. Changes to `.astro`, `.css`, and `.md` files are reflected immediately — no need to restart.

### How to Stop the Server

Press `Ctrl + C` in the terminal.

---

## Getting Hosted on Cloudflare Pages

Cloudflare Pages is free, fast, and can handle medium-to-heavy traffic. It automatically deploys when you push code. Here's how to set it up from scratch.

### Step 1: Push Your Code to GitHub

If you haven't already created a GitHub repo:

1. Go to [github.com/new](https://github.com/new)
2. Name it `resurgence-builds` (or whatever you want)
3. Set it to **Private** (your source code doesn't need to be public)
4. Do **NOT** check "Add a README" (you already have one)
5. Click **Create repository**
6. In your terminal, run these commands (GitHub will show you these too):

```bash
git remote add origin https://github.com/YOUR-USERNAME/resurgence-builds.git
git branch -M main
git add .
git commit -m "Initial commit"
git push -u origin main
```

> **⚠️ IMPORTANT:** Before pushing, make sure there are NO `.env` files, API keys, passwords, or secrets in your code. The `.gitignore` file already excludes `.env` and `.env.production`. Double-check by running:
> ```bash
> git status
> ```
> If you see any `.env` files listed, do NOT push until you remove them.

### Step 2: Create a Cloudflare Account

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign up for a **free account**
3. Verify your email

### Step 3: Connect GitHub to Cloudflare Pages

1. In the Cloudflare dashboard, click **Workers & Pages** in the left sidebar
2. Click **Create**
3. Click the **Pages** tab
4. Click **Connect to Git**
5. Authorize Cloudflare to access your GitHub account
6. Select the `resurgence-builds` repository
7. Configure the build settings:

| Setting | Value |
|---------|-------|
| **Project name** | `resurgence-builds` (this becomes your `.pages.dev` URL) |
| **Production branch** | `main` |
| **Framework preset** | Astro |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |

8. Leave "Environment variables" **empty** — the site doesn't need any
9. Click **Save and Deploy**

### Step 4: Wait for the First Build

Cloudflare will:
1. Pull your code from GitHub
2. Run `npm install`
3. Run `npm run build`
4. Deploy the `dist/` folder to their global CDN

This takes about 1–2 minutes. Once done, your site is live at:
```
https://resurgence-builds.pages.dev
```

### Step 5: Verify It Works

Open that URL. You should see your home page with the hero banner and latest posts. Click around:
- ✅ Home page loads
- ✅ Builds page loads
- ✅ Tag filters work
- ✅ Individual posts load

**You are now live.** Every future `git push` to the `main` branch will automatically redeploy in ~30 seconds.

---

## Connecting a Custom Domain

If you own `resurgencebuilds.com` (or want to buy one):

### Step 1: Buy the Domain

Buy from [Cloudflare Registrar](https://dash.cloudflare.com/?to=/:account/domains/register) (cheapest, no markup), [Namecheap](https://namecheap.com), or [Porkbun](https://porkbun.com).

### Step 2: Add It to Cloudflare Pages

1. In the Cloudflare dashboard, go to **Workers & Pages → resurgence-builds**
2. Click **Custom domains**
3. Click **Set up a custom domain**
4. Enter your domain: `resurgencebuilds.com`
5. Cloudflare will tell you to update your DNS. If your domain is already on Cloudflare DNS, it's automatic. If not, follow the instructions to change your nameservers.
6. Also add `www.resurgencebuilds.com` and set up a redirect rule from `www` → root domain

### Step 3: SSL is Automatic

Cloudflare provides free HTTPS/SSL. No action needed. Your site will be served over HTTPS automatically.

### Step 4: Verify DNS Propagation

DNS changes can take up to 24 hours, but usually it's 5–30 minutes. Check at [dnschecker.org](https://dnschecker.org).

---

## Creating & Publishing New Content

The site has four content types. All content is written in Markdown files. You don't need to touch any code — just create/edit `.md` files, commit, and push.

### The Workflow (Every Time)

```bash
# 1. Create or edit a .md file (instructions below)
# 2. Test it locally
npm run dev
# 3. Open http://localhost:4321 and check your post looks correct
# 4. When happy, commit and push
git add .
git commit -m "Add: your post description"
git push
# 5. Cloudflare auto-deploys in ~30 seconds. Done!
```

### Creating a News Post

1. Go to `src/content/news/`
2. Copy `_template.md` and rename it using a URL-friendly slug (lowercase, hyphens, no spaces):
   - ✅ `season-2-announcement.md`
   - ❌ `Season 2 Announcement!.md`
3. Edit the frontmatter (the section between the `---` lines at the top):

```markdown
---
title: "Season 2 Announced — Release Date and New Features"
publishDate: 2026-05-17
author: "YourName"
tags: ["season 2", "announcement", "new content"]
description: "Everything we know about Division Resurgence Season 2 including the release date, new specialization, and weapon changes."
---

Write your article body here in Markdown.

## Use Headings for Sections

Regular paragraphs, **bold text**, *italic text*.

- Bullet points work
- Like this

| Tables | Work | Too |
|--------|------|-----|
| data   | data | data |
```

4. Save the file. The home page will automatically show it.
5. The post will be at `/news/season-2-announcement/`

### Creating a Build Guide

1. Go to `src/content/builds/`
2. Copy `_template.md` and rename with a slug: `demolitionist-aoe-dps.md`
3. Edit the frontmatter:

```markdown
---
title: "Demolitionist AoE DPS Build"
specialization: Demolitionist
playstyle: DPS
pve: true
pvp: false
lastUpdated: 2026-05-17
patch: "1.3.0"
tags: ["demolitionist", "dps", "pve", "aoe"]
description: "The highest AoE damage build for Demolitionist in Patch 1.3.0. Optimized for challenging and legendary difficulty."
author: "YourName"
---

Your build guide content here...
```

Valid specialization values: `Demolitionist`, `Tech Operator`, `Bulwark`, `Vanguard`, `Field Medic`

Valid playstyle values: `DPS`, `Tank`, `Support`, `Hybrid`, `Solo`

### Creating a Guide

1. Go to `src/content/guides/`
2. Copy `_template.md` and rename: `dark-zone-farming-guide.md`
3. Edit the frontmatter:

```markdown
---
title: "Dark Zone Farming Guide — Best Routes and Tips"
category: Farming
lastUpdated: 2026-05-17
tags: ["dark zone", "farming", "endgame", "loot"]
description: "The most efficient Dark Zone farming routes in Division Resurgence. Includes extraction tips and PvP avoidance strategies."
author: "YourName"
---

<!-- WARNING: Any Dark Zone guide MUST describe Resurgence's specific mobile Dark Zone rules (extraction, contamination, rogue states). Do NOT copy mechanics from The Division 1 or 2. -->
```

Valid categories: `Beginner`, `Leveling`, `Endgame`, `PvP`, `Farming`, `Crafting`, `General`

### Creating Patch Notes

1. Go to `src/content/patch-notes/`
2. Copy `_template.md` and rename: `patch-1-3-0.md`
3. Edit the frontmatter:

```markdown
---
title: "Patch 1.3.0 — Season 2 Launch"
version: "1.3.0"
patchDate: 2026-06-01
author: "YourName"
summary: "Season 2 launch patch: new specialization, weapon balance, and bug fixes."
---

<!-- WARNING: The version number and date above are placeholders. You MUST use the actual live patch label and deployment date for Division Resurgence. Do not guess patch numbers. -->
```

### Quick Reference

| Content Type | Directory | Route | Appears On |
|-------------|-----------|-------|------------|
| News | `src/content/news/` | `/news/[slug]/` | Home feed |
| Builds | `src/content/builds/` | `/builds/[slug]/` | Home feed + Builds page |
| Guides | `src/content/guides/` | `/guides/[slug]/` | Home feed |
| Patch Notes | `src/content/patch-notes/` | `/patch-notes/[slug]/` | Home feed |

---

## SEO Guide for Content Creators

This section is critical. Follow these rules for every piece of content you publish. This is what determines whether Google ranks your content on page 1 or buries it.

### How Google Ranking Works (The Short Version)

Google ranks content based on:
1. **Relevance** — Does your page answer what someone searched for?
2. **E-E-A-T** — Experience, Expertise, Authoritativeness, Trustworthiness
3. **User experience** — Fast loading, mobile-friendly, no broken links
4. **Content quality** — Original, in-depth, well-structured
5. **Technical SEO** — Proper meta tags, headings, schema markup (our site handles this automatically)

### The Title Tag (Most Important Thing)

The `title` in your frontmatter becomes the page's `<title>` tag. This is what shows up in Google search results and browser tabs.

**Rules:**
- Include your primary keyword naturally
- Keep it under 60 characters (Google truncates longer titles)
- Make it compelling — people need to want to click
- Don't keyword-stuff (don't repeat the same word 3 times)

**Good examples:**
```
title: "Vanguard Tank Build — Best Endgame Setup (Patch 1.2)"
title: "Leveling Guide: 1–30 in Under 12 Hours"
title: "Patch 1.2.0 — Season 1 Weapon Balance Changes"
```

**Bad examples:**
```
title: "Best Division Resurgence Build Best Build Best Vanguard Build"
title: "My Build"
title: "New post about the game and stuff"
```

### The Meta Description

The `description` field in your frontmatter appears below the title in Google search results. This is your sales pitch to get someone to click.

**Rules:**
- Keep it under 155 characters
- Include your primary keyword once
- Write a clear summary of what the page offers
- Include a compelling reason to click

**Good:**
```
description: "The highest DPS Demolitionist build for Patch 1.3. Full gear breakdown, weapon talents, and playstyle guide."
```

**Bad:**
```
description: "A build guide"
description: "This is a post about the Division Resurgence game. Please read it."
```

### Headings (H1, H2, H3)

Your article body should use proper heading hierarchy. The `title` becomes the H1 automatically — don't add another H1 in your content.

```markdown
## Main Section (H2)
Content here...

### Subsection (H3)
Content here...

## Another Main Section (H2)
```

**Rules:**
- Use `##` for major sections (H2)
- Use `###` for subsections (H3)
- Include relevant keywords in headings naturally
- Don't skip levels (don't go from H2 to H4)

### Writing Content That Ranks

**1. Answer the Search Query Directly**

If someone searches "best vanguard build division resurgence", your first paragraph should immediately tell them what the build is and why it's the best. Don't write 3 paragraphs of filler before getting to the point.

**2. Show First-Hand Experience (E-E-A-T)**

Google prioritizes content from people who have actually played the game. Include:
- Screenshots from your own gameplay
- Specific numbers you've tested ("This build does 45k DPS on the training dummy")
- Personal opinions ("I tested this vs. Heartbreaker and found...")
- Real examples ("In the Federal Reserve stronghold, I found...")

**3. Be Comprehensive but Focused**

A 2,000-word build guide that covers every aspect will outrank a 200-word one. But don't add fluff — every sentence should add value. Longer content ranks better only if it's actually useful.

**4. Use Tables and Lists**

Google loves structured data. Use tables for gear loadouts, stat comparisons, and tier lists. Use bullet lists for requirements and tips.

**5. Link to Your Other Content**

Internal linking helps Google understand your site structure and helps users navigate. Link relevant content:

```markdown
Check out our [Vanguard Tank Build](/builds/vanguard-frontline-tank/) for a day-one setup.
See the full breakdown in our [Patch 1.2.0 notes](/patch-notes/patch-1-2-0/).
```

**6. Update Content Regularly**

When a new patch drops, update your existing guides. Change the `lastUpdated` or `patchDate` field. Google values freshness for gaming content.

### Tags Best Practices

Tags help users filter content on the home page. Use relevant, lowercase tags:

**Good tags:** `dps`, `tank`, `pve`, `pvp`, `demolitionist`, `endgame`, `season 1`

**Don't:**
- Use single-character tags
- Create tags that no one would search for
- Use more than 5 tags per post

### Image SEO

If you add images to your posts:

```markdown
![Vanguard build gear loadout showing all six slots](/images/vanguard-loadout.png)
```

- **Always include descriptive alt text** — this is critical for SEO and accessibility
- Use descriptive filenames: `vanguard-loadout.png` not `screenshot123.png`
- Keep images under 500KB (compress with [squoosh.app](https://squoosh.app))
- Use `.webp` format when possible for smaller file sizes

### What NOT to Do (Will Get You De-Ranked)

1. **Don't publish raw AI-generated content.** Google doesn't penalize AI content specifically, but it penalizes thin, generic content that offers no unique value. If you use AI to help draft, always:
   - Add your own experience and opinions
   - Verify all facts and numbers
   - Rewrite in your own voice
   - Add information only someone who plays the game would know

2. **Don't keyword-stuff.** Writing "best Division Resurgence build for Division Resurgence Demolitionist in Division Resurgence" is spam. Use keywords naturally.

3. **Don't duplicate content.** Don't publish the same guide with minor word changes as two separate posts. Google will de-rank both.

4. **Don't use clickbait titles that don't deliver.** If your title says "BEST BUILD EVER" but the build is mediocre, users will bounce and Google will notice.

5. **Don't have broken links.** Before publishing, make sure all internal links work. Broken links hurt SEO.

6. **Don't publish empty or thin pages.** Every page should have at least 300+ words of meaningful content.

### SEO Checklist for Every Post

Before you commit and push, verify:

- [ ] Title is under 60 characters and includes primary keyword
- [ ] Description is under 155 characters and is compelling
- [ ] Content uses proper heading hierarchy (H2 → H3, no H1 in body)
- [ ] All images have descriptive alt text
- [ ] Internal links to related content are included
- [ ] Tags are relevant and lowercase
- [ ] Content provides unique value (not just a rehash of existing content)
- [ ] All facts and numbers are verified
- [ ] Content reads naturally (not robotic or keyword-stuffed)
- [ ] `lastUpdated` / `publishDate` / `patchDate` is set to today's date

### What the Site Does Automatically (You Don't Need to Worry About)

The site already handles these SEO features automatically:
- ✅ XML sitemap generation (`/sitemap-index.xml`)
- ✅ RSS feed (`/rss.xml`)
- ✅ Open Graph meta tags (for social sharing on Discord, Twitter, etc.)
- ✅ Twitter Card meta tags
- ✅ JSON-LD structured data (Schema.org)
- ✅ Canonical URLs
- ✅ Proper heading hierarchy
- ✅ robots.txt with AI scraper blocking
- ✅ Breadcrumb navigation with structured data
- ✅ Semantic HTML (article, nav, main, etc.)
- ✅ HTTPS/SSL (via Cloudflare)
- ✅ Fast page loads (static site on global CDN)
- ✅ Mobile-first responsive design

---

## Security Checklist

### What's Already Configured

The site ships with production-grade security headers (`public/_headers`):

| Header | What It Does |
|--------|-------------|
| `Content-Security-Policy` | Blocks XSS attacks by only allowing scripts/styles from trusted sources |
| `Strict-Transport-Security` | Forces HTTPS for 2 years, prevents downgrade attacks |
| `X-Content-Type-Options: nosniff` | Prevents MIME-type sniffing attacks |
| `X-Frame-Options: DENY` | Prevents your site from being embedded in iframes (clickjacking) |
| `Referrer-Policy` | Controls what info is sent when users click external links |
| `Permissions-Policy` | Blocks access to camera, mic, geolocation |
| `X-XSS-Protection` | Legacy XSS protection for older browsers |

### Things to NEVER Do

1. **Never commit API keys, passwords, or secrets** to the repository. If you accidentally do, the secret is compromised even if you delete it — rotate the key immediately.

2. **Never add a `.env` file to Git.** The `.gitignore` already prevents this, but double-check.

3. **Never install unknown npm packages** without checking them first. Look at the npm page, check downloads, check for known vulnerabilities.

4. **Keep your dependencies updated.** Run `npm audit` periodically. If vulnerabilities are found:
   ```bash
   npm audit fix
   ```

5. **Use a strong password** for your GitHub and Cloudflare accounts. Enable **2-Factor Authentication (2FA)** on both:
   - GitHub: Settings → Security → Two-factor authentication
   - Cloudflare: Profile → Authentication → Two-factor authentication

6. **Set your GitHub repo to Private** if you don't want the source code public. The deployed site will still be public.

### AI Scraper Protection

The `robots.txt` blocks AI training scrapers:
- `GPTBot` (OpenAI)
- `Google-Extended` (Google AI training)
- `CCBot` (Common Crawl)

This prevents your content from being used to train AI models while still allowing Google Search to index your site.

---

## Site Architecture Reference

### Pages

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Unified feed of all posts with tag filtering |
| Builds | `/builds/` | All builds with specialization filter |
| Build detail | `/builds/[slug]/` | Individual build guide |
| News detail | `/news/[slug]/` | Individual news article |
| Guide detail | `/guides/[slug]/` | Individual guide |
| Patch Notes detail | `/patch-notes/[slug]/` | Individual patch notes |
| Privacy | `/privacy/` | Privacy policy |
| Terms | `/terms/` | Terms of service |
| DMCA | `/dmca/` | DMCA policy |
| RSS | `/rss.xml` | RSS feed |
| 404 | Custom | Error page |

### Content Collections

| Collection | Directory | Schema |
|-----------|-----------|--------|
| builds | `src/content/builds/` | title, specialization, playstyle, pve, pvp, lastUpdated, patch, tags, description, author |
| news | `src/content/news/` | title, publishDate, author, tags, description |
| guides | `src/content/guides/` | title, category, lastUpdated, tags, description, author |
| patchNotes | `src/content/patch-notes/` | title, version, patchDate, author, summary |

### Components

| Component | Purpose |
|-----------|---------|
| `SEO.astro` | OG/Twitter/JSON-LD meta tags |
| `Header.astro` | Site header with responsive nav (Home, Builds) |
| `Footer.astro` | Footer with legal links and disclaimer |
| `Breadcrumbs.astro` | Navigation breadcrumbs |
| `SectionTag.astro` | Monospace `// SECTION` label |
| `PostCard.astro` | Unified post card for home feed |
| `BuildCard.astro` | Build listing card for builds page |

### CSS Architecture

All styles in `src/styles/global.css` using CSS custom properties:

- Colors: `--bg`, `--surface`, `--ink`, `--accent`, etc.
- Spacing: `--sp-1` through `--sp-24` (4px base scale)
- Typography: `--font-heading`, `--font-body`, `--font-mono`
- Mobile-first breakpoints: `@media (min-width: 768px)` and `@media (min-width: 1024px)`

---

## Mobile Optimization

The site is built mobile-first. Here's what's in place:

### Responsive Design
- All layouts use CSS Grid with mobile-first breakpoints
- Cards stack single-column on mobile, 2-column at 768px, 3-column at 1024px
- Navigation collapses to hamburger menu on mobile
- Typography scales down on smaller screens
- Filter buttons wrap naturally on small screens

### Mobile Meta Tags
- `viewport` — Proper width and scale
- `theme-color` — Browser chrome matches the dark theme (#0D0D0F)
- `color-scheme: dark` — Tells the OS this is a dark-themed page
- `apple-mobile-web-app-capable` — Full-screen capable on iOS
- `format-detection: telephone=no` — Prevents unwanted phone number linking

### Touch Targets
All interactive elements (buttons, links, nav items) have a minimum size of 48×48px, which meets Google's mobile usability requirements.

### Performance
- Static site = instant page loads from CDN edge
- Fonts loaded asynchronously (non-blocking)
- CSS is minimal and uses custom properties (no framework overhead)
- Images should be kept under 500KB (use [squoosh.app](https://squoosh.app) to compress)

---

## Troubleshooting

### Build Fails on Cloudflare

Check the build logs in Cloudflare dashboard → Workers & Pages → your project → Deployments. Common issues:
- **Frontmatter validation error**: You have a typo in a `.md` file's frontmatter. The error will tell you which field is wrong.
- **Missing field**: You forgot a required frontmatter field. Check the schema above.
- **Invalid specialization/playstyle/category**: You used a value that isn't in the allowed list.

### Content Not Showing on Home Page

The home page shows all content from all four collections. If your post isn't showing:
1. Make sure the file is in the correct `src/content/` subdirectory
2. Make sure the filename doesn't start with `_` (underscore-prefixed files are templates)
3. Make sure the frontmatter is valid (test with `npm run dev` first)

### Filtering Not Working

The home page filters by content type. Make sure the `data-type` attribute on each post card matches the filter value. If you haven't changed any code, this should work automatically.

### Site Loads Slowly

The static site should load in under 1 second from Cloudflare's CDN. If it's slow:
- Check if images are too large (keep under 500KB each)
- The hero banner at `public/images/hero-banner.jpg` is 3.4MB — consider compressing it
- Use [PageSpeed Insights](https://pagespeed.web.dev) to diagnose

### How to Roll Back a Bad Deploy

Every push creates a new deployment. To roll back:
1. Go to Cloudflare → Workers & Pages → your project → Deployments
2. Find the last working deployment
3. Click the three dots → **Rollback to this deployment**
