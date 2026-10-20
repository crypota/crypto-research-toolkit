const test = require('node:test');
const assert = require('node:assert/strict');
const CG = require('../assets/coingecko.js');
const KEY = 'TEST_placeholder_key_only';
const coin = CG.DEFAULT_COINS[0];
const payload = { prices: [[1700000000000, 100], [1700086400000, 105]] };
function response(body = payload, status = 200) {
  return { ok: status === 200, status, json: async () => body, headers: { get: () => null } };
}
function client(fetch, extra = {}) { return CG.createClient(KEY, { fetch, spacingMs: 0, ...extra }); }

test('key sent only in header to fixed CoinGecko host, never URL or dataset', async () => {
  let request;
  const c = client(async (url, options) => { request = { url, options }; return response(); });
  const d = await c.history(coin, 30);
  assert.equal(new URL(request.url).origin, 'https://api.coingecko.com');
  assert.equal(request.options.headers['x-cg-demo-api-key'], KEY);
  assert.equal(request.options.credentials, 'omit'); assert.equal(request.options.redirect, 'error');
  assert(!request.url.includes(KEY)); assert(!JSON.stringify(d).includes(KEY));
  assert.equal(d.coinId, 'bitcoin'); assert.equal(d.symbol, 'BTC/USD'); assert.equal(d.apiDays, 30);
});
test('history cache reuses timestamp; distinct periods fetch separately; expires', async () => {
  let calls = 0, now = 1000;
  const c = client(async () => { calls++; return response(); }, { now: () => now, cacheMs: 300000 });
  const a = await c.history(coin, 30); now = 2000;
  const b = await c.history(coin, 30);
  assert.equal(calls, 1); assert.equal(a.fetchedAt, b.fetchedAt);
  await c.history(coin, 7); assert.equal(calls, 2);
  now = 400000; await c.history(coin, 30); assert.equal(calls, 3);
});
test('queued calls are serialized and a failed call does not poison queue', async () => {
  let calls = 0, pending = 0, peak = 0;
  const c = client(async () => { calls++; peak = Math.max(peak, ++pending); await new Promise(r => setTimeout(r, 5)); pending--; return response({}, calls === 1 ? 500 : 200); });
  const results = await Promise.allSettled([c.search('bitcoin'), c.search('ethereum')]);
  assert.equal(peak, 1); assert.equal(results[0].status, 'rejected');
  // The second request executes even though its deliberately malformed fixture also fails.
  assert.equal(calls, 2);
});
test('rejects invalid IDs/periods/key before any request', async () => {
  let calls = 0; const c = client(async () => { calls++; return response(); });
  for (const id of ['../search', 'https://evil.example', 'BTC?key=123', '']) await assert.rejects(c.history({ id }, 30));
  await assert.rejects(c.history(coin, 999)); await assert.rejects(c.search('x'));
  assert.throws(() => CG.createClient('short'));
  assert.equal(calls, 0);
});
test('normalizes API rows: sorts, deduplicates and records exclusions', () => {
  const d = CG.normalizeHistory({ prices: [[2000, 2], [1000, 1], [2000, 3], [3000, -1], ['bad', 1]] }, coin, 7, 4000);
  assert.deepEqual(d.points, [{ time: 1000, price: 1 }, { time: 2000, price: 3 }]); assert.equal(d.discarded, 3);
  assert.throws(() => CG.normalizeHistory({ prices: [[1, 0]] }, coin, 7, 0));
});
test('maps 401 and API authentication codes without echoing response secrets', async () => {
  for (const [status, code] of [[401, undefined], [200, 10010], [400, 10011]]) {
    const c = client(async () => response({ status: { error_code: code, error_message: KEY } }, status));
    await assert.rejects(c.history(coin), e => e.kind === 'auth' && !e.message.includes(KEY));
  }
});
test('429 applies cooldown and preserves quota by blocking retry requests', async () => {
  let calls = 0;
  const c = client(async () => { calls++; return response({}, 429); });
  await assert.rejects(c.history(coin), e => e.kind === 'rate');
  await assert.rejects(c.history(coin), e => e.kind === 'rate');
  assert.equal(calls, 1);
});
test('handles malformed successful JSON, plan restrictions and network errors', async () => {
  const bad = client(async () => ({ ok: true, status: 200, json: async () => { throw Error(KEY); } }));
  await assert.rejects(bad.history(coin), e => e.kind === 'data' && !e.message.includes(KEY));
  const plan = client(async () => response({ status: { error_code: 10005 } }, 403));
  await assert.rejects(plan.history(coin), e => e.kind === 'plan');
  const network = client(async () => { throw new TypeError(KEY); });
  await assert.rejects(network.history(coin), e => e.kind === 'network' && !e.message.includes(KEY));
});
test('search validates and bounds results while exposing exact IDs', async () => {
  const c = client(async () => response({ coins: [{ id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', market_cap_rank: 1 }, { id: 'https://bad', name: 'Bad' }] }));
  assert.deepEqual(await c.search('btc'), [{ id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', rank: 1 }]);
});
test('disconnect aborts active request and rejects future calls', async () => {
  let started; const wait = new Promise(resolve => { started = resolve; });
  const c = client(async (url, options) => { started(); return new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(Object.assign(Error('aborted'), { name: 'AbortError' })))); });
  const pending = c.history(coin); await wait; c.disconnect();
  await assert.rejects(pending, e => e.kind === 'closed');
  await assert.rejects(c.history(coin), e => e.kind === 'closed');
});
