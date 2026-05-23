const fs = require('fs');
const path = require('path');

const buildsDir = path.join(__dirname, '..', 'src', 'content', 'builds');

function processFile(filePath) {
    if (!filePath.endsWith('.md')) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Split frontmatter from body so we don't mess up frontmatter
    const parts = content.split('---');
    if (parts.length < 3) return; // not standard frontmatter
    
    let frontmatter = parts[1];
    let body = parts.slice(2).join('---');

    // 1. Remove ID column from chip tables
    // Table Header: | Name | ID | Effect | or something similar
    // We only want to touch the chip tables. But actually, any table with "smc-" we can just replace.
    // It's safer to just replace the ID column specifically in the Geneva Suggestion table.
    // Look for lines that look like: | **Name** | smc-XX | ... |
    
    const lines = body.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Remove simple codes like (wt-20), (bp-19)
        // Includes matching trailing space if present before punctuation, or just replacing the code and its parens and a leading/trailing space.
        line = line.replace(/\s*\(\s*(wt|bp|ba|os|smc|gs|mk|kp|ew|sw|kh)-\d+\s*\)/g, '');
        
        // Remove codes inside other parens like (Chest, ba-12) -> (Chest)
        line = line.replace(/,\s*(wt|bp|ba|os|smc|gs|mk|kp|ew|sw|kh)-\d+\s*(?=\))/g, '');

        // Remove codes from table rows: | **Siphon** | smc-72 | +22.50% Engineering | -> | **Siphon** | +22.50% Engineering |
        if (line.match(/\|\s*\*\*.*?\*\*\s*\|\s*smc-\d+\s*\|/)) {
            line = line.replace(/\|\s*smc-\d+\s*\|/, '|');
        }
        
        // Table header: | Firmware Chip | ID | Effect | -> | Firmware Chip | Effect |
        if (line.match(/\|\s*Firmware Chip\s*\|\s*ID\s*\|\s*Effect\s*\|/i) || line.match(/\|\s*Name\s*\|\s*ID\s*\|\s*Effect\s*\|/i) || line.match(/\|\s*Skill Mod\s*\|\s*ID\s*\|\s*Effect\s*\|/i)) {
             line = line.replace(/\|\s*ID\s*\|/i, '|');
        }
        
        // Table separator: |---|---|---|
        // If the previous line was a table header that we just modified, and this line is a separator, we need to remove one column.
        if (i > 0 && lines[i-1].match(/\|\s*(Firmware Chip|Name|Skill Mod)\s*\|\s*Effect\s*\|/i) && line.match(/\|[-\s]+\|[-\s]+\|[-\s]+\|/)) {
             line = line.replace(/\|[-\s]+\|[-\s]+\|[-\s]+\|/, '|---|---|');
        }

        // What if the table header was just | Name | ID | Effect | ?
        if (line.match(/\|\s*Name\s*\|\s*ID\s*\|\s*Effect\s*\|/i)) {
             line = line.replace(/\|\s*ID\s*\|/i, '|');
        }

        // Just blindly strip smc-\d+ if it's standing alone in a table cell (as a fallback)
        if (line.match(/\|\s*smc-\d+\s*\|/)) {
             line = line.replace(/\|\s*smc-\d+\s*\|/, '|');
        }

        lines[i] = line;
    }
    
    body = lines.join('\n');
    
    // Also handle cases like `(bp-19)` that might not have a space before them.
    // Done by the regex above `\s*\(\s*(wt|bp|...)-\d+\s*\)`
    
    fs.writeFileSync(filePath, `---${frontmatter}---${body}`);
    console.log(`Processed ${filePath}`);
}

const files = fs.readdirSync(buildsDir);
for (const file of files) {
    processFile(path.join(buildsDir, file));
}
console.log('Done cleaning codes.');
