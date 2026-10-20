/* Six-language behavior and layout checks, with synthetic API fixtures only. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { openDashboard } = require('./browser-harness.cjs');
const I = require('../assets/i18n.js');
const KEY = 'TEST_placeholder_key_only';
const LABELS = { en: 'Connect CoinGecko', ko: 'CoinGecko 연결', ja: 'CoinGeckoに接続', de: 'CoinGecko verbinden', ru: 'Подключить CoinGecko', es: 'Conectar CoinGecko' };

(async () => {
  const app = await openDashboard(), { page, baseURL } = app;
  const errors = [], calls = []; let mode = 'ok';
  page.on('pageerror', e => errors.push(e.message));
  await page.route('https://api.coingecko.com/api/v3/**', async route => {
    const request = route.request(), url = new URL(request.url()); calls.push(url.href);
    assert.equal(request.headers()['x-cg-demo-api-key'], KEY); assert(!url.href.includes(KEY));
    if (mode === 'auth') { await route.fulfill({ status: 401, contentType: 'application/json', body: '{"error":"not echoed"}' }); return; }
    const payload = url.pathname.endsWith('/search') ? { coins: [{ id: 'bitcoin-cash', name: 'Bitcoin Cash', symbol: 'bch' }] }
      : { prices: [[Date.UTC(2026, 9, 18), 1000.25], [Date.UTC(2026, 9, 19), 2000.5], [Date.UTC(2026, 9, 20), 1500.125]] };
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(payload) });
  });
  const idle = () => page.waitForFunction(() => !document.querySelector('#cg-connect').disabled);
  const switchTo = async code => {
    I.setLanguage(code); await page.locator('#language-select').selectOption(code);
    assert.equal(await page.locator('html').getAttribute('lang'), code);
    assert.equal(await page.locator('#language-select').inputValue(), code);
  };
  const untranslated = () => page.evaluate(() => {
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), found = []; let node;
    while ((node = walk.nextNode())) {
      const parent = node.parentElement;
      if (!parent || parent.closest('script,style,#language-select') || !/[А-Яа-яЁё]/u.test(node.textContent)) continue;
      if (parent.getClientRects().length && getComputedStyle(parent).visibility !== 'hidden') found.push(node.textContent.trim());
    }
    return found;
  });
  const exported = async format => {
    await page.locator('#export-open').click(); const pending = page.waitForEvent('download');
    await page.locator(`[data-export="${format}"]`).click(); return fs.readFile(await (await pending).path(), 'utf8');
  };
  try {
    await page.goto(baseURL + '/dist/crypto-research-toolkit.html');
    assert.equal(await page.locator('html').getAttribute('lang'), 'ru', 'initial browser locale');
    for (const code of I.languages) {
      const callsBeforeSwitch = calls.length; await switchTo(code);
      assert.equal(calls.length, callsBeforeSwitch, 'switching language must not call the API');
      assert.equal(await page.locator('#cg-connect').innerText(), LABELS[code]);
      await page.locator('#cg-connect').click(); await page.locator('#cg-key-form button[type=submit]').click();
      assert.equal(await page.locator('#cg-key-error').innerText(), I.t('Вставьте целиком Demo API-ключ из CoinGecko Dashboard.'));
      // Language changes also work inside an open dialog with an existing error.
      const next = code === 'en' ? 'de' : 'en';
      await page.evaluate(lang => window.ToolkitI18n.setLanguage(lang), next);
      I.setLanguage(next);
      assert.equal(await page.locator('#cg-key-error').innerText(), I.t('Вставьте целиком Demo API-ключ из CoinGecko Dashboard.'));
      await page.evaluate(lang => window.ToolkitI18n.setLanguage(lang), code); I.setLanguage(code);
      await page.locator('#cg-key').fill(KEY); await page.locator('#cg-key-form button[type=submit]').click(); await idle();
      assert.equal(await page.locator('#asset-count').innerText(), '3');
      assert.equal(await page.locator('#metric-price').innerText(), new Intl.NumberFormat(I.locale(), { maximumSignificantDigits: 8 }).format(1500.125));
      const count = await page.locator('#metric-count').innerText(), before = calls.length;
      await page.locator('[data-days="7"]').click();
      await page.locator('[data-days="0"]').click();
      assert.equal(await page.locator('#metric-count').innerText(), count); assert.equal(calls.length, before);
      await page.locator('#cg-search').fill('btc'); await page.locator('#cg-search-button').click(); await idle();
      assert.equal(await page.locator('[data-add-coin="bitcoin-cash"]').innerText(), I.t('Добавить'));
      // Visible results and loaded data survive a language change without any API calls.
      const searchCalls = calls.length;
      await switchTo(next); assert.equal(await page.locator('[data-add-coin="bitcoin-cash"]').innerText(), I.t('Добавить'));
      assert.equal(await page.locator('#asset-count').innerText(), '3'); assert.equal(calls.length, searchCalls);
      await switchTo(code);
      await page.locator('#csv-input').setInputFiles({ name: 'invalid.csv', mimeType: 'text/csv', buffer: Buffer.from('timestamp,symbol,price\n2026-01-01T00:00:00Z,X/USD,NaN\n') });
      await page.waitForFunction(() => document.querySelectorAll('#messages .message').length > 0);
      assert((await page.locator('#messages').innerText()).includes(I.error('Запись 1: цена должна быть положительным числом от 1e-30 до 1e30, до 40 значащих цифр.')));
      const report = JSON.parse(await exported('json'));
      assert.equal(report.language, code); assert.equal(report.series.length, 3);
      assert.equal(report.series[0].last_price, 1500.125); assert(!JSON.stringify(report).includes(KEY));
      const markdown = await exported('markdown');
      assert(markdown.includes('## ' + I.t('Источники'))); assert(markdown.includes('## ' + I.t('Ограничения')));
      const csv = await exported('csv'); assert(csv.startsWith('timestamp,symbol,series,price,synthetic'));
      assert(csv.includes('1500.125'), 'CSV numeric contract must not change with language');
      const svg = await exported('svg'); assert(svg.includes(`lang="${code}"`));
      assert(svg.includes(I.t('Нормировано к 100')));
      assert.equal(await page.evaluate(s => new DOMParser().parseFromString(s, 'image/svg+xml').querySelector('parsererror') === null, svg), true);
      await page.locator('#format-open').click();
      if (code !== 'ru') assert.deepEqual(await untranslated(), [], `${code}: untranslated format dialog`);
      await page.locator('[data-close="format-dialog"]').click();
      await page.locator('#price-chart').focus(); await page.keyboard.press('Home');
      if (code !== 'ru') assert.deepEqual(await untranslated(), [], `${code}: untranslated chart/messages`);
      mode = 'auth'; await page.locator('#cg-refresh').click(); await idle();
      assert((await page.locator('#messages').innerText()).includes(I.t('CoinGecko не принял ключ. Проверьте Demo API-ключ и подключитесь заново.')));
      assert.equal(await page.locator('#cg-connect').innerText(), LABELS[code]);
      assert.equal(await page.locator('#cg-key').inputValue(), ''); mode = 'ok';
      const storage = await page.evaluate(() => ({ ...localStorage }));
      assert.deepEqual(storage, { 'crt.language': code });
      assert.equal(await page.evaluate(() => sessionStorage.length), 0);
      await page.locator('#messages .message button').evaluateAll(nodes => nodes.forEach(node => node.click()));
    }
    // Locale alone persists across a reload. Price data and the API key do not.
    await switchTo('ja'); await page.reload();
    assert.equal(await page.locator('html').getAttribute('lang'), 'ja');
    assert.equal(await page.locator('#asset-count').innerText(), '0');
    assert.equal(await page.locator('#cg-connect').innerText(), LABELS.ja);
    await page.locator('#demo-load').click();
    const review = path.resolve(app.root, '../i18n-review'); await fs.mkdir(review, { recursive: true });
    for (const code of I.languages) {
      await switchTo(code);
      for (const width of [320, 390, 768, 1400]) {
        await page.setViewportSize({ width, height: 900 });
        await page.waitForTimeout(140);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${code} overflow at ${width}`);
        assert.equal(await page.locator('#language-select').isVisible(), true);
        assert.equal((await page.locator('#format-open').innerText()).trim().replace(/[≡↗]/g, '').trim(), I.t('Формат данных'));
        await page.locator('#format-open').click();
        assert.equal(await page.locator('#format-dialog').isVisible(), true);
        await page.locator('[data-close="format-dialog"]').click();
        if (width === 390 || width === 1400) {
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.screenshot({ path: path.join(review, `${code}-${width}.png`), fullPage: true });
        }
        await page.locator('#cg-connect').click();
        if (code !== 'ru') assert.deepEqual(await untranslated(), [], `${code}: untranslated connection dialog`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        await page.locator('[data-close="cg-dialog"]').click();
      }
    }
    await page.goto(pathToFileURL(path.join(app.root, 'dist/crypto-research-toolkit.html')).href);
    await switchTo('ko'); await page.locator('#demo-load').click();
    assert.equal(await page.locator('#asset-count').innerText(), '3');
    assert.equal(await page.locator('html').getAttribute('lang'), 'ko');
    await page.reload(); assert.equal(await page.locator('html').getAttribute('lang'), 'ko');
    assert.deepEqual(errors, []);
    console.log('PASS: six languages; translated static/dynamic UI, validation, API errors, existing search results and tooltips; locale dates/numbers; four exports; in-memory data/client preserved on switch; only language persisted; 24 viewport-language combinations; independent file:// operation. Synthetic API fixtures only.');
  } finally { await app.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
