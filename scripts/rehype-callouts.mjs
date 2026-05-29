import { visit } from 'unist-util-visit';

/**
 * Rehype plugin – converts GitHub-style blockquote admonitions into styled
 * callout divs.
 *
 * Supported syntax inside markdown:
 *   > [!INFO]
 *   > Some informational text.
 *
 *   > [!WARNING] Custom Title
 *   > Be careful about this.
 *
 *   > [!DANGER]
 *   > Critical information here.
 */

const CALLOUT_RE = /^\[!(INFO|WARNING|DANGER)\]\s*(.*)/;

const DEFAULT_TITLES = {
  INFO: 'Info',
  WARNING: 'Warning',
  DANGER: 'Danger',
};

const ICONS = {
  INFO: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
  WARNING: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  DANGER: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
};

/**
 * Recursively extract raw text from an hast node.
 */
function extractText(node) {
  if (node.type === 'text') return node.value;
  if (node.children) return node.children.map(extractText).join('');
  return '';
}

/**
 * Find the first text node at any depth in the tree and return it along with
 * its direct parent so we can mutate the text value in-place.
 */
function findFirstTextNode(node) {
  if (node.type === 'text') return { textNode: node, parent: null };
  if (node.children) {
    for (const child of node.children) {
      if (child.type === 'text') return { textNode: child, parent: node };
      const deeper = findFirstTextNode(child);
      if (deeper) return deeper;
    }
  }
  return null;
}

export default function rehypeCallouts() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'blockquote' || !parent) return;

      // Locate the first text node inside the blockquote
      const result = findFirstTextNode(node);
      if (!result) return;

      const { textNode } = result;
      const match = textNode.value.match(CALLOUT_RE);
      if (!match) return;

      const calloutType = match[1]; // INFO | WARNING | DANGER
      const customTitle = match[2].trim();
      const title = customTitle || DEFAULT_TITLES[calloutType];
      const typeLower = calloutType.toLowerCase();

      // Strip the matched prefix from the text node so it doesn't appear in
      // the body content.  If there is a newline after the tag line, also
      // remove it.
      textNode.value = textNode.value
        .replace(CALLOUT_RE, '')
        .replace(/^\n/, '');

      // Build the body children — reuse the blockquote's existing children
      // (which now have the tag line stripped).
      const bodyChildren = node.children;

      // Construct the replacement callout node
      const calloutNode = {
        type: 'element',
        tagName: 'aside',
        properties: {
          className: ['callout', `callout--${typeLower}`],
          role: 'note',
          ariaLabel: `${title} callout`,
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: { className: ['callout__header'] },
            children: [
              { type: 'raw', value: ICONS[calloutType] },
              {
                type: 'element',
                tagName: 'strong',
                properties: { className: ['callout__title'] },
                children: [{ type: 'text', value: title }],
              },
            ],
          },
          {
            type: 'element',
            tagName: 'div',
            properties: { className: ['callout__body'] },
            children: bodyChildren,
          },
        ],
      };

      // Replace the blockquote in the parent's children array
      parent.children.splice(index, 1, calloutNode);
    });
  };
}
