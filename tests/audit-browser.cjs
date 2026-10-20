/* Behavioral audit with explicitly synthetic API fixtures; no real credentials. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { openDashboard } = require('./browser-harness.cjs');
const KEY = 'TEST_placeholder_key_only';
const DAY = 86400000, END = Date.UTC(2026, 9, 20);
const csv = (name, start = END - 2 * DAY, irregular = false) => ({ name: name + '.csv', mimeType: 'text/csv', buffer: Buffer.from(
  `timestamp,symbol,price\n${new Date(start).toISOString()},${name}/USD,100\n${new Date(start + DAY).toISOString()},${name}/USD,120\n${new Date(start + (irregular ? 3 : 2) * DAY).toISOString()},${name}/USD,90\n`) });

(async () => {
  const app = await openDashboard(), { page, baseURL } = app;
  const errors = [], requests = []; let mode = 'ok', release, notifyHold;
  page.on('pageerror', e => errors.push(e.message));
  await page.route('https://api.coingecko.com/api/v3/**', async route => {
    const url = new URL(route.request().url()); requests.push(url);
    assert.equal(route.request().headers()['x-cg-demo-api-key'], KEY);
    assert(!url.href.includes(KEY));
    if (mode === 'hold') await new Promise(resolve => { release = resolve; notifyHold?.(); });
    if (mode === 'network') { await route.abort(); return; }
    if (mode === 'plan' && url.pathname.includes('/ethereum/')) {
      await route.fulfill({ status: 403, contentType: 'application/json', body: '{"status":{"error_code":10005}}' }); return;
    }
    if (url.pathname.endsWith('/search')) {
      const coins = url.searchParams.get('query') === 'empty' ? [] : [{ id: 'audit-coin', name: '<img src=x onerror=alert(1)>', symbol: 'audit', market_cap_rank: 99 }];
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ coins }) }); return;
    }
    const days = Number(url.searchParams.get('days'));
    const prices = Array.from({ length: days + 1 }, (_, i) => [END - (days - i) * DAY, 100 + i + Math.sin(i) * 9]);
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ prices }) });
  });
  const idle = () => page.waitForFunction(() => document.querySelector('#cg-cancel').hidden && !document.querySelector('#cg-connect').disabled);
  const count = async () => Number((await page.locator('#metric-count').innerText()).replace(/\D/g, ''));
  const connect = async () => {
    await page.locator('#cg-connect').click(); await page.locator('#cg-key').fill(KEY);
    await page.locator('#cg-key-form button[type=submit]').click();
  };
  const exportFile = async format => {
    await page.locator('#export-open').click(); const pending = page.waitForEvent('download');
    await page.locator(`[data-export="${format}"]`).click();
    return fs.readFile(await (await pending).path(), 'utf8');
  };
  try {
    await page.goto(baseURL + '/dist/crypto-research-toolkit.html');
    assert.equal(await page.locator('#export-open').isDisabled(), true);
    assert.equal(await page.locator('#cg-refresh').isDisabled(), true);
    assert.equal(await page.locator('#cg-disconnect').isVisible(), false);
    assert.equal(await page.locator('#cg-cancel').isVisible(), false);
    // Both close controls clear typed credentials; opening a dialog makes no API request.
    await page.locator('#cg-connect').click(); await page.locator('#cg-key').fill(KEY);
    await page.getByRole('button', { name: 'Закрыть подключение CoinGecko', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#cg-key').value === '');
    assert.equal(await page.locator('#cg-key').inputValue(), '');
    await page.locator('#cg-connect').click(); await page.locator('#cg-key').fill(KEY); await page.keyboard.press('Escape');
    await page.waitForFunction(() => document.querySelector('#cg-key').value === '');
    assert.equal(await page.locator('#cg-key').inputValue(), ''); assert.equal(requests.length, 0);
    await connect(); await idle(); assert.equal(requests.length, 3);
    // Assert the outcome of every period button, including returning to all loaded observations.
    for (const [days, expected] of [[7, 8], [30, 31], [90, 91], [0, 91], [7, 8], [0, 91]]) {
      await page.locator(`[data-days="${days}"]`).click();
      assert.equal(await count(), expected); assert.equal(await page.locator(`[data-days="${days}"]`).getAttribute('aria-pressed'), 'true');
    }
    assert.match(await page.locator('#period-help').innerText(), /вся загруженная история/);
    assert.equal(requests.length, 3, 'chart filters must not use quota');
    await page.locator('#cg-history').selectOption('365'); await idle();
    assert.equal(await count(), 366); assert.equal(requests.length, 6);
    await page.locator('[data-days="90"]').click(); assert.equal(await count(), 91);
    await page.locator('[data-days="0"]').click(); assert.equal(await count(), 366);
    await page.locator('[data-days="7"]').click();
    const beforeRefresh = requests.length;
    await page.locator('#cg-refresh').click(); await idle(); assert.equal(requests.length, beforeRefresh + 3);
    assert.equal(await count(), 8, 'refresh must preserve the chart filter');
    await page.locator('[data-days="0"]').click();
    assert.match(await page.locator('#cg-status').innerText(), /новый запрос/);
    // Actual price mode and normalized comparison, asset selection, uncheck/recheck.
    await page.locator('[data-mode="price"]').click(); assert.equal(await page.locator('#comparison-body tr').count(), 1);
    await page.getByRole('button', { name: 'Выбрать ETH/USD', exact: true }).click();
    assert.equal(await page.locator('#active-symbol').innerText(), 'ETH/USD');
    await page.locator('[data-mode="compare"]').click(); assert.equal(await page.locator('#comparison-body tr').count(), 3);
    await page.getByRole('checkbox', { name: 'Сравнивать ETH/USD', exact: true }).uncheck();
    assert.equal(await page.locator('#comparison-body tr').count(), 2);
    await page.getByRole('checkbox', { name: 'Сравнивать ETH/USD', exact: true }).check();
    await page.locator('.brand').click(); assert.equal(await page.locator('#asset-count').innerText(), '3');
    // Chart pointer/keyboard and explicit tooltip dismissal.
    await page.locator('#price-chart').hover(); assert.equal(await page.locator('#price-chart .chart-tooltip').isVisible(), true);
    await page.locator('#price-chart').focus(); await page.keyboard.press('End');
    await page.keyboard.press('Escape'); assert.equal(await page.locator('#price-chart .chart-tooltip').isVisible(), false);
    await page.locator('#drawdown-chart').focus(); await page.keyboard.press('Home');
    assert.equal(await page.locator('#drawdown-chart .chart-tooltip').isVisible(), true);
    // Search empty results, text-only rendering of an adversarial upstream name, add result.
    await page.locator('#cg-search').fill('empty'); await page.locator('#cg-search-button').click(); await idle();
    assert.match(await page.locator('#cg-results').innerText(), /не найдены/);
    await page.locator('#cg-search').fill('audit'); await page.locator('#cg-search').press('Enter'); await idle();
    assert.equal(await page.locator('#cg-results img').count(), 0);
    await page.locator('[data-add-coin="audit-coin"]').click(); await idle();
    assert.equal(await page.locator('#active-symbol').innerText(), 'AUDIT/USD');
    // All four exports contain only the current period and no credentials; SVG parses.
    for (const format of ['json', 'markdown', 'csv', 'svg']) {
      const content = await exportFile(format); assert(!content.includes(KEY)); assert(content.includes('AUDIT/USD'));
      if (format === 'json') {
        const report = JSON.parse(content); assert.equal(report.series.length, 4);
        assert(report.series.every(s => s.requested_history_days === 365 && s.observations === 366));
      }
      if (format === 'csv') assert.equal(content.trim().split(/\r?\n/).length, 1 + 4 * 366);
      if (format === 'svg') assert.equal(await page.evaluate(s => new DOMParser().parseFromString(s, 'image/svg+xml').querySelector('parsererror') === null, content), true);
    }
    // A partial refresh retains failed assets' old data and reports the mixed lookbacks.
    mode = 'plan'; await page.locator('#cg-history').selectOption('30'); await idle();
    assert.match(await page.locator('#cg-status').innerText(), /Обновлено 3 из 4/);
    await page.getByRole('button', { name: 'Выбрать ETH/USD', exact: true }).click();
    assert.match(await page.locator('#active-source').innerText(), /история 365 дн/);
    mode = 'network'; const oldCount = await page.locator('#asset-count').innerText();
    await page.locator('#cg-refresh').click(); await idle(); assert.equal(await page.locator('#asset-count').innerText(), oldCount);
    assert.match(await page.locator('#messages').innerText(), /Нет связи/);
    mode = 'ok';
    // CSV import must preserve deliberate deselection, and missing overlap must not show unrelated quality statistics.
    await page.getByRole('checkbox', { name: 'Сравнивать SOL/USD', exact: true }).uncheck();
    await page.locator('#csv-input').setInputFiles(csv('IRREGULAR', END - 3 * DAY, true));
    await page.waitForFunction(() => document.querySelector('#active-symbol').textContent === 'IRREGULAR/USD');
    assert.equal(await page.getByRole('checkbox', { name: 'Сравнивать SOL/USD', exact: true }).isChecked(), false);
    assert.match(await page.locator('#quality-dot').getAttribute('class'), /warning/);
    await page.locator('#csv-input').setInputFiles(csv('FUTURE', END + 20 * DAY));
    await page.waitForFunction(() => document.querySelector('#active-symbol').textContent === 'FUTURE/USD');
    assert.match(await page.locator('#quality-body').innerText(), /недостаточно общих/);
    assert.equal(await page.locator('#export-open').isDisabled(), true);
    await page.getByRole('button', { name: 'Удалить FUTURE/USD', exact: true }).click();
    // Dialog close, template download, mobile and tablet controls, including previously hidden Format button.
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.locator('#format-open').click();
      const pending = page.waitForEvent('download'); await page.locator('#template-download').click();
      assert.match(await fs.readFile(await (await pending).path(), 'utf8'), /^timestamp,symbol,price/);
      await page.getByRole('button', { name: 'Закрыть формат данных', exact: true }).click();
      const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => {
        const r = e.getBoundingClientRect(); return r.width && r.right > innerWidth + 1 && !e.closest('.table-scroll,dialog,svg');
      }).map(e => ({ tag: e.tagName, id: e.id, cls: e.className, right: e.getBoundingClientRect().right })).slice(0, 12));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `page overflow at ${width}: ${JSON.stringify(overflow)}`);
    }
    // Capacity, simultaneous CSV/API changes, and cancellation with retained data.
    await page.goto(baseURL); await page.locator('#demo-load').click();
    await page.locator('#csv-input').setInputFiles([csv('ONE'), csv('TWO'), csv('THREE'), csv('FOUR'), csv('FIVE')]);
    await page.waitForFunction(() => document.querySelector('#asset-count').textContent === '8');
    await page.locator('#demo-load').click(); assert.match(await page.locator('#messages').innerText(), /свободных места/);
    await page.getByRole('button', { name: 'Удалить FIVE/USD', exact: true }).click();
    mode = 'hold'; release = null;
    const held = new Promise(resolve => { notifyHold = resolve; });
    await connect(); await held;
    await page.waitForFunction(() => !document.querySelector('#cg-cancel').hidden);
    assert.equal(await page.locator('#csv-input').isDisabled(), true);
    assert.equal(await page.locator('#demo-load').isDisabled(), true);
    assert.equal(await page.locator('.asset-remove').first().isDisabled(), true);
    await page.locator('#drop-zone').dispatchEvent('drop', { dataTransfer: await page.evaluateHandle(() => {
      const transfer = new DataTransfer(); transfer.items.add(new File(['timestamp,symbol,price\n2026-01-01T00:00:00Z,RACE/USD,1\n2026-01-02T00:00:00Z,RACE/USD,2'], 'race.csv')); return transfer;
    }) });
    assert.equal(await page.locator('#asset-count').innerText(), '7');
    await page.locator('#cg-cancel').click(); if (release) release(); await idle();
    assert.equal(await page.locator('#asset-count').innerText(), '7'); assert.equal(await page.locator('#cg-key').inputValue(), '');
    assert.match(await page.locator('#cg-status').innerText(), /Загрузка отменена/);
    assert.equal(await page.locator('#csv-input').isDisabled(), false);
    await page.getByRole('button', { name: 'Закрыть сообщение', exact: true }).first().click();
    mode = 'ok';
    await connect(); await idle(); assert.equal(await page.locator('#asset-count').innerText(), '8');
    assert.match(await page.locator('#messages').innerText(), /Максимум — 8/);
    assert.equal(await page.locator('#comparison-body tr').count(), 5);
    await page.locator('[data-coin="bitcoin"]').click(); await idle();
    assert.equal(await page.locator('#asset-count').innerText(), '8', 'quick-add updates an existing coin instead of duplicating it');
    // A downloaded single file runs independently of a web server and has a working brand link.
    await page.goto(pathToFileURL(path.join(app.root, 'dist/crypto-research-toolkit.html')).href);
    await page.locator('#demo-load').click(); await page.locator('.brand').click();
    assert.equal(await page.locator('#asset-count').innerText(), '3');
    await page.locator('#cg-connect').click(); await page.keyboard.press('Escape');
    assert.deepEqual(errors, []);
    console.log('PASS: periods and full loaded history; manual refresh; every export; exact-ID search; safe rendering; partial/network failure; CSV selection; quality scope; dialogs/template; mobile/tablet; capacity; concurrent import guard; cancel; file:// standalone. Synthetic API fixtures only.');
  } finally { if (release) release(); await app.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
