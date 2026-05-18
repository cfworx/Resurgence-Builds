const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src/content');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.md')) {
      let content = fs.readFileSync(fullPath, 'utf-8');

      // Find all occurrences of "---" and check if there's a DUPLICATE frontmatter block
      // A duplicate means we have:  --- ... --- ... ---  (three dashes total)
      const parts = content.split(/^---$/m);
      // parts[0] = empty (before first ---)
      // parts[1] = first frontmatter body
      // parts[2] = content after first closing ---
      // If parts[2] itself starts with more frontmatter keys, we have a duplicate injected at wrong place

      // The actual bug: our inject script injected fields BEFORE the closing "---",
      // but some files had duplicated frontmatter blocks injected entirely.
      // Let's detect a duplicate by counting "---" markers.

      const dashMatches = content.match(/^---$/gm);
      if (dashMatches && dashMatches.length > 2) {
        // We have more than the expected open + close pair
        // Strategy: keep only the first frontmatter block (between first and second ---),
        // strip duplicate keys from it, and append the rest of the content.
        
        const firstDash = content.indexOf('---');
        let secondDash = content.indexOf('\n---\n', firstDash + 3);
        if (secondDash === -1) secondDash = content.indexOf('\n---', firstDash + 3);
        
        let thirdDash = content.indexOf('\n---\n', secondDash + 4);
        if (thirdDash === -1) thirdDash = content.indexOf('\n---', secondDash + 4);
        
        if (firstDash !== -1 && secondDash !== -1 && thirdDash !== -1) {
          // Extract content portions
          const frontmatterBody = content.substring(firstDash + 3, secondDash);
          // The "extra" stuff between second and third --- (the duplicate injection)
          // Skip it and go straight to the real body content
          const realBodyStart = thirdDash + 4;
          const bodyContent = content.substring(realBodyStart);
          
          // Rebuild clean file
          content = `---${frontmatterBody}\n---\n${bodyContent}`;
          fs.writeFileSync(fullPath, content);
          console.log(`Fixed duplicate frontmatter in ${path.basename(fullPath)}`);
        }
      }
      
      // Also clean up stray literal \n at end of lines in body
      content = fs.readFileSync(fullPath, 'utf-8');
      const cleaned = content.replace(/\\n(\s*)$/gm, '$1');
      if (cleaned !== content) {
        fs.writeFileSync(fullPath, cleaned);
        console.log(`Cleaned literal \\n in ${path.basename(fullPath)}`);
      }
    }
  }
}

processDir(srcDir);
console.log('Done!');
