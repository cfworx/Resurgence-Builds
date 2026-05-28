/**
 * Post-build script: Injects <image:image> entries into the sitemap.
 * Run after `astro build` and after `inject-lastmod.mjs`.
 * 
 * Reads content frontmatter to find hero images, then patches
 * the generated sitemap-0.xml with <image:image> child elements.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITEMAP_PATH = path.join(ROOT, 'dist', 'sitemap-0.xml');
const SITE_URL = 'https://resurgencebuilds.com';

// Map content slugs to their hero images by reading frontmatter
function getImageMap() {
  const imageMap = new Map();
  const contentDirs = [
    { dir: 'builds', prefix: '/builds/', field: 'featuredImage' },
    { dir: 'guides', prefix: '/guides/', field: 'featuredImage' },
    { dir: 'news', prefix: '/news/', field: 'image' },
    { dir: 'patchNotes', prefix: '/patch-notes/', field: 'image' },
  ];

  for (const { dir, prefix, field } of contentDirs) {
    const contentDir = path.join(ROOT, 'src', 'content', dir);
    if (!fs.existsSync(contentDir)) continue;
    
    for (const file of fs.readdirSync(contentDir).filter(f => f.endsWith('.md'))) {
      const content = fs.readFileSync(path.join(contentDir, file), 'utf8');
      const frontmatter = content.split('---')[1];
      if (!frontmatter) continue;
      
      // Extract image path
      const imgMatch = frontmatter.match(new RegExp(`${field}:\\s*["']?(/images/[^"'\\s]+)["']?`));
      if (!imgMatch) continue;
      
      // Extract title for image:title
      const titleMatch = frontmatter.match(/title:\s*["'](.+?)["']/);
      
      // Extract imageAlt for image:caption
      const altMatch = frontmatter.match(/imageAlt:\s*["'](.+?)["']/);
      
      const slug = file.replace(/\.md$/, '');
      const pageUrl = `${SITE_URL}${prefix}${slug}/`;
      
      imageMap.set(pageUrl, {
        loc: `${SITE_URL}${imgMatch[1]}`,
        title: titleMatch ? titleMatch[1] : slug.replace(/-/g, ' '),
        caption: altMatch ? altMatch[1] : undefined,
      });
    }
  }
  
  return imageMap;
}

function run() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.log('⚠️  sitemap-0.xml not found, skipping image injection');
    return;
  }
  
  let xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const imageMap = getImageMap();
  let injected = 0;
  
  for (const [pageUrl, image] of imageMap) {
    // Escape XML special characters
    const escXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    
    const imageXml = `<image:image><image:loc>${escXml(image.loc)}</image:loc><image:title>${escXml(image.title)}</image:title>${image.caption ? `<image:caption>${escXml(image.caption)}</image:caption>` : ''}</image:image>`;
    
    // Find the </url> after this page's <loc> and inject before it
    const locTag = `<loc>${pageUrl}</loc>`;
    const locIndex = xml.indexOf(locTag);
    if (locIndex === -1) continue;
    
    // Find the closing </url> after this loc
    const closeUrlIndex = xml.indexOf('</url>', locIndex);
    if (closeUrlIndex === -1) continue;
    
    xml = xml.slice(0, closeUrlIndex) + imageXml + xml.slice(closeUrlIndex);
    injected++;
  }
  
  fs.writeFileSync(SITEMAP_PATH, xml);
  console.log(`✅ Injected ${injected} <image:image> entries into sitemap`);
}

run();
