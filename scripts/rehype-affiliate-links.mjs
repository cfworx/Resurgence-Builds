import { visit } from 'unist-util-visit';

/**
 * Marks Amazon affiliate links in markdown the way Google and the FTC expect: rel="sponsored noopener",
 * opening in a new tab. A link counts as an affiliate link when it goes to amazon.com and carries a tag=
 * parameter. Write them as https://www.amazon.com/dp/<ASIN>?tag=<AMAZON_TAG from src/data/site-config.ts>.
 * Runs after rehype-external-links (which gives every external link "noopener noreferrer").
 * The build's audit checks the tag is ours and that the Associates sentence is on the page.
 */
export default function rehypeAffiliateLinks() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = node.properties?.href;
      if (typeof href !== 'string') return;
      let url;
      try { url = new URL(href); } catch { return; }
      if (!/(^|\.)amazon\.com$/i.test(url.hostname) || !url.searchParams.get('tag')) return;
      node.properties.rel = ['sponsored', 'noopener'];
      node.properties.target = '_blank';
    });
  };
}
