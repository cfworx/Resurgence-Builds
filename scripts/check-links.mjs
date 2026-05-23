import fs from 'fs';
import path from 'path';

function getHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  list.forEach(f => {
    const name = path.join(dir, f);
    if (fs.statSync(name).isDirectory()) {
      getHtmlFiles(name, files);
    } else if (name.endsWith('.html')) {
      files.push(name);
    }
  });
  return files;
}

const distDir = path.join(process.cwd(), 'dist');
const files = getHtmlFiles(distDir);

let brokenLinks = 0;
const checked = new Set();

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Very basic regex to find href="..." and src="..."
  const linkRegex = /(?:href|src)="([^"]+)"/g;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    let link = match[1];
    
    // Ignore external links, mailto, tel, empty, hashes
    if (link.startsWith('http') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('#') || link === '') {
      continue;
    }
    
    // Strip hash and query params for file checking
    link = link.split('#')[0].split('?')[0];
    if (link === '') continue;

    // Resolve local path
    // Most links are absolute from root (e.g., /images/foo.png or /builds/)
    let localPath = '';
    if (link.startsWith('/')) {
      localPath = path.join(distDir, link);
    } else {
      // Relative link (should be rare in Astro but possible)
      localPath = path.join(path.dirname(file), link);
    }

    // If it's a directory link (like /builds/), Astro usually builds it as /builds/index.html
    if (fs.existsSync(localPath) && fs.statSync(localPath).isDirectory()) {
      localPath = path.join(localPath, 'index.html');
    } else if (!fs.existsSync(localPath) && !path.extname(localPath)) {
        // Try appending .html
        localPath = localPath + '.html';
    }

    if (!checked.has(localPath)) {
      if (!fs.existsSync(localPath)) {
        console.log(`BROKEN LINK FOUND:`);
        console.log(`  File: ${file.replace(distDir, '')}`);
        console.log(`  Target: ${link}`);
        brokenLinks++;
      }
      checked.add(localPath);
    }
  }
});

console.log(`\nScan complete. Found ${brokenLinks} broken internal links/images.`);
