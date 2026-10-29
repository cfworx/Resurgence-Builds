// Featured images for posts, made by scripts/build-post-images.mjs from in-game masters.
// postImage(featuredImage) returns the image's real size and its smaller copies when the image is
// in the manifest, so cards and post layouts can add srcset/sizes. Older images that aren't in the
// manifest fall back to a plain src.
import manifest from '../data/post-images.json';

export type PostImage = { width: number; height: number; srcset: [number, string][]; small: string };

const images = manifest as Record<string, PostImage>;

export function postImage(src?: string): PostImage | undefined {
  return src ? images[src] : undefined;
}

export function srcsetAttr(img?: PostImage): string | undefined {
  return img ? img.srcset.map(([w, url]) => `${url} ${w}w`).join(', ') : undefined;
}

// Rendered widths: cards sit in a 1 to 3 column grid (about 360 px wide on desktop); post heroes
// fill the article column (768 px for news and guides, about 800 px next to the build sidebar).
export const CARD_SIZES = '(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 45vw, 400px';
export const HERO_SIZES = '(max-width: 832px) calc(100vw - 32px), 800px';
