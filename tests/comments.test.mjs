// Unit tests for the comment API's shared code (lib/comments.mjs). Run: npm run test:comments
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LIMITS, allowedOrigin, applyVerdict, checkPath, cleanBody, cleanName, cleanText, hasLink, hashIp, ID_RE, isReservedName, newId,
  parseGuard, readJson, safetyCheck,
} from '../lib/comments.mjs';

test('cleanText strips control, zero-width and bidi characters and tidies spacing', () => {
  assert.equal(cleanText('  hi\u0000 there​  ‮gnp.exe‬ ', false), 'hi there gnp.exe');
  assert.equal(cleanText('a\r\nb\r\n\r\n\r\n\r\nc', true), 'a\nb\n\nc');
  assert.equal(cleanText('line one\nline two', false), 'line one line two');
  assert.equal(cleanText('tab\there', true), 'tab here');
  assert.equal(cleanText('é', true), 'é');                         // NFC
  assert.equal(cleanText('q\u0301\u0302\u0303\u0304\u0305', true), 'q\u0301\u0302'); // zalgo trimmed to two marks
  assert.equal(cleanText('family \u{1F468}‍\u{1F469}‍\u{1F467}', true), 'family \u{1F468}‍\u{1F469}‍\u{1F467}');
  assert.equal(cleanText(42, true), '');
  assert.equal(cleanText(undefined, true), '');
});

test('cleanName accepts normal names and rejects bad ones', () => {
  assert.deepEqual(cleanName('  Agent   Kelly '), { value: 'Agent Kelly' });
  assert.deepEqual(cleanName('Dad\nGamer'), { value: 'Dad Gamer' });
  assert.ok(cleanName('a').error);
  assert.ok(cleanName('   ').error);
  assert.ok(cleanName('x'.repeat(LIMITS.nameMax + 1)).error);
  assert.deepEqual(cleanName('x'.repeat(LIMITS.nameMax)), { value: 'x'.repeat(LIMITS.nameMax) });
  assert.ok(cleanName('!!!').error);
  assert.ok(cleanName({ name: 'obj' }).error);
  // Stored as text, never interpreted: HTML or SQL in a name is just characters.
  assert.deepEqual(cleanName("Robert'); DROP TABLE comments;--"), { value: "Robert'); DROP TABLE comments;--" });
  assert.deepEqual(cleanName('<b>Bold</b>'), { value: '<b>Bold</b>' });
});

test('reserved names', () => {
  for (const n of ['RapidF5', 'rapid f5', 'Ubisoft Support', 'UBISOFT', 'Resurgence Builds', 'Admin', 'the mod', 'Site Staff',
    'Official', 'TheDivMobile', 'Ｕｂｉｓｏｆｔ']) {
    assert.equal(isReservedName(n), true, n);
  }
  for (const n of ['Badminton Pro', 'Modern Warrior', 'Staffy', 'Unofficially Bad', 'Agent Kelly', 'Moderate Mike']) {
    assert.equal(isReservedName(n), false, n);
  }
});

test('cleanBody limits', () => {
  assert.deepEqual(cleanBody(' Great build! '), { value: 'Great build!' });
  assert.ok(cleanBody('k').error);
  assert.ok(cleanBody('!!!!').error);
  assert.ok(cleanBody('a'.repeat(LIMITS.bodyMax + 1)).error);
  assert.ok(cleanBody('no'.repeat(LIMITS.bodyMax / 2)).value);
  assert.ok(cleanBody('looo' + 'o'.repeat(40) + 'l').error);
  assert.ok(cleanBody('Nice\n\n\n\n\nbuild').value === 'Nice\n\nbuild');
  assert.deepEqual(cleanBody('<img src=x onerror=alert(1)>'), { value: '<img src=x onerror=alert(1)>' });
});

test('hasLink catches links, emails and spam domains but not normal text', () => {
  for (const t of ['see https://example.com', 'http://x.y', 'go to www.example.org', 'mail me at a.b@gmail.com',
    'cheap gold at goldshop.com', 'join discord.gg/abc123', 'visit bit.ly/xyz', 'best-site.xyz now']) {
    assert.equal(hasLink(t), true, t);
  }
  for (const t of ['Great build.Me too', 'Patch 1.1.2.2 fixed it', 'I use the M4.Works great', 'e.g. the MPX',
    'Season 2 Phase 2 is live', 'Nice one, 10/10', 'ok.Com on guys']) {
    assert.equal(hasLink(t), false, t);
  }
});

test('checkPath only accepts real comment sections', () => {
  for (const p of ['/builds/tech-aegis-engineering-build-tampishach/', '/news/angry-joe-division-resurgence-response/',
    '/guides/division-resurgence-beginner-guide/', '/patch-notes/season-2-phase-2/']) {
    assert.equal(checkPath(p), p);
  }
  for (const p of ['/builds/', '/builds/x', '/builds/../etc/passwd/', '/Builds/x/', '/database/weapons/m4/', '/builds/a_b/',
    '/builds/x/?q=1', '/builds/x/#c', "/builds/x'/", '/builds/-x/', '/builds/x-/', `/builds/${'a'.repeat(200)}/`, null, 7]) {
    assert.equal(checkPath(p), null, String(p));
  }
});

test('ids are random, 12 characters, from the safe alphabet', () => {
  const ids = new Set(Array.from({ length: 2000 }, () => newId()));
  assert.equal(ids.size, 2000);
  for (const id of ids) assert.match(id, ID_RE);
});

test('hashIp is stable for one salt and different across salts', async () => {
  const a = await hashIp('203.0.113.7', 'salt-a');
  assert.equal(a, await hashIp('203.0.113.7', 'salt-a'));
  assert.notEqual(a, await hashIp('203.0.113.7', 'salt-b'));
  assert.notEqual(a, await hashIp('203.0.113.8', 'salt-a'));
  assert.match(a, /^[0-9a-f]{32}$/);
});

test('parseGuard reads both answer shapes and refuses to guess', () => {
  assert.deepEqual(parseGuard({ response: { safe: true } }), { safe: true, categories: [] });
  assert.deepEqual(parseGuard({ response: { safe: false, categories: ['S10'] } }), { safe: false, categories: ['S10'] });
  assert.deepEqual(parseGuard({ response: { safe: false, categories: ['s1', 'S12: Sexual Content'] } }), { safe: false, categories: ['S1', 'S12'] });
  assert.deepEqual(parseGuard({ response: 'safe' }), { safe: true, categories: [] });
  assert.deepEqual(parseGuard({ response: '\n\nunsafe\nS10,S12' }), { safe: false, categories: ['S10', 'S12'] });
  assert.deepEqual(parseGuard({ result: { response: 'unsafe\nS4' } }), { safe: false, categories: ['S4'] });
  assert.equal(parseGuard({ response: 'maybe' }), null);
  assert.equal(parseGuard(null), null);
  assert.equal(parseGuard({}), null);
});

test('safetyCheck never throws and gives up on a slow filter', async () => {
  assert.equal(await safetyCheck(undefined, 'a', 'b'), null);
  assert.equal(await safetyCheck({ run: async () => { throw new Error('quota'); } }, 'a', 'b'), null);
  assert.equal(await safetyCheck({ run: () => new Promise(() => {}) }, 'a', 'b', 50), null);
  let seen;
  const verdict = await safetyCheck({ run: async (model, input) => { seen = { model, input }; return { response: { safe: false, categories: ['S10'] } }; } }, 'Kel', 'text');
  assert.deepEqual(verdict, { safe: false, categories: ['S10'] });
  assert.equal(seen.model, '@cf/meta/llama-guard-3-8b');
  assert.match(seen.input.messages[0].content, /Kel/);
});

const req = (headers, url = 'https://resurgencebuilds.com/api/comments', body) =>
  new Request(url, { method: 'POST', headers, body });

test('allowedOrigin: same origin and the live site only', () => {
  assert.equal(allowedOrigin(req({ Origin: 'https://resurgencebuilds.com' })), true);
  assert.equal(allowedOrigin(req({ Origin: 'https://www.resurgencebuilds.com' })), true);
  assert.equal(allowedOrigin(req({ Origin: 'https://abc.resurgence-builds.pages.dev' }, 'https://abc.resurgence-builds.pages.dev/api/comments')), true);
  assert.equal(allowedOrigin(req({ Origin: 'http://localhost:8788' }, 'http://localhost:8788/api/comments')), true);
  assert.equal(allowedOrigin(req({ Origin: 'https://evil.example' })), false);
  assert.equal(allowedOrigin(req({ Origin: 'http://resurgencebuilds.com' }, 'https://x.pages.dev/api/comments')), false);
  assert.equal(allowedOrigin(req({ Origin: 'null' })), false);
  assert.equal(allowedOrigin(req({})), false);
});

test('readJson checks type, size and shape', async () => {
  const j = (body, type = 'application/json') => req({ 'Content-Type': type }, undefined, body);
  assert.deepEqual(await readJson(j('{"a":1}'), 100), { data: { a: 1 } });
  assert.equal((await readJson(j('{"a":1}', 'text/plain'), 100)).status, 415);
  assert.equal((await readJson(j('{"a":"' + 'x'.repeat(200) + '"}'), 100)).status, 413);
  assert.equal((await readJson(j('{nope'), 100)).status, 400);
  assert.equal((await readJson(j('[1,2]'), 100)).status, 400);
  assert.equal((await readJson(j('null'), 100)).status, 400);
});

test('applyVerdict: hold hate and sexual content, flag the rest, mark unchecked', () => {
  // The real Workers AI answers look like "\n\nsafe" and "\n\nunsafe\nS10" (seen October 31, 2026).
  assert.deepEqual(applyVerdict(parseGuard({ response: '\n\nsafe' }), 'visible', null), { state: 'visible', flags: null, note: null });
  assert.deepEqual(applyVerdict(parseGuard({ response: '\n\nunsafe\nS10' }), 'visible', null), { state: 'held', flags: 'ai:S10', note: 'Held by the safety filter' });
  assert.deepEqual(applyVerdict(parseGuard({ response: '\n\nunsafe\nS12' }), 'visible', null).state, 'held');
  assert.deepEqual(applyVerdict(parseGuard({ response: '\n\nunsafe\nS7' }), 'visible', null), { state: 'visible', flags: 'ai:S7', note: null });
  assert.deepEqual(applyVerdict(parseGuard({ response: '\n\nunsafe\nS1,S10' }), 'visible', null).state, 'held');
  assert.deepEqual(applyVerdict({ safe: false, categories: [] }, 'visible', null).state, 'held');
  assert.deepEqual(applyVerdict(null, 'visible', null), { state: 'visible', flags: 'ai:unchecked', note: null });
});
