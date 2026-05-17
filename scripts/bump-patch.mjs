import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newPatch = process.argv[2];

if (!newPatch) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Please provide a patch version. Example: npm run bump-patch "Season 2"');
  process.exit(1);
}

const buildsDir = path.join(__dirname, '..', 'src', 'content', 'builds');
const today = new Date().toISOString().split('T')[0];

console.log(`\x1b[36m%s\x1b[0m`, `Starting Freshness Bump...`);
console.log(`Target Patch: ${newPatch}`);
console.log(`Target Date: ${today}`);

try {
  const files = fs.readdirSync(buildsDir);
  let updatedCount = 0;

  for (const file of files) {
    if (file.endsWith('.md') || file.endsWith('.mdx')) {
      const filePath = path.join(buildsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');

      // Update the patch field
      content = content.replace(/patch:\s*".*"/g, `patch: "${newPatch}"`);
      content = content.replace(/patch:\s*'.*'/g, `patch: "${newPatch}"`);
      
      // Update the lastUpdated field
      content = content.replace(/lastUpdated:\s*\d{4}-\d{2}-\d{2}/g, `lastUpdated: ${today}`);

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  \x1b[32m✔\x1b[0m Updated ${file}`);
      updatedCount++;
    }
  }

  console.log(`\n\x1b[32m%s\x1b[0m`, `Success! Bumed ${updatedCount} builds to patch ${newPatch} with today's date.`);

} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', 'Error scanning the builds directory:');
  console.error(error);
  process.exit(1);
}
