const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages', 'database');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro')).map(f => path.join(dir, f));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /@type': 'ListItem',\s*position: i \+ 1,\s*name: [a-zA-Z0-9_.]+,?/g,
    `'@type': 'ListItem',\n    position: i + 1,\n    url: Astro.url.href,\n    item: {\n      '@type': 'Thing',\n      '@id': \`\${Astro.url.href}#item-\${i}\`,\n      name: item.name || item.talent || item.attribute || item.protocolName || 'Item',\n      description: item.description || item.talentDescription || item.effect || item.notes || \`Details for \${item.name || item.talent || item.attribute || item.protocolName || 'item'}\`,\n      url: Astro.url.href,\n      subjectOf: { '@id': 'https://resurgencebuilds.com/#division-resurgence' }\n    }`
  );
  content = content.replace(/itemListElement: [a-zA-Z0-9_]+\.map\(\(item: \{ name: string \}, i: number\)/g, match => match.replace('{ name: string }', 'any'));
  fs.writeFileSync(file, content);
}
console.log('Done');
