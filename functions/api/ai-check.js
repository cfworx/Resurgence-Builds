// TEMPORARY diagnostic for the comment safety filter (preview branch only; removed before main).
export async function onRequestGet({ env, request }) {
  const which = new URL(request.url).searchParams.get('t') || 'A';
  const tests = {
    A: { messages: [{ role: 'user', content: 'Comment posted by "Kel" on a video game fan site:\n\nGreat build, thanks!' }], max_tokens: 32, temperature: 0 },
    B: { messages: [{ role: 'user', content: 'Comment posted by "Kel" on a video game fan site:\n\nJohn Q. Example lives at 123 Fake Street, his SSN is 123-45-6789.' }], max_tokens: 32, temperature: 0 },
    C: { prompt: 'John Q. Example lives at 123 Fake Street, his SSN is 123-45-6789.', max_tokens: 32 },
    D: { messages: [{ role: 'user', content: 'Comment posted by "Kel" on a video game fan site:\n\nI hate those people, they should all be deported, they are subhuman.' }], max_tokens: 32, temperature: 0 },
  };
  const t0 = Date.now();
  let out;
  try {
    const res = await Promise.race([env.AI.run('@cf/meta/llama-guard-3-8b', tests[which]), new Promise((r) => setTimeout(() => r('TIMEOUT 30s'), 30000))]);
    out = { which, ms: Date.now() - t0, res };
  } catch (e) {
    out = { which, ms: Date.now() - t0, error: String(e && (e.message || e)), name: e && e.name };
  }
  return Response.json(out, { headers: { 'Cache-Control': 'no-store' } });
}
