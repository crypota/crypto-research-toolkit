/* Pure analytics shared by the dashboard and Node tests. No network or DOM. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CryptoAnalytics = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const MAX_ROWS = 100000;
  function readCSV(text) {
    text = text.replace(/^\uFEFF/, '');
    const rows = []; let row = [], field = '', quoted = false, closed = false;
    function cell() { row.push(field); field = ''; closed = false; }
    function finish() {
      cell();
      if (row.length !== 1 || row[0].trim() !== '') rows.push(row);
      row = [];
      if (rows.length > MAX_ROWS + 1) throw Error('Не более 100 000 наблюдений в одном файле.');
    }
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (quoted) {
        if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (c === '"') { quoted = false; closed = true; }
        else field += c;
      } else if (c === ',') cell();
      else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; finish(); }
      else if (c === '"' && field === '' && !closed) quoted = true;
      else { if (closed || c === '"') throw Error('Некорректные кавычки в CSV.'); field += c; }
    }
    if (quoted) throw Error('Незакрытые кавычки в CSV.');
    if (field || row.length || closed) finish();
    return rows;
  }
  function timestamp(value) {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/.exec(value);
    if (!m) throw Error('Дата: YYYY-MM-DDTHH:mm:ssZ или со смещением, например +04:00 (до 3 знаков миллисекунд).');
    const [year, month, day, hour, minute, second] = m.slice(1, 7).map(Number);
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const offset = m[8];
    if (year < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1] || hour > 23 || minute > 59 || second > 59 ||
        (offset !== 'Z' && (+offset.slice(1, 3) > 23 || +offset.slice(4, 6) > 59))) throw Error('Несуществующая дата или время.');
    const result = Date.parse(value);
    if (!Number.isFinite(result)) throw Error('Некорректная дата.');
    return result;
  }
  function parse(text) {
    if (new TextEncoder().encode(text).length > 5 * 1024 * 1024) throw Error('Размер файла не должен превышать 5 МБ.');
    const rows = readCSV(text);
    if (!rows.length || rows[0].slice().sort().join(',') !== 'price,symbol,timestamp') throw Error('Нужны ровно три столбца: timestamp,symbol,price.');
    const header = rows.shift(); const idx = Object.fromEntries(header.map((v, i) => [v, i]));
    let symbol; const seen = new Set(); const points = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]; const label = `Запись ${i + 1}: `;
      if (row.length !== 3) throw Error(label + 'неверное число столбцов.');
      const pair = row[idx.symbol].trim();
      if (!/^[A-Za-z0-9][A-Za-z0-9._/-]{0,47}$/.test(pair)) throw Error(label + 'некорректный символ актива.');
      if (symbol && symbol !== pair) throw Error(label + 'один файл должен содержать одну пару.');
      symbol = pair;
      let time; try { time = timestamp(row[idx.timestamp].trim()); } catch (e) { throw Error(label + e.message); }
      if (seen.has(time)) throw Error(label + 'повторяющийся момент времени после перевода в UTC.');
      seen.add(time);
      const rawPrice = row[idx.price].trim();
      const coefficient = rawPrice.split(/[eE]/)[0].replace(/^[+-]/, '').replace('.', '').replace(/^0+/, '');
      const price = Number(rawPrice);
      if (!/^[+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(rawPrice) || !Number.isFinite(price) || price < 1e-30 || price > 1e30 || coefficient.length > 40)
        throw Error(label + 'цена должна быть положительным числом от 1e-30 до 1e30, до 40 значащих цифр.');
      points.push({ time, price });
    }
    if (points.length < 2) throw Error('Нужно минимум два наблюдения.');
    const sorted = points.some((p, i) => i && p.time < points[i - 1].time);
    points.sort((a, b) => a.time - b.time);
    return { symbol, points, sorted };
  }
  function stats(points) {
    if (points.length < 2) return null;
    let peak = points[0].price, maxDrawdown = 0, min = peak, max = peak;
    const drawdowns = [], intervals = [];
    for (let i = 0; i < points.length; i++) {
      const p = points[i]; peak = Math.max(peak, p.price);
      const dd = (1 - p.price / peak) * 100;
      maxDrawdown = Math.max(maxDrawdown, dd); min = Math.min(min, p.price); max = Math.max(max, p.price);
      drawdowns.push({ time: p.time, value: -dd });
      if (i) intervals.push(p.time - points[i - 1].time);
    }
    const sorted = intervals.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    const medianInterval = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
    return { count: points.length, first: points[0].price, last: points.at(-1).price, min, max,
      change: (points.at(-1).price / points[0].price - 1) * 100, maxDrawdown, drawdowns,
      start: points[0].time, end: points.at(-1).time, medianInterval,
      irregular: intervals.filter(v => Math.abs(v - medianInterval) > 1).length,
      gaps: intervals.filter(v => v > medianInterval * 1.5).length,
      longestGap: intervals.reduce((max, value) => Math.max(max, value), 0) };
  }
  function windowData(datasets, days = 0, compare = true) {
    if (!datasets.length) return { series: [], error: 'Загрузите CSV или откройте пример.' };
    const considered = compare ? datasets : [datasets[0]];
    let start = Math.max(...considered.map(d => d.points[0].time));
    const end = Math.min(...considered.map(d => d.points.at(-1).time));
    if (days) start = Math.max(start, end - days * 86400000);
    if (start >= end) return { series: [], error: 'У выбранных активов нет общего периода.' };
    const series = considered.map(d => ({ ...d, points: d.points.filter(p => p.time >= start && p.time <= end) }));
    if (series.some(d => d.points.length < 2)) return { series: [], error: 'В общем периоде нужно минимум два наблюдения для каждого актива. Расширьте период или уберите актив.' };
    return { series, start, end };
  }
  // Preserve bucket extrema so a spike is not erased by simple every-Nth sampling.
  function sample(points, limit = 900) {
    if (points.length <= limit) return points;
    const result = [points[0]], size = Math.ceil((points.length - 2) / Math.floor((limit - 2) / 2));
    for (let i = 1; i < points.length - 1; i += size) {
      const bucket = points.slice(i, Math.min(i + size, points.length - 1));
      let lo = bucket[0], hi = lo;
      for (const p of bucket) { if (p.value < lo.value) lo = p; if (p.value > hi.value) hi = p; }
      if (lo === hi) result.push(lo); else result.push(...[lo, hi].sort((a, b) => a.time - b.time));
    }
    result.push(points.at(-1)); return result;
  }
  function nearest(points, time) {
    let lo = 0, hi = points.length - 1;
    while (lo < hi) { const mid = Math.floor((lo + hi) / 2); if (points[mid].time < time) lo = mid + 1; else hi = mid; }
    return lo > 0 && Math.abs(points[lo - 1].time - time) <= Math.abs(points[lo].time - time) ? points[lo - 1] : points[lo];
  }
  function demo() {
    return [
      { symbol: 'ALPHA/USD', base: 128, drift: .005, amp: .15, phase: 0 },
      { symbol: 'BETA/USD', base: 42, drift: .002, amp: .12, phase: 1.7 },
      { symbol: 'GAMMA/USD', base: 8, drift: -.001, amp: .20, phase: 3.4 },
    ].map(d => ({ symbol: d.symbol, sorted: false, demo: true, source: 'Вымышленный демонстрационный ряд', points: Array.from({ length: 120 }, (_, i) => ({
      time: Date.UTC(2025, 10, 1) + i * 86400000,
      price: +(d.base * Math.exp(d.drift * i) * (1 + d.amp * Math.sin(i / 10 + d.phase) + .03 * Math.sin(i * 1.4))).toFixed(6),
    })) }));
  }
  return { parse, readCSV, stats, windowData, sample, nearest, demo, timestamp };
});
