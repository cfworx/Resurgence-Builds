/**
 * rehype-table-a11y.mjs
 * Adds scope="col" to <th> elements in markdown-rendered tables
 * to satisfy Lighthouse td-has-header accessibility audit.
 */
import { visit } from 'unist-util-visit';

export default function rehypeTableA11y() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'th') {
        node.properties = node.properties || {};
        if (!node.properties.scope) {
          node.properties.scope = 'col';
        }
      }
    });
  };
}
