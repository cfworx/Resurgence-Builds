// Helpers for translated guides (TRANSLATIONS.md): which language versions a guide has, and the hreflang links
// every version carries.
import { getCollection, type CollectionEntry } from 'astro:content';
import { LANGS, langByCode, type Lang } from '../data/languages';

const SITE = 'https://resurgencebuilds.com';

export type Translation = CollectionEntry<'translations'>;

export interface Version {
  /** 'en' or a code from src/data/languages.ts */
  code: string;
  /** BCP 47 tag for hreflang */
  tag: string;
  /** The language's own name */
  name: string;
  path: string;
}

/** Every translation whose language is configured. A file in an unknown language folder fails the build. */
export async function allTranslations(): Promise<Translation[]> {
  const all = await getCollection('translations');
  for (const t of all) {
    if (!langByCode(t.data.lang)) throw new Error(`Translation ${t.id}: language "${t.data.lang}" is not in src/data/languages.ts`);
    if (!t.id.startsWith(`${t.data.lang}/`)) throw new Error(`Translation ${t.id}: the file must sit in src/content/translations/${t.data.lang}/`);
  }
  return all;
}

export const translationPath = (t: Translation) => `/${t.data.lang}/guides/${t.data.source}/`;

/** English first, then the translations in the order of src/data/languages.ts. */
export function versionsOf(guideId: string, translations: Translation[]): Version[] {
  const mine = translations.filter((t) => t.data.source === guideId);
  const out: Version[] = [{ code: 'en', tag: 'en', name: 'English', path: `/guides/${guideId}/` }];
  for (const lang of LANGS) {
    const t = mine.find((x) => x.data.lang === lang.code);
    if (t) out.push({ code: lang.code, tag: lang.tag, name: lang.name, path: translationPath(t) });
  }
  return out;
}

export const alternatesOf = (versions: Version[]) => versions.map((v) => ({ hreflang: v.tag, href: `${SITE}${v.path}` }));

/** Languages that have at least one translated guide, in configured order. */
export function activeLangs(translations: Translation[]): Lang[] {
  return LANGS.filter((l) => translations.some((t) => t.data.lang === l.code));
}
