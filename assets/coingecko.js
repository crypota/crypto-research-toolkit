/* CoinGecko Demo API client. Credentials are closure-only, never part of URLs/data. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CoinGeckoData = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const ROOT = 'https://api.coingecko.com/api/v3/';
  const DEFAULT_COINS = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
  ];
  class APIError extends Error {
    constructor(message, kind = 'api') { super(message); this.kind = kind; }
  }
  function validID(id) {
    if (typeof id !== 'string' || !/^[a-z0-9][a-z0-9_-]{0,127}$/.test(id)) throw new APIError('Некорректный CoinGecko ID.', 'input');
    return id;
  }
  function normalizeHistory(payload, coin, days, fetchedAt) {
    validID(coin.id);
    if (!payload || !Array.isArray(payload.prices) || payload.prices.length > 100000) throw new APIError('CoinGecko вернул некорректную историю.', 'data');
    const unique = new Map(); let discarded = 0;
    for (const pair of payload.prices) {
      if (!Array.isArray(pair) || pair.length !== 2 || !Number.isSafeInteger(pair[0]) || pair[0] < 0 || pair[0] > 8640000000000000 ||
          typeof pair[1] !== 'number' || !Number.isFinite(pair[1]) || pair[1] < 1e-30 || pair[1] > 1e30) { discarded++; continue; }
      if (unique.has(pair[0])) discarded++;
      unique.set(pair[0], { time: pair[0], price: pair[1] });
    }
    const points = Array.from(unique.values()).sort((a, b) => a.time - b.time);
    if (points.length < 2) throw new APIError('Недостаточно корректных наблюдений в ответе CoinGecko.', 'data');
    const ticker = String(coin.symbol || '').toUpperCase();
    const safeTicker = /^[A-Z0-9][A-Z0-9._-]{0,40}$/.test(ticker) ? ticker : coin.id.toUpperCase().slice(0, 40);
    return { symbol: safeTicker + '/USD', coinId: coin.id, coinName: String(coin.name || coin.id).slice(0, 150),
      points, sorted: false, demo: false, origin: 'coingecko', source: 'CoinGecko · ' + coin.id,
      sourceURL: ROOT + 'coins/' + encodeURIComponent(coin.id) + '/market_chart?vs_currency=usd&days=' + days,
      apiDays: days, fetchedAt, discarded, hash: null };
  }
  function createClient(apiKey, options = {}) {
    let key = String(apiKey || '').trim();
    if (!/^[A-Za-z0-9_-]{10,200}$/.test(key)) throw new APIError('Вставьте целиком Demo API-ключ из CoinGecko Dashboard.', 'auth');
    const fetcher = options.fetch || globalThis.fetch.bind(globalThis);
    const now = options.now || Date.now;
    const ttl = options.cacheMs ?? 300000;
    const spacing = options.spacingMs ?? 750;
    const timeout = options.timeoutMs ?? 20000;
    const cache = new Map(); let chain = Promise.resolve(), nextAt = 0, blockedUntil = 0, closed = false, active;
    const pause = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
    async function execute(path, params) {
      if (closed) throw new APIError('Подключение отключено.', 'closed');
      const url = new URL(path, ROOT);
      for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value);
      const cached = cache.get(url.href);
      if (cached && cached.expires > now()) return cached.data;
      if (blockedUntil > now()) throw new APIError('Лимит CoinGecko: подождите около минуты перед новым запросом.', 'rate');
      if (nextAt > now()) await pause(nextAt - now());
      if (closed) throw new APIError('Подключение отключено.', 'closed');
      nextAt = now() + spacing;
      active = new AbortController();
      const controller = active; const timer = setTimeout(() => controller.abort(), timeout);
      try {
        const response = await fetcher(url.href, { method: 'GET', mode: 'cors', credentials: 'omit', redirect: 'error', cache: 'no-store',
          headers: { Accept: 'application/json', 'x-cg-demo-api-key': key }, signal: controller.signal });
        let payload; try { payload = await response.json(); } catch {
          if (response.ok) throw new APIError('CoinGecko вернул ответ не в формате JSON. Попробуйте позже.', 'data');
          payload = {};
        }
        const code = payload?.status?.error_code ?? payload?.error_code;
        if (response.status === 401 || [10002, 10010, 10011].includes(Number(code))) throw new APIError('CoinGecko не принял ключ. Проверьте Demo API-ключ и подключитесь заново.', 'auth');
        if (response.status === 429) {
          const seconds = Math.max(30, Math.min(120, Number(response.headers?.get('retry-after')) || 60));
          blockedUntil = now() + seconds * 1000;
          throw new APIError('Достигнут лимит CoinGecko. Подождите около минуты. Старые данные сохранены.', 'rate');
        }
        if (Number(code) === 10005) throw new APIError('Эти данные недоступны на вашем тарифе CoinGecko.', 'plan');
        if (response.status === 403 || Number(code) === 1020) throw new APIError('CoinGecko заблокировал запрос. Проверьте доступ к сервису из вашей сети.', 'network');
        if (response.status === 404) throw new APIError('Монета не найдена в CoinGecko.', 'data');
        if (!response.ok || code) throw new APIError('CoinGecko временно не отдал данные. Попробуйте позже.', 'api');
        const data = { payload, fetchedAt: now() };
        cache.set(url.href, { data, expires: now() + ttl }); return data;
      } catch (error) {
        if (error instanceof APIError) throw error;
        if (closed) throw new APIError('Подключение отключено.', 'closed');
        if (error.name === 'AbortError') throw new APIError('CoinGecko не ответил за 20 секунд. Попробуйте ещё раз.', 'network');
        // Never display upstream error bodies/URLs: they can echo credentials.
        throw new APIError('Нет связи с CoinGecko. Проверьте интернет; возможна блокировка сети или CORS. CSV и деморежим доступны.', 'network');
      } finally { clearTimeout(timer); if (active === controller) active = null; }
    }
    function request(path, params) {
      const result = chain.catch(() => {}).then(() => execute(path, params)); chain = result; return result;
    }
    return {
      async history(coin, days = 90) {
        validID(coin.id);
        if (![7, 30, 90, 365].includes(days)) throw new APIError('Выберите 7, 30, 90 или 365 дней истории.', 'input');
        const data = await request('coins/' + encodeURIComponent(coin.id) + '/market_chart', { vs_currency: 'usd', days });
        return normalizeHistory(data.payload, coin, days, data.fetchedAt);
      },
      async search(query) {
        query = String(query).trim();
        if (query.length < 2 || query.length > 64) throw new APIError('Введите от 2 до 64 символов для поиска.', 'input');
        const { payload } = await request('search', { query });
        if (!Array.isArray(payload.coins)) throw new APIError('Не удалось прочитать результаты поиска CoinGecko.', 'data');
        return payload.coins.filter(c => c && /^[a-z0-9][a-z0-9_-]{0,127}$/.test(c.id)).slice(0, 12)
          .map(c => ({ id: c.id, symbol: String(c.symbol || '').slice(0, 50), name: String(c.name || c.id).slice(0, 150), rank: c.market_cap_rank ?? null }));
      },
      disconnect() { closed = true; key = ''; cache.clear(); active?.abort(); },
    };
  }
  return { createClient, normalizeHistory, DEFAULT_COINS, APIError };
});
