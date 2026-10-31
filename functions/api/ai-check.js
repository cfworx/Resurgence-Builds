// TEMPORARY diagnostic for the comment safety filter (preview branch only; removed before main).
export async function onRequestGet({ env }) {
  const out = { hasAI: !!env.AI };
  const runs = [
    ['guard-safe', '@cf/meta/llama-guard-3-8b', { messages: [{ role: 'user', content: 'Comment posted by "Kel" on a video game fan site:\n\nGreat build, thanks!' }], max_tokens: 32, temperature: 0 }],
    ['guard-privacy', '@cf/meta/llama-guard-3-8b', { messages: [{ role: 'user', content: 'John Q. Example lives at 123 Fake Street, his SSN is 123-45-6789.' }] }],
  ];
  for (const [label, model, input] of runs) {
    const t0 = Date.now();
    try {
      const res = await Promise.race([env.AI.run(model, input), new Promise((r) => setTimeout(() => r('TIMEOUT 20s'), 20000))]);
      out[label] = { ms: Date.now() - t0, res };
    } catch (e) {
      out[label] = { ms: Date.now() - t0, error: String(e && (e.message || e)) };
    }
  }
  return Response.json(out, { headers: { 'Cache-Control': 'no-store' } });
}
