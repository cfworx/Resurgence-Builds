/**
 * rehype-table-cards.mjs
 * Gets markdown tables ready to fit a phone screen without sideways scrolling.
 *
 * Every body cell gets a data-label with its column header. On phones (see "Phone tables" in
 * src/styles/global.css) the CSS then shows:
 *   - .t-cards: each row as a card, the first cell as its title and every other cell as "LABEL value".
 *     Used for tables with 3+ columns, unless they are short enough to fit as a table.
 *   - .t-pairs: "Stat | Value | Stat | Value" tables as one key-value pair per line.
 * Two-column tables and short three- or four-column tables (numbers, short names) stay tables.
 * Wider screens never change.
 */
import { visit } from 'unist-util-visit';

const text = (node) => {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  return (node.children || []).map(text).join('');
};
const clean = (s) => s.replace(/\s+/g, ' ').trim();
const kids = (node, tag) => (node.children || []).filter((c) => c.type === 'element' && c.tagName === tag);

// A table this short fits a 343px column as a table, so it stays one.
const fitsAsTable = (cols, longest) => (cols === 3 && longest <= 30) || (cols === 4 && longest <= 16);

export default function rehypeTableCards() {
  return (tree) => {
    visit(tree, 'element', (table) => {
      if (table.tagName !== 'table') return;
      const thead = kids(table, 'thead')[0];
      const headRow = thead && kids(thead, 'tr')[0];
      if (!headRow) return;
      const labels = kids(headRow, 'th').map((th) => clean(text(th)));
      const cols = labels.length;
      let longest = 0;
      for (const tbody of kids(table, 'tbody')) {
        for (const tr of kids(tbody, 'tr')) {
          // count th and td cells so a leading row header doesn't shift the labels
          (tr.children || []).filter((c) => c.type === 'element' && (c.tagName === 'td' || c.tagName === 'th')).forEach((cell, i) => {
            if (cell.tagName !== 'td') return;
            cell.properties = cell.properties || {};
            cell.properties.dataLabel = labels[i] ?? '';
            longest = Math.max(longest, clean(text(cell)).length);
          });
        }
      }
      const pairs = cols === 4 && labels[0] && labels[0] === labels[2] && labels[1] === labels[3];
      let cls = null;
      if (pairs) cls = 't-pairs';
      else if (cols >= 3 && !fitsAsTable(cols, longest)) cls = 't-cards';
      if (!cls) return;
      table.properties = table.properties || {};
      const existing = table.properties.className || [];
      table.properties.className = [...(Array.isArray(existing) ? existing : [existing]), cls];
    });
  };
}
