const fs = require('fs');
const dir = 'src/content/builds';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
files.forEach(file => {
  const filepath = `${dir}/${file}`;
  const lines = fs.readFileSync(filepath, 'utf8').split('\n');
  let newLines = [];
  let skip = false;
  for (let line of lines) {
    if (line.trim() === '## Table of Contents') {
      skip = true;
    } else if (skip && line.startsWith('## ')) {
      skip = false;
    }
    if (!skip) {
      newLines.push(line);
    }
  }
  fs.writeFileSync(filepath, newLines.join('\n'));
});
