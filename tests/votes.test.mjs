// Unit tests for the vote API's shared code (lib/votes.mjs). Run: npm run test:votes
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COOKIE_NAME, TIERS, VOTE_LIMITS, checkItem, checkKind, checkTier, compareItems, networkOf, newVoterId, publicJson,
  readVoter, summarize, tierFor, voterCookie,
} from '../lib/votes.mjs';

test('kinds, items and tiers are checked strictly', () => {
  assert.equal(checkKind('build'), 'build');
  assert.equal(checkKind('os'), 'os');
  for (const k of ['Build', 'weapon', '', null, 1, '__proto__', 'constructor', 'toString']) assert.equal(checkKind(k), null, String(k));
  assert.equal(checkItem('tactical-pharma-season-2-build-ggreborn'), 'tactical-pharma-season-2-build-ggreborn');
  assert.equal(checkItem('cover-shooter'), 'cover-shooter');
  for (const i of ['', 'Cover-Shooter', '-x', 'x-', 'a--b', '../etc', 'a/b', 'a b', 'x'.repeat(121), 42, null]) {
    assert.equal(checkItem(i), null, String(i));
  }
  for (const t of TIERS) {
    assert.equal(checkTier(t), t);
    assert.equal(checkTier(t.toLowerCase()), t);
  }
  for (const t of ['E', 'F', 'SS', '', 5, null, 'S+']) assert.equal(checkTier(t), null, String(t));
});

test('the average picks the tier, halfway rounds up', () => {
  assert.equal(tierFor(5), 'S');
  assert.equal(tierFor(4.5), 'S');
  assert.equal(tierFor(4.49), 'A');
  assert.equal(tierFor(3.5), 'A');
  assert.equal(tierFor(3.49), 'B');
  assert.equal(tierFor(2.5), 'B');
  assert.equal(tierFor(1.5), 'C');
  assert.equal(tierFor(1.49), 'D');
  assert.equal(tierFor(1), 'D');
  assert.equal(tierFor(0), null);
  assert.equal(tierFor(NaN), null);
});

test('summarize turns counts into a tier, and one vote is enough', () => {
  assert.deepEqual(summarize({ s: 0, a: 0, b: 0, c: 0, d: 0 }), { n: 0, s: 0, a: 0, b: 0, c: 0, d: 0, avg: 0, tier: null });
  assert.equal(summarize(undefined).n, 0);
  assert.equal(summarize({ c: 1 }).tier, 'C');
  assert.equal(summarize({ s: 1, a: 1 }).tier, 'S');            // 4.5
  assert.equal(summarize({ s: 1, b: 1 }).tier, 'A');            // 4.0
  assert.equal(summarize({ s: 1, d: 1 }).tier, 'B');            // 3.0
  const mixed = summarize({ s: 2, a: 1, b: 0, c: 0, d: 1 });    // (10 + 4 + 1) / 4 = 3.75
  assert.equal(mixed.n, 4);
  assert.equal(mixed.avg, 3.75);
  assert.equal(mixed.tier, 'A');
  assert.equal(summarize({ s: '3', a: -2 }).n, 3);              // strings count, negatives don't
});

test('ranking order: average, then votes, then name', () => {
  const rows = [
    { name: 'Bravo', avg: 4, n: 2 },
    { name: 'Alpha', avg: 4, n: 2 },
    { name: 'Charlie', avg: 4, n: 5 },
    { name: 'Delta', avg: 4.8, n: 1 },
  ].sort(compareItems);
  assert.deepEqual(rows.map((r) => r.name), ['Delta', 'Charlie', 'Alpha', 'Bravo']);
});

test('networkOf keeps IPv4 whole and IPv6 to its /64', () => {
  assert.equal(networkOf('203.0.113.7'), '203.0.113.7');
  assert.equal(networkOf('::ffff:203.0.113.7'), '203.0.113.7');
  assert.equal(networkOf('2001:db8:85a3:12:8a2e:370:7334:1'), '2001:db8:85a3:12::/64');
  assert.equal(networkOf('2001:0DB8:85A3:0012:0000:0000:0000:0001'), '2001:db8:85a3:12::/64');
  assert.equal(networkOf('2001:db8::1'), '2001:db8:0:0::/64');
  assert.equal(networkOf('2001:db8:85a3:12::dead:beef'), '2001:db8:85a3:12::/64');
  assert.equal(networkOf('2001:db8:85a3:12:ffff::'), '2001:db8:85a3:12::/64');
  assert.equal(networkOf('::1'), '0:0:0:0::/64');
  assert.equal(networkOf(''), '0.0.0.0');
  assert.equal(networkOf(undefined), '0.0.0.0');
});

const withCookie = (value) => new Request('https://resurgencebuilds.com/api/votes', { headers: { Cookie: value } });

test('voter cookies round-trip and reject forgeries', async () => {
  const id = newVoterId();
  assert.match(id, /^[0-9a-f]{24}$/);
  assert.notEqual(newVoterId(), id);
  const header = await voterCookie(id, 'salt-one');
  assert.match(header, new RegExp(`^${COOKIE_NAME}=${id}\\.[0-9a-f]{32}; Max-Age=\\d+; Path=/api/votes; HttpOnly; Secure; SameSite=Lax$`));
  assert.doesNotMatch(await voterCookie(id, 'salt-one', false), /Secure/);
  const pair = header.split(';')[0];
  assert.equal(await readVoter(withCookie(pair), 'salt-one'), id);
  assert.equal(await readVoter(withCookie(`theme=dark; ${pair}; other=1`), 'salt-one'), id);
  assert.equal(await readVoter(withCookie(pair), 'salt-two'), null);                      // signed with another secret
  const [name, value] = pair.split('=');
  const [vid, sig] = value.split('.');
  const flipped = sig.slice(0, -1) + (sig.endsWith('0') ? '1' : '0');
  assert.equal(await readVoter(withCookie(`${name}=${vid}.${flipped}`), 'salt-one'), null); // tampered signature
  assert.equal(await readVoter(withCookie(`${name}=${'0'.repeat(24)}.${sig}`), 'salt-one'), null); // swapped id
  assert.equal(await readVoter(withCookie(`x${pair}`), 'salt-one'), null);                 // another cookie's name
  assert.equal(await readVoter(withCookie(''), 'salt-one'), null);
  assert.equal(await readVoter(new Request('https://resurgencebuilds.com/api/votes'), 'salt-one'), null);
});

test('the public totals can be cached and are locked down', async () => {
  const res = publicJson({ kind: 'os', items: {} }, VOTE_LIMITS.cacheSeconds);
  assert.equal(res.headers.get('Cache-Control'), `public, max-age=${VOTE_LIMITS.cacheSeconds}`);
  assert.equal(res.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.match(res.headers.get('Content-Security-Policy'), /default-src 'none'/);
  assert.equal(res.headers.get('Set-Cookie'), null);
  assert.deepEqual(await res.json(), { kind: 'os', items: {} });
});
