const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const databaseDir = path.join(srcDir, 'pages', 'database');
const globalCssPath = path.join(srcDir, 'styles', 'global.css');

const files = fs.readdirSync(databaseDir).filter(f => f.endsWith('.astro'));

let removedAny = false;

files.forEach(file => {
  const filePath = path.join(databaseDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace from .db-grid up to </style> or next class
  // A robust way is to just find <style> and </style> and extract only the CSS we want to keep, or just clear out the known blocks.
  // Actually, since ALL the css inside <style> in these files is mostly duplicated, let's see if we can just wipe it out and put it all in global.css.
  
  // Let's replace the .db-grid to the end of .source-label
  const regex = /\\.db-grid\\s*\\{[\\s\\S]*?\\.source-label\\s*\\{[\\s\\S]*?\\}/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, '/* Global db-card styles moved to global.css */');
    fs.writeFileSync(filePath, content);
    console.log(`Refactored ${file}`);
    removedAny = true;
  }
});
