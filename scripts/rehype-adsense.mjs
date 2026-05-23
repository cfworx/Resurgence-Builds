import { visit } from 'unist-util-visit';

/**
 * Rehype plugin to automatically inject Google AdSense units into markdown content.
 * Follows SEO/UX guidelines:
 * - 1st ad after the 3rd paragraph.
 * - 2nd ad after the 8th paragraph (only for long content).
 */
export default function rehypeAdsense() {
  return (tree) => {
    let pCount = 0;

    const adHtml = `
      <div class="ad-slot ad-slot--in-content" aria-label="Advertisement" style="margin: 32px 0;">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-5813932024666862"
             data-ad-slot="8102223000"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
          try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { console.warn('AdSense block:', e) }
        </script>
      </div>
    `;

    // AST node for raw HTML
    const adNode = { type: 'raw', value: adHtml }; // Astro's rehype parser usually supports 'raw' or 'html'

    visit(tree, 'element', (node, index, parent) => {
      // We only want top-level paragraphs (direct children of the root document)
      // This prevents injecting ads inside blockquotes, lists, tables, etc.
      if (node.tagName === 'p' && parent && parent.type === 'root') {
        pCount++;

        // Inject after 3rd paragraph
        if (pCount === 3) {
          parent.children.splice(index + 1, 0, adNode);
          return index + 2; // Skip over the newly inserted node to prevent infinite loops
        }

        // Inject after 8th paragraph (long pages)
        if (pCount === 8) {
          parent.children.splice(index + 1, 0, adNode);
          return index + 2;
        }
      }
    });
  };
}
