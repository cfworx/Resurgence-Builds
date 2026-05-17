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

  // Regex to find <url><loc>...</loc></url> blocks
  const urlBlockRegex = /<url>\s*<loc>(.*?)<\/loc>\s*<\/url>/g;
  let match;
  const updates = [];

  while ((match = urlBlockRegex.exec(sitemapXML)) !== null) {
    const fullMatch = match[0];
    const url = match[1];

    // Example URL: https://resurgencebuilds.com/builds/legendary-healer-field-medic/
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.replace(/\/$/, ''); // e.g. /builds/legendary-healer
    const parts = pathname.split('/').filter(Boolean); // ['builds', 'legendary-healer-field-medic']

    if (parts.length === 2) {
      const folder = parts[0]; // builds, guides, news
      const slug = parts[1]; // legendary-healer-field-medic
      
      const possibleMdPath = path.join(contentDir, folder, `${slug}.md`);
      const possibleMdxPath = path.join(contentDir, folder, `${slug}.mdx`);
      
      let filePathToRead = null;
      if (fs.existsSync(possibleMdPath)) filePathToRead = possibleMdPath;
      else if (fs.existsSync(possibleMdxPath)) filePathToRead = possibleMdxPath;

      if (filePathToRead) {
        const mdContent = fs.readFileSync(filePathToRead, 'utf8');
        const dateMatch = mdContent.match(/(?:lastUpdated|publishDate|date):\s*"?(\d{4}-\d{2}-\d{2})"?/);
        if (dateMatch && dateMatch[1]) {
          const lastmod = dateMatch[1];
          // Replace <loc>URL</loc> with <loc>URL</loc><lastmod>DATE</lastmod>
          const replacement = `<url><loc>${url}</loc><lastmod>${lastmod}</lastmod></url>`;
          updates.push({ old: fullMatch, new: replacement });
        }
      }
    }
  }

  // Apply all updates
  for (const update of updates) {
    sitemapXML = sitemapXML.replace(update.old, update.new);
  }

  fs.writeFileSync(sitemapPath, sitemapXML, 'utf8');
  console.log(`Successfully injected lastmod into ${updates.length} sitemap URLs.`);

} catch (error) {
  console.error('Error injecting lastmod:', error);
}
