const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { openDashboard } = require('./browser-harness.cjs');
const KEY = 'TEST_placeholder_key_only';

(async () => {
  const app = await openDashboard(); const { page, baseURL } = app;
  const calls = [], errors = []; let mode = 'ok';
  page.on('pageerror', e => errors.push(e.message));
  await page.route('https://api.coingecko.com/api/v3/**', async route => {
    const request = route.request(), url = new URL(request.url());
    assert.equal(request.headers()['x-cg-demo-api-key'], KEY);
    assert(!url.href.includes(KEY)); calls.push(url.pathname + url.search);
    if (mode !== 'ok') { await route.fulfill({ status: mode === 'auth' ? 401 : 429, contentType: 'application/json', body: JSON.stringify({ error: KEY }) }); return; }
    if (url.pathname.endsWith('/search')) {
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ coins: [{ id: 'bitcoin-cash', name: 'Bitcoin Cash', symbol: 'bch', market_cap_rank: 20 }] }) }); return;
    }
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ prices: [[1767225600000, 100], [1767312000000, 120], [1767398400000, 90], [1767484800000, 105]] }) });
  });
  try {
    await page.goto(baseURL);
    assert.equal(await page.locator('#asset-count').innerText(), '0'); assert.equal(calls.length, 0);
    await page.locator('#cg-connect').click(); await page.locator('#cg-key').fill(KEY);
    await page.getByRole('button', { name: 'Подключить и загрузить', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#asset-count').textContent === '3' && !document.querySelector('#cg-refresh').disabled);
    assert.equal(await page.locator('#active-symbol').innerText(), 'BTC/USD');
    assert.equal(calls.length, 3); assert.match(await page.locator('#notice').innerText(), /Реальная история/);
    assert.equal(await page.locator('#cg-key').inputValue(), '');
    assert(!(await page.content()).includes(KEY));
    assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    await page.locator('#cg-search').fill('bitcoin cash'); await page.locator('#cg-search-button').click();
    await page.getByRole('button', { name: 'Добавить Bitcoin Cash', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#asset-count').textContent === '4' && !document.querySelector('#cg-refresh').disabled);
    assert.equal(await page.locator('#active-symbol').innerText(), 'BCH/USD'); assert.equal(calls.length, 5);
    await page.locator('#cg-refresh').click();
    await page.waitForFunction(() => !document.querySelector('#cg-refresh').disabled);
    assert.equal(calls.length, 9, 'explicit refresh must make new history requests');
    await page.locator('#cg-history').selectOption('365');
    await page.waitForFunction(() => !document.querySelector('#cg-refresh').disabled);
    assert.equal(calls.length, 13);
    await page.locator('#export-open').click(); const pending = page.waitForEvent('download');
    await page.locator('[data-export="json"]').click(); const download = await pending;
    const contents = await fs.readFile(await download.path(), 'utf8');
    assert(!contents.includes(KEY)); const report = JSON.parse(contents);
    assert.equal(report.series.length, 4); assert(report.series.every(s => s.provider === 'coingecko' && s.coin_id && s.fetched_at_utc && !s.synthetic));
    mode = 'rate'; await page.locator('#cg-history').selectOption('7');
    await page.getByRole('alert').filter({ hasText: 'лимит' }).waitFor();
    assert.equal(await page.locator('#asset-count').innerText(), '4'); assert.equal(calls.length, 14);
    assert.equal(await page.locator('#active-symbol').innerText(), 'BCH/USD');
    await page.locator('#cg-connect').click(); await page.locator('#cg-disconnect').click();
    assert.equal(await page.locator('#cg-key').inputValue(), '');
    assert.match(await page.locator('#cg-connect').innerText(), /^Подключить/);
    assert.equal(await page.locator('#asset-count').innerText(), '4');
    await page.reload(); assert.equal(await page.locator('#asset-count').innerText(), '0');
    mode = 'auth'; await page.locator('#cg-connect').click(); await page.locator('#cg-key').fill(KEY);
    await page.getByRole('button', { name: 'Подключить и загрузить', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'не принял ключ' }).waitFor();
    assert.equal(await page.locator('#asset-count').innerText(), '0');
    assert(!(await page.locator('#messages').innerText()).includes(KEY));
    assert.match(await page.locator('#cg-connect').innerText(), /^Подключить/);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    console.log('PASS: key isolation, default coin loading, exact-ID search, cache, history ranges, provenance export, quota failure, disconnect, reload, bad key and mobile. All API responses in this test are synthetic fixtures.');
  } finally { await app.close(); }
})().catch(error => { console.error(error); process.exit(1); });
