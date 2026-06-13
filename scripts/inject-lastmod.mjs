import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sitemapPath = path.join(__dirname, '..', 'dist', 'sitemap-0.xml');
const contentDir = path.join(__dirname, '..', 'src', 'content');

console.log('Injecting lastmod into sitemap...');

try {
  if (!fs.existsSync(sitemapPath)) {
    console.log('Sitemap not found at dist/sitemap-0.xml. Skipping lastmod injection.');
    process.exit(0);
  }

  let sitemapXML = fs.readFileSync(sitemapPath, 'utf8');

  // Match <url> blocks that contain <loc> and optionally <lastmod>
  const urlBlockRegex = /<url>\s*<loc>(.*?)<\/loc>(?:\s*<lastmod>[^<]*<\/lastmod>)?/g;
  let match;
  let updateCount = 0;

  while ((match = urlBlockRegex.exec(sitemapXML)) !== null) {
    const fullMatch = match[0];
    const url = match[1];

    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.replace(/\/$/, '');
      const parts = pathname.split('/').filter(Boolean);

      if (parts.length === 2) {
        const folder = parts[0];
        const slug = parts[1];

        // Check content directories: builds, guides, news, patch-notes
        const possiblePaths = [
          path.join(contentDir, folder, `${slug}.md`),
          path.join(contentDir, folder, `${slug}.mdx`),
        ];

        // Also check hyphenated folder names (patch-notes -> patch-notes)
        let filePathToRead = null;
        for (const p of possiblePaths) {
          if (fs.existsSync(p)) {
            filePathToRead = p;
            break;
          }
        }

        if (filePathToRead) {
          const mdContent = fs.readFileSync(filePathToRead, 'utf8');
          // Match various date fields in frontmatter
          const dateMatch = mdContent.match(/(?:lastUpdated|publishDate|patchDate|date):\s*"?(\d{4}-\d{2}-\d{2})/);
          if (dateMatch && dateMatch[1]) {
            const lastmod = dateMatch[1];
            const replacement = `<url><loc>${url}</loc><lastmod>${lastmod}</lastmod>`;
            sitemapXML = sitemapXML.replace(fullMatch, replacement);
            updateCount++;
          }
        }
      }
    } catch (e) {
      // Skip malformed URLs
    }
  }

  fs.writeFileSync(sitemapPath, sitemapXML, 'utf8');
  console.log(`Successfully injected lastmod into ${updateCount} sitemap URLs.`);

} catch (error) {
  console.error('Error injecting lastmod:', error);
}
