// Player votes for the tier lists, as the static pages draw them before the live numbers load. The numbers come from
// src/data/vote-snapshot.json, which scripts/pull-votes.mjs refreshes from the live API at every deploy (and which
// stays all-unranked in the repo). public/js/tier-votes.js then swaps in the live totals. See VOTES.md.
import snapshotData from '../data/vote-snapshot.json';
import { summarize, compareItems } from '../../lib/votes.mjs';

export type Tier = 'S' | 'A' | 'B' | 'C' | 'D';
export type VoteKind = 'build' | 'os';
export type VoteSummary = { n: number; s: number; a: number; b: number; c: number; d: number; avg: number; tier: Tier | null };

export const TIERS: Tier[] = ['S', 'A', 'B', 'C', 'D'];
/** One word under each letter, so the scale makes sense at a glance. */
export const TIER_WORDS: Record<Tier, string> = { S: 'Cracked', A: 'Strong', B: 'Solid', C: 'Mid', D: 'Yikes' };

export function snapshotItems(kind: VoteKind): Record<string, VoteSummary> {
  const raw = ((snapshotData as any)?.[kind]?.items ?? {}) as Record<string, unknown>;
  const out: Record<string, VoteSummary> = {};
  for (const [id, row] of Object.entries(raw)) {
    const sum = summarize(row) as VoteSummary;
    if (sum.n) out[id] = sum;
  }
  return out;
}

export const snapshotVotes = (kind: VoteKind) => Object.values(snapshotItems(kind)).reduce((n, s) => n + s.n, 0);

/** Time of the newest vote in the snapshot, or null. */
export function snapshotUpdated(kind: VoteKind): string | null {
  const u = (snapshotData as any)?.[kind]?.updated;
  return typeof u === 'string' && !Number.isNaN(Date.parse(u)) ? u : null;
}

export const voteCount = (n: number) => (n === 1 ? '1 vote' : `${n.toLocaleString('en-US')} votes`);

export { summarize, compareItems };
