import fs from 'fs';
const dir = 'src/content/builds';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const filepath = `${dir}/${file}`;
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Replace remaining math symbol corruptions
  content = content.replace(/âˆ’/g, '−'); // minus sign
  content = content.replace(/Ã—/g, '×'); // multiply sign
  content = content.replace(/â‰ˆ/g, '≈'); // approximately equals

  fs.writeFileSync(filepath, content, 'utf8');
});
console.log("Fixed remaining math symbols encoding issues.");
