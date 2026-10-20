/* Reproducible English documentation images, using explicitly fictional demo data. */
const fs = require('node:fs/promises');
const path = require('node:path');
const { openDashboard } = require('../tests/browser-harness.cjs');

(async () => {
  const app = await openDashboard(); const { page, baseURL, root } = app;
  const external = [];
  page.on('request', request => {
    if (/^https?:/.test(request.url()) && !request.url().startsWith(baseURL + '/')) external.push(request.url());
  });
  try {
    const docs = path.join(root, 'docs'); await fs.mkdir(docs, { recursive: true });
    await page.setViewportSize({ width: 1440, height: 1120 });
    await page.goto(baseURL + '/dist/crypto-research-toolkit.html');
    await page.locator('#language-select').selectOption('en');
    await page.locator('#demo-load').click();
    await page.locator('#price-chart svg').waitFor();
    const chart = await page.locator('.main-chart-panel').boundingBox();
    await page.setViewportSize({ width: 1440, height: Math.ceil(chart.y + chart.height + 12) });
    await page.waitForTimeout(150);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(docs, 'dashboard-preview.png') });
    await page.locator('#cg-connect').click();
    // This screenshot always has an empty password field, with no real key involved.
    if (await page.locator('#cg-key').inputValue()) throw Error('Key field must be empty for documentation');
    await page.locator('#cg-dialog').screenshot({ path: path.join(docs, 'coingecko-setup-en.png') });
    await page.locator('[data-close="cg-dialog"]').click();
    await page.locator('#format-open').click();
    await page.locator('#format-dialog').screenshot({ path: path.join(docs, 'csv-format-en.png') });
    await page.locator('[data-close="format-dialog"]').click();
    await page.locator('#export-open').click();
    await page.locator('#export-dialog').screenshot({ path: path.join(docs, 'export-options-en.png') });
    await page.locator('[data-close="export-dialog"]').click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(docs, 'dashboard-mobile-overview-en.png') });
    await page.screenshot({ path: path.join(docs, 'dashboard-mobile.png'), fullPage: true });
    if (external.length) throw Error('Documentation capture must not make external requests');
    console.log('Saved six English screenshots. Fictional demo data only; no key or external requests.');
  } finally { await app.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
