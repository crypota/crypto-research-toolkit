const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const A = require('../assets/analytics.js');
const header = 'timestamp,symbol,price\n';
const row = (date, price, symbol = 'X/USD') => `${date},${symbol},${price}\n`;

test('known sample agrees with Python CLI change and drawdown', () => {
  const input = fs.readFileSync(path.join(__dirname, '../examples/sample_prices.csv'), 'utf8');
  const m = A.stats(A.parse(input).points);
  assert.equal(m.change.toFixed(6), '5.000000');
  assert.equal(m.maxDrawdown.toFixed(6), '33.333333');
  assert.equal(m.count, 6); assert.equal(m.min, 80); assert.equal(m.max, 120);
});
test('quoted CRLF CSV, BOM, reordered headers and sorting', () => {
  const d = A.parse('\ufeffprice,timestamp,symbol\r\n"120","2026-01-02T04:00:00+04:00","X/USD"\r\n100,2026-01-01T00:00:00Z,X/USD\r\n');
  assert.equal(d.sorted, true); assert.equal(A.stats(d.points).change.toFixed(6), '20.000000');
});
test('duplicates normalize timezone offsets before checking', () => {
  assert.throws(() => A.parse(header + row('2026-01-01T00:00:00Z', 1) + row('2026-01-01T04:00:00+04:00', 2)), /повторяющийся/);
});
test('rejects bad prices, extra columns and mixed assets', () => {
  for (const price of ['NaN', 'Infinity', '0', '-1', '0x10', '1e31', '1e-31', '']) {
    assert.throws(() => A.parse(header + row('2026-01-01T00:00:00Z', price) + row('2026-01-02T00:00:00Z', 1)));
  }
  assert.throws(() => A.parse(header + row('2026-01-01T00:00:00Z', 1) + row('2026-01-02T00:00:00Z', 2, 'Y/USD')), /один файл/);
  assert.throws(() => A.parse(header + '2026-01-01T00:00:00Z,X/USD,1,extra\n'));
  assert.throws(() => A.parse('timestamp,price,price\n'));
  assert.throws(() => A.parse(header + ',,\n'));
});
test('rejects invalid calendar dates, missing zones, and unterminated quotes', () => {
  for (const time of ['2026-02-30T00:00:00Z', '2026-01-01T25:00:00Z', '2026-01-01T00:00:00', '2026-01-01T00:00:00+24:00', '2026-01-01T00:00:00.1234Z']) assert.throws(() => A.timestamp(time));
  assert.doesNotThrow(() => A.timestamp('2024-02-29T00:00:00.123Z'));
  assert.throws(() => A.readCSV('"not closed'));
  assert.throws(() => A.readCSV('"closed"oops'));
});
test('comparison uses common overlap, not independent date ranges', () => {
  const a = { points: [1, 2, 3, 4].map(day => ({ time: day * 86400000, price: day })) };
  const b = { points: [2, 3, 4, 5].map(day => ({ time: day * 86400000, price: day * 2 })) };
  const w = A.windowData([a, b], 0, true);
  assert.equal(w.start, 2 * 86400000); assert.equal(w.end, 4 * 86400000);
  assert.equal(w.series[0].points.length, 3); assert.equal(w.series[1].points.length, 3);
  assert.equal(A.windowData([a, b], 1, true).series[0].points.length, 2);
  assert.equal(A.windowData([a, b], 0, false).series[0].points.length, 4);
});
test('disjoint and underpopulated comparison periods are explicitly rejected', () => {
  const a = { points: [{ time: 0, price: 1 }, { time: 100, price: 2 }] };
  const b = { points: [{ time: 200, price: 1 }, { time: 300, price: 2 }] };
  assert.match(A.windowData([a, b]).error, /нет общего периода/);
  b.points[0].time = 50;
  assert.match(A.windowData([a, b]).error, /минимум два/);
});
test('drawdown restarts at range boundary and zero for an increasing series', () => {
  const points = [100, 50, 60, 80].map((price, time) => ({ time, price }));
  assert.equal(A.stats(points).maxDrawdown, 50);
  assert.equal(A.stats(points.slice(1)).maxDrawdown, 0);
});
test('quality detects long intervals, including beyond observation 1000', () => {
  const points = Array.from({ length: 1100 }, (_, i) => ({ time: i + (i > 1050 ? 100 : 0), price: 1 }));
  const m = A.stats(points); assert.equal(m.medianInterval, 1); assert.equal(m.gaps, 1); assert.equal(m.longestGap, 101);
});
test('render sampling preserves a narrow spike and endpoints', () => {
  const points = Array.from({ length: 10000 }, (_, time) => ({ time, value: time === 4876 ? 1000 : 1 }));
  const reduced = A.sample(points, 300);
  assert(reduced.length <= 300); assert.equal(reduced[0], points[0]); assert.equal(reduced.at(-1), points.at(-1));
  assert(reduced.some(p => p.value === 1000));
});
test('nearest lookup is deterministic at ties', () => {
  const p = [{ time: 10 }, { time: 20 }, { time: 30 }];
  assert.equal(A.nearest(p, 15).time, 10); assert.equal(A.nearest(p, 99).time, 30); assert.equal(A.nearest(p, -1).time, 10);
});
test('demo data is deterministic, positive and explicitly synthetic', () => {
  assert.deepEqual(A.demo(), A.demo());
  for (const d of A.demo()) { assert.equal(d.demo, true); assert.equal(d.points.length, 120); assert(d.points.every(p => p.price > 0)); }
});
