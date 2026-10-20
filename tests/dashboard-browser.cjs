/* Optional end-to-end checks. Requires Playwright + its Chromium browser. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

(async () => {
  const root = path.resolve(__dirname, '..');
  const server = http.createServer(async (request, response) => {
    try {
      const relative = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const filename = path.resolve(root, '.' + (relative === '/' ? '/index.html' : relative));
      if (!filename.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
      const type = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png' }[path.extname(filename)] || 'application/octet-stream';
      const data = await fs.readFile(filename); response.writeHead(200, { 'Content-Type': type }); response.end(data);
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const baseURL = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || chromium.executablePath(), args: ['--no-sandbox'] });
  const page = await browser.newPage({ locale: 'ru-RU', viewport: { width: 1512, height: 1100 }, deviceScaleFactor: 1 });
  const errors = [], network = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { if (/^https?:/.test(r.url()) && !r.url().startsWith(baseURL + '/')) network.push(r.url()); });
  await page.goto(baseURL);
  await page.getByRole('button', { name: '↻ Загрузить демоданные', exact: true }).click();
  await page.waitForSelector('#price-chart svg');
  assert.equal(await page.locator('#comparison-body tr').count(), 3);
  assert.match(await page.locator('#notice').innerText(), /вымышленные/);
  await fs.mkdir(path.join(root, 'docs'), { recursive: true });
  await page.screenshot({ path: path.join(root, 'docs/dashboard-preview.png'), fullPage: true });
  await page.getByRole('button', { name: '7Д', exact: true }).click();
  assert.equal((await page.locator('#metric-count').innerText()).replace(/\D/g, ''), '8');
  await page.getByRole('button', { name: 'Цена', exact: true }).click();
  assert.equal(await page.locator('#comparison-body tr').count(), 1);
  await page.getByRole('button', { name: 'Сравнение · 100', exact: true }).click();
  await page.getByRole('button', { name: 'Вся загрузка', exact: true }).click();
  await page.locator('#price-chart').focus(); await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#price-chart .chart-tooltip').isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#price-chart .chart-tooltip').isVisible(), false);
  await page.locator('#csv-input').setInputFiles(path.join(root, 'examples/sample_prices.csv'));
  await page.waitForFunction(() => document.querySelector('#active-symbol').textContent === 'SAMPLE/USD');
  assert.match(await page.locator('#metric-change').innerText(), /5%/);
  assert.match(await page.locator('#metric-drawdown').innerText(), /33,33%/);
  assert.equal(await page.locator('#comparison-body tr').count(), 1);
  await page.locator('#csv-input').setInputFiles({ name: 'invalid.csv', mimeType: 'text/csv', buffer: Buffer.from('timestamp,symbol,price\n2026-01-01T00:00:00Z,X/USD,NaN\n') });
  await page.getByRole('alert').waitFor();
  assert.equal(await page.locator('#active-symbol').innerText(), 'SAMPLE/USD');
  await page.locator('#csv-input').setInputFiles({ name: 'different-period.csv', mimeType: 'text/csv', buffer: Buffer.from('timestamp,symbol,price\n2026-06-01T00:00:00Z,FUTURE/USD,1\n2026-06-02T00:00:00Z,FUTURE/USD,2\n') });
  await page.waitForFunction(() => document.querySelector('#active-symbol').textContent === 'FUTURE/USD');
  assert.match(await page.locator('#price-chart').innerText(), /нет общего периода/);
  assert.equal(await page.locator('#export-open').isDisabled(), true);
  await page.getByRole('button', { name: 'Удалить FUTURE/USD', exact: true }).click();
  await page.getByRole('button', { name: 'Выбрать SAMPLE/USD', exact: true }).click();
  for (const format of ['json', 'markdown', 'csv', 'svg']) {
    await page.locator('#export-open').click();
    const pending = page.waitForEvent('download');
    await page.locator(`[data-export="${format}"]`).click();
    const download = await pending;
    const contents = await fs.readFile(await download.path(), 'utf8');
    assert(contents.includes('SAMPLE/USD'));
    if (format === 'json') {
      const report = JSON.parse(contents); assert.equal(report.series.length, 1);
      assert(Math.abs(report.series[0].change_pct - 5) < 1e-10);
      assert.equal(report.series[0].input_sha256.length, 64);
    }
    if (format === 'svg') { assert(contents.includes('<svg')); assert(!contents.includes('data-transient')); }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL);
  await page.getByRole('button', { name: '↻ Загрузить демоданные', exact: true }).click();
  await page.waitForSelector('#price-chart svg');
  await page.waitForTimeout(200);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.screenshot({ path: path.join(root, 'docs/dashboard-mobile.png'), fullPage: true });
  await page.goto(baseURL + '/dist/crypto-research-toolkit.html');
  await page.getByRole('button', { name: '↻ Загрузить демоданные', exact: true }).click();
  await page.waitForSelector('#price-chart svg');
  assert.equal(await page.locator('#comparison-body tr').count(), 3);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.deepEqual(network, []); assert.deepEqual(errors, []);
  console.log('PASS: demo, periods, comparison, keyboard tooltip, import, errors, disjoint ranges, four exports, mobile, standalone and zero network requests.');
  await browser.close();
  await new Promise(resolve => server.close(resolve));
})().catch(error => { console.error(error); process.exit(1); });
