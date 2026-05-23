const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'pages', 'database');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro')).map(f => path.join(dir, f));
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/''@type'/g, "'@type'");
  fs.writeFileSync(file, content);
}
console.log('Fixed quotes');
