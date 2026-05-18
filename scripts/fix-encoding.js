import fs from 'fs';
const dir = 'src/content/builds';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const filepath = `${dir}/${file}`;
  let content = fs.readFileSync(filepath, 'utf8');
  // Revert corrupted characters
  content = content.replace(/â€”/g, '—');
  content = content.replace(/â€œ/g, '"');
  content = content.replace(/â€/g, '"');
  content = content.replace(/â€™/g, "'");
  content = content.replace(/â€¢/g, "•");
  content = content.replace(/â€“/g, "–"); // en-dash
  content = content.replace(/â†’/g, "→");
  content = content.replace(/â\?\?/g, "—"); // sometimes it renders as â??
  
  // also check for "â€""
  content = content.replace(/â€"/g, '—');

  // and weird characters like "ï¿½"
  content = content.replace(/ï¿½/g, '—');
  
  fs.writeFileSync(filepath, content, 'utf8');
});
console.log("Fixed encoding issues.");
