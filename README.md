# Resurgence Builds

Independent fan resource for **Tom Clancy's The Division Resurgence** — builds, guides, tier lists, patch notes, and a complete game database.

## Tech Stack

- **Framework:** Astro 5.x (static site generation)
- **Content:** Astro Content Collections with Zod schemas
- **Styling:** Vanilla CSS with custom properties
- **Search:** Pagefind (static search index)
- **Feed:** @astrojs/rss
- **Sitemap:** @astrojs/sitemap
- **Hosting:** Cloudflare Pages

## Quick Start

```bash
git clone <repo-url>
cd resurgence-builds
npm install
npm run dev          # starts dev server at localhost:4321
```

## Build for Production

```bash
npm run build        # builds site + generates Pagefind index
npm run preview      # preview the production build locally
```

## Project Structure

```
resurgence-builds/
├── public/              # Static assets (robots.txt, _headers, favicon)
├── src/
│   ├── components/      # Reusable Astro components
│   ├── content/         # Markdown content (builds, guides, news, etc.)
│   ├── content.config.ts # Content collection schemas
│   ├── data/            # JSON data collections
│   ├── layouts/         # Page layouts
│   ├── pages/           # All routes
│   └── styles/          # Global CSS
├── DEV-GUIDE.md         # Developer documentation
├── WORKFLOW.md          # Operator workflow guide
└── package.json
```

## Documentation

- **[DEV-GUIDE.md](./DEV-GUIDE.md)** — Developer setup, deployment, and architecture
- **[WORKFLOW.md](./WORKFLOW.md)** — Day-to-day content management for non-technical operators

## Legal

This is an independent fan site. Not affiliated with, endorsed by, or sponsored by Ubisoft Entertainment SA. All game trademarks and copyrights belong to Ubisoft.
