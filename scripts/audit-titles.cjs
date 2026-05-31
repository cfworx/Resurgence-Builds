/**
 * Audit + auto-fix script for frontmatter titles and descriptions.
 * 
 * Usage:
 *   node scripts/audit-titles.cjs          # Report only
 *   node scripts/audit-titles.cjs --fix    # Auto-fix long titles/descriptions
 */

const fs = require('fs');
const path = require('path');

const FIX_MODE = process.argv.includes('--fix');

const TITLE_MAX = 60;
const DESC_MAX = 158;

// Directories to scan for frontmatter
const CONTENT_DIRS = [
  path.join(__dirname, '..', 'src', 'content', 'builds'),
  path.join(__dirname, '..', 'src', 'content', 'guides'),
  path.join(__dirname, '..', 'src', 'content', 'news'),
  path.join(__dirname, '..', 'src', 'content', 'patch-notes'),
];

// Regex to extract YAML frontmatter
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

function extractField(frontmatter, field) {
  // Handle quoted strings
  const quotedRe = new RegExp(`^${field}:\\s*["'](.+?)["']\\s*$`, 'm');
  const quotedMatch = frontmatter.match(quotedRe);
  if (quotedMatch) return quotedMatch[1];

  // Handle unquoted strings
  const unquotedRe = new RegExp(`^${field}:\\s*(.+?)\\s*$`, 'm');
  const unquotedMatch = frontmatter.match(unquotedRe);
  if (unquotedMatch) return unquotedMatch[1];

  return null;
}

function shortenTitle(title) {
  let t = title;

  // Remove common suffixes
  const suffixes = [
    / — Division Resurgence$/i,
    / \| Division Resurgence$/i,
    / - Division Resurgence$/i,
    / — The Division Resurgence$/i,
    / \| The Division Resurgence$/i,
    / · Resurgence Builds$/i,
    / \| Resurgence Builds$/i,
  ];

  for (const re of suffixes) {
    if (re.test(t) && t.replace(re, '').length >= 20) {
      t = t.replace(re, '');
    }
  }

  // Shorten "The Division Resurgence" → "Division Resurgence"
  t = t.replace(/\bThe Division Resurgence\b/g, 'Division Resurgence');

  // If still too long, try truncating at last word boundary before limit
  if (t.length > TITLE_MAX) {
    const truncated = t.substring(0, TITLE_MAX);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 30) {
      t = truncated.substring(0, lastSpace);
    }
  }

  return t;
}

function shortenDescription(desc) {
  let d = desc;
  
  // Shorten "The Division Resurgence" → "Division Resurgence"
  d = d.replace(/\bThe Division Resurgence\b/g, 'Division Resurgence');

  // If still too long, truncate at last sentence or word boundary
  if (d.length > DESC_MAX) {
    // Try to cut at a sentence boundary
    const truncated = d.substring(0, DESC_MAX);
    const lastPeriod = truncated.lastIndexOf('.');
    if (lastPeriod > 80) {
      d = truncated.substring(0, lastPeriod + 1);
    } else {
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > 60) {
        d = truncated.substring(0, lastSpace) + '…';
      }
    }
  }

  return d;
}

function replaceFieldInContent(content, field, oldValue, newValue) {
  // Try replacing quoted version first
  const quotedPatterns = [
    `${field}: "${oldValue}"`,
    `${field}: '${oldValue}'`,
  ];

  for (const pattern of quotedPatterns) {
    if (content.includes(pattern)) {
      // Use double quotes for the replacement
      const escaped = newValue.replace(/"/g, '\\"');
      return content.replace(pattern, `${field}: "${escaped}"`);
    }
  }

  // Try unquoted
  const unquotedPattern = `${field}: ${oldValue}`;
  if (content.includes(unquotedPattern)) {
    const escaped = newValue.replace(/"/g, '\\"');
    return content.replace(unquotedPattern, `${field}: "${escaped}"`);
  }

  return content;
}

// --- Main ---

let longTitles = 0;
let longDescs = 0;
let fixedTitles = 0;
let fixedDescs = 0;

for (const dir of CONTENT_DIRS) {
  if (!fs.existsSync(dir)) continue;
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(FRONTMATTER_RE);
    if (!match) continue;

    const frontmatter = match[1];
    const title = extractField(frontmatter, 'title');
    const desc = extractField(frontmatter, 'description');

    let modified = false;

    if (title && title.length > TITLE_MAX) {
      longTitles++;
      const shortened = shortenTitle(title);
      const relPath = path.relative(path.join(__dirname, '..'), filePath);
      
      if (shortened.length <= TITLE_MAX) {
        if (FIX_MODE) {
          content = replaceFieldInContent(content, 'title', title, shortened);
          modified = true;
          fixedTitles++;
          console.log(`✅ FIXED title (${title.length} → ${shortened.length}): ${relPath}`);
          console.log(`   Old: ${title}`);
          console.log(`   New: ${shortened}`);
        } else {
          console.log(`⚠️  TITLE too long (${title.length} chars): ${relPath}`);
          console.log(`   Current: ${title}`);
          console.log(`   Suggest: ${shortened} (${shortened.length} chars)`);
        }
      } else {
        console.log(`❌ TITLE still too long after auto-fix (${shortened.length} chars): ${relPath}`);
        console.log(`   Current: ${title}`);
        console.log(`   Best attempt: ${shortened}`);
      }
      console.log('');
    }

    if (desc && desc.length > DESC_MAX) {
      longDescs++;
      const shortened = shortenDescription(desc);
      const relPath = path.relative(path.join(__dirname, '..'), filePath);

      if (shortened.length <= DESC_MAX) {
        if (FIX_MODE) {
          content = replaceFieldInContent(content, 'description', desc, shortened);
          modified = true;
          fixedDescs++;
          console.log(`✅ FIXED description (${desc.length} → ${shortened.length}): ${relPath}`);
        } else {
          console.log(`⚠️  DESC too long (${desc.length} chars): ${relPath}`);
          console.log(`   Current: ${desc}`);
          console.log(`   Suggest: ${shortened} (${shortened.length} chars)`);
        }
      } else {
        console.log(`❌ DESC still too long after auto-fix (${shortened.length} chars): ${relPath}`);
        console.log(`   Current: ${desc}`);
        console.log(`   Best attempt: ${shortened}`);
      }
      console.log('');
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
    }
  }
}

console.log('─'.repeat(60));
console.log(`Titles  > ${TITLE_MAX} chars: ${longTitles} found${FIX_MODE ? `, ${fixedTitles} fixed` : ''}`);
console.log(`Descriptions > ${DESC_MAX} chars: ${longDescs} found${FIX_MODE ? `, ${fixedDescs} fixed` : ''}`);

if (!FIX_MODE && (longTitles > 0 || longDescs > 0)) {
  console.log('\nRun with --fix to auto-apply corrections:');
  console.log('  node scripts/audit-titles.cjs --fix');
}
