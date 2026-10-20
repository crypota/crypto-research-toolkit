const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const I = require('../assets/i18n.js');
const vars = s => [...s.matchAll(/\{([a-z]+)\}/g)].map(m => m[1]).sort();

test('all six catalogs are complete and preserve substitution fields', () => {
  assert.deepEqual(I.languages, ['en', 'ko', 'ja', 'de', 'ru', 'es']);
  assert(Object.keys(I.messages).length > 200);
  for (const [key, translations] of Object.entries(I.messages)) {
    assert.equal(translations.length, 5, key);
    for (const value of translations) {
      assert.equal(typeof value, 'string'); assert(value.trim(), key);
      assert.deepEqual(vars(value), vars(key), key);
      assert(!/[А-Яа-яЁё]/u.test(value), `Russian fallback inside translation: ${key}`);
    }
  }
});
test('all static UI, dynamic UI and core validation messages have catalog entries', () => {
  const root = path.resolve(__dirname, '..');
  const decode = s => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const m of html.matchAll(/data-i18n(?:-[a-z-]+)?="([^"]*)"/g)) assert(I.has(decode(m[1])), m[1]);
  for (const file of ['analytics.js', 'coingecko.js', 'dashboard.js']) {
    const source = fs.readFileSync(path.join(root, 'assets', file), 'utf8');
    for (const m of source.matchAll(/'((?:\\.|[^'\\])*)'/g)) {
      if (/[А-Яа-яЁё]/u.test(m[1])) assert(I.has(m[1]), `${file}: ${m[1]}`);
    }
  }
});
test('language detection uses saved selection, supported browser locale and English fallback', () => {
  assert.equal(I.resolveLanguage('ja', ['ru-RU']), 'ja');
  assert.equal(I.resolveLanguage('broken', ['xx-XX', 'ko-KR']), 'ko');
  assert.equal(I.resolveLanguage(null, ['de-DE']), 'de');
  assert.equal(I.resolveLanguage(null, ['es-MX']), 'es');
  assert.equal(I.resolveLanguage(null, ['fr-FR']), 'en');
  assert.equal(I.setLanguage('__proto__'), false);
});
test('language change and placeholder interpolation do not alter user values', () => {
  const notices = []; const off = I.onChange(lang => notices.push(lang));
  I.setLanguage('ja');
  assert.equal(I.t('Выбрать {asset}', { asset: '<img onerror=x>' }), '<img onerror=x>を選択');
  assert.equal(I.t('UNKNOWN {asset}', { asset: 'BTC/USD' }), 'UNKNOWN BTC/USD');
  assert.equal(I.locale(), 'ja-JP'); off(); I.setLanguage('en');
  assert.deepEqual(notices, ['ja']);
});
test('CSV row errors and provider errors translate and unknown errors are sanitized', () => {
  for (const language of I.languages) {
    I.setLanguage(language);
    const error = I.error(Error('Запись 2: неверное число столбцов.'));
    assert.equal(error, I.t('Запись {row}: {message}', { row: 2, message: I.t('неверное число столбцов.') }));
    assert.equal(I.error(Error('CoinGecko не ответил за 20 секунд. Попробуйте ещё раз.')), I.t('CoinGecko не ответил за 20 секунд. Попробуйте ещё раз.'));
    assert(!I.error(Error('secret-value-do-not-display')).includes('secret-value'));
  }
});
