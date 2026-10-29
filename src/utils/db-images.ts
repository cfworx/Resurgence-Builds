// In-game card images for the database pages. Made by scripts/build-db-images.mjs from the
// evidence frames in research/build-database/evidence; the manifest has each file's real size.
import manifest from '../data/db-images.json';

export type DbImage = { src: string; width: number; height: number; srcset: [number, string][] };

const SITE = 'https://resurgencebuilds.com';
const images = manifest as unknown as Record<string, Record<string, DbImage>>;
const lists = manifest as unknown as Record<string, { names?: string[] }>;

/** e.g. dbImage('os-protocols/ambusher') or dbImage('exotic-weapons/scorpio', 'hero') */
export function dbImage(id: string, variant: 'card' | 'hero' = 'card'): DbImage | undefined {
  return images[id]?.[variant];
}

/** Weapons shown on an Armory screen, e.g. dbImageNames('armory/smg-t1'). */
export function dbImageNames(id: string): string[] {
  return lists[id]?.names ?? [];
}

/** Armory screen id for a weapon class and tier: ('SMG', 'T1') -> 'armory/smg-t1'. */
export function armoryScreenId(type: string, tier?: string): string | undefined {
  if (!tier) return undefined;
  return `armory/${type.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${tier.toLowerCase()}`;
}

/** schema.org ImageObject with the image's real size. */
export function imageObject(img: DbImage) {
  return { '@type': 'ImageObject', url: `${SITE}${img.src}`, width: img.width, height: img.height };
}

/** Recording date of the evidence frames (research/build-database/recordings.json). */
export const CARDS_RECORDED = 'October 28, 2026';
