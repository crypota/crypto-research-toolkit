/* Optional real API smoke test. Supply your key via the process environment. */
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { openDashboard } = require('./browser-harness.cjs');

(async () => {
  const key = process.env.COINGECKO_DEMO_API_KEY;
  if (!key) { console.log('SKIP: no COINGECKO_DEMO_API_KEY supplied.'); return; }
  const app = await openDashboard(); const { page, baseURL, root } = app;
  let count = 0;
  page.on('request', request => { if (request.url().startsWith('https://api.coingecko.com/')) count++; });
  page.on('requestfailed', request => { if (request.url().startsWith('https://api.coingecko.com/')) console.log('CoinGecko transport:', request.failure()?.errorText || 'failed'); });
  try {
    // Optional test-only transport for environments whose browser lacks the
    // system proxy trust store. Python still validates HTTPS certificates.
    // This does not change the production app or forward through a third party.
    if (process.env.COINGECKO_TEST_HTTPS_TRANSPORT === 'python') {
      await page.route('https://api.coingecko.com/api/v3/**', async route => {
        const code = `import sys,json,urllib.request,urllib.error,urllib.parse\nd=json.load(sys.stdin)\nu=urllib.parse.urlsplit(d['url'])\nassert u.scheme=='https' and u.netloc=='api.coingecko.com' and u.path.startswith('/api/v3/')\nreq=urllib.request.Request(d['url'],headers={'Accept':'application/json','x-cg-demo-api-key':d['key']})\ntry:\n with urllib.request.urlopen(req,timeout=20) as r: print(json.dumps({'status':r.status,'body':r.read().decode()}))\nexcept urllib.error.HTTPError as e:\n print(json.dumps({'status':e.code,'body':e.read().decode()}))\n`;
        const request = route.request();
        const result = spawnSync('python', ['-c', code], { input: JSON.stringify({ url: request.url(), key: request.headers()['x-cg-demo-api-key'] }), encoding: 'utf8', maxBuffer: 4000000 });
        if (result.status !== 0) { await route.abort('failed'); return; }
        const data = JSON.parse(result.stdout);
        await route.fulfill({ status: data.status, contentType: 'application/json', body: data.body });
      });
    }
    await page.goto(baseURL); await page.locator('#cg-connect').click();
    await page.locator('#cg-key').fill(key);
    await page.getByRole('button', { name: 'Подключить и загрузить', exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('#cg-refresh').disabled || document.querySelector('#messages .message'), null, { timeout: 80000 });
    // An error prints only the app's redacted text, never response bodies or headers.
    const messages = await page.locator('#messages').innerText();
    if (messages) { console.log('Live app status:', messages.split(key).join('[redacted]')); throw Error('Live request failed'); }
    await page.waitForFunction(() => document.querySelector('#asset-count').textContent === '3' && !document.querySelector('#cg-refresh').disabled);
    assert.equal(await page.locator('#active-symbol').innerText(), 'BTC/USD');
    assert(Number((await page.locator('#metric-count').innerText()).replace(/\D/g, '')) > 100);
    assert.equal(await page.locator('#cg-key').inputValue(), '');
    assert(!(await page.content()).includes(key));
    await page.screenshot({ path: path.join(root, 'docs/dashboard-live.png'), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(200);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({ path: path.join(root, 'docs/dashboard-live-mobile.png'), fullPage: true });
    await page.locator('#cg-connect').click(); await page.locator('#cg-disconnect').click();
    console.log('PASS: real CoinGecko history loaded for BTC, ETH, SOL; key cleared from form and not persisted. Requests:', count,
      process.env.COINGECKO_TEST_HTTPS_TRANSPORT === 'python' ? '(certificate-validating Python transport in test harness)' : '(direct browser HTTPS)');
  } finally { await app.close(); }
})().catch(() => { console.error('FAIL: live CoinGecko smoke test did not complete. No credential or upstream response is printed.'); process.exit(1); });
