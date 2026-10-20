(function () {
  'use strict';
  const A = window.CryptoAnalytics;
  const CG = window.CoinGeckoData;
  const $ = id => document.getElementById(id);
  const colors = ['#b4f272', '#8caaff', '#deabff', '#62dbbb', '#f3b572', '#f18cbd', '#76cdeb', '#e2df8a'];
  const state = { datasets: [], active: null, mode: 'compare', days: 0, serial: 0, current: null };
  const online = { client: null, verified: false, busy: false, generation: 0, status: '' };
  const number = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });
  const dateFormat = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const shortDate = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short', timeZone: 'UTC' });
  const longDate = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' });
  const pct = value => (value > 0 ? '+' : '') + (Math.abs(value) >= 1e9 ? value.toExponential(3) : number.format(value)) + '%';
  function price(value) {
    if (value === undefined) return '—';
    if (value < .000001 || value >= 1e12) return value.toExponential(3);
    return new Intl.NumberFormat('ru-RU', { maximumSignificantDigits: value < 1 ? 6 : 8 }).format(value);
  }
  function element(tag, className, text) {
    const node = document.createElement(tag); if (className) node.className = className;
    if (text !== undefined) node.textContent = text; return node;
  }
  function svgNode(tag, attrs = {}, text) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    if (text !== undefined) node.textContent = text; return node;
  }
  function message(text) {
    const box = element('div', 'message'); box.setAttribute('role', 'alert');
    box.append(element('span', '', text)); const close = element('button', '', '×');
    close.setAttribute('aria-label', 'Закрыть сообщение'); close.onclick = () => box.remove(); box.append(close); $('messages').append(box);
  }
  function addDataset(dataset) {
    const labels = new Set(state.datasets.map(d => d.label));
    let label = dataset.symbol, suffix = 2;
    while (labels.has(label)) label = dataset.symbol + ` (${suffix++})`;
    const id = ++state.serial;
    const result = { ...dataset, id, selected: true, color: colors[(id - 1) % colors.length], label };
    state.datasets.push(result); if (state.active === null) state.active = id;
  }
  function loadDemo() {
    if (state.datasets.length + 3 > 8) { message('Для демонстрации нужны три свободных места. Удалите ненужные ряды.'); return; }
    A.demo().forEach(addDataset); render();
  }
  function renderOnline() {
    $('cg-connect').textContent = online.client ? (online.verified ? 'CoinGecko подключён · настройки' : 'Ключ введён · настройки') : 'Подключить CoinGecko';
    $('cg-disconnect').hidden = !online.client;
    $('cg-search-button').disabled = online.busy;
    $('cg-refresh').disabled = online.busy || !online.client || !state.datasets.some(d => d.origin === 'coingecko' && d.selected);
    $('cg-history').disabled = online.busy;
    document.querySelectorAll('[data-coin], [data-add-coin]').forEach(b => { b.disabled = online.busy; });
    $('cg-status').textContent = online.status || (online.client ? 'Ключ действует до закрытия страницы · кэш 5 минут' : 'Ключ вводится один раз на открытую страницу');
    $('cg-status').classList.toggle('loading', online.busy);
    $('cg-connect').disabled = online.busy;
    $('cg-search').disabled = online.busy;
  }
  function openConnection() {
    $('cg-key-error').hidden = true;
    $('cg-dialog').showModal();
  }
  async function loadCoins(coins, preserveActive = false) {
    if (!online.client) { openConnection(); return; }
    if (online.busy || !coins.length) return;
    const client = online.client, generation = online.generation;
    online.busy = true; let first = null, loaded = 0;
    try {
      for (const coin of coins) {
        if (!state.datasets.some(d => d.origin === 'coingecko' && d.coinId === coin.id) && state.datasets.length >= 8) {
          message('Нужно свободное место: удалите ненужный ряд. Максимум — 8 активов.'); break;
        }
        online.status = `Загрузка ${coin.name || coin.id}…`; renderOnline();
        try {
          const dataset = await client.history(coin, Number($('cg-history').value));
          if (generation !== online.generation) return;
          let existing = state.datasets.find(d => d.origin === 'coingecko' && d.coinId === coin.id);
          if (existing) { Object.assign(existing, dataset); existing.selected = true; }
          else { addDataset(dataset); existing = state.datasets.at(-1); }
          if (first === null) first = existing.id;
          loaded++; online.verified = true;
        } catch (error) {
          if (generation !== online.generation || error.kind === 'closed') return;
          message((coin.name || coin.id) + ': ' + error.message);
          if (error.kind === 'auth') { client.disconnect(); online.client = null; online.verified = false; break; }
          if (error.kind === 'rate' || error.kind === 'network') break;
        }
      }
      if (loaded) {
        state.datasets.filter(d => d.demo).forEach(d => { d.selected = false; });
        if (!preserveActive || !state.datasets.find(d => d.id === state.active && d.selected)) state.active = first;
        state.days = 0;
        online.status = `Загружено рядов: ${loaded}. Кэш ответов — 5 минут.`;
      } else online.status = online.client ? 'Данные не обновлены. Проверьте сообщение об ошибке.' : '';
    } finally {
      if (generation === online.generation) { online.busy = false; render(); }
    }
  }
  async function refreshCoins() {
    const coins = selectedData().filter(d => d.origin === 'coingecko').map(d => ({ id: d.coinId, symbol: d.symbol.replace(/\/USD$/, ''), name: d.coinName }));
    if (coins.length) await loadCoins(coins, true);
  }
  async function searchCoins(event) {
    event?.preventDefault();
    if (!online.client) { openConnection(); return; }
    if (online.busy) return;
    const client = online.client, generation = online.generation;
    online.busy = true; online.status = 'Поиск в CoinGecko…'; renderOnline(); $('cg-results').replaceChildren();
    try {
      const coins = await client.search($('cg-search').value);
      if (generation !== online.generation) return;
      if (!coins.length) $('cg-results').append(element('p', 'search-empty', 'Монеты не найдены. Попробуйте название или другой тикер.'));
      for (const coin of coins) {
        const row = element('div', 'search-result'); const text = element('div');
        text.append(element('strong', '', coin.name + ' · ' + coin.symbol.toUpperCase()), element('span', '', 'CoinGecko ID: ' + coin.id + (coin.rank ? ' · #' + coin.rank : '')));
        const button = element('button', 'button secondary', 'Добавить'); button.dataset.addCoin = coin.id;
        button.setAttribute('aria-label', 'Добавить ' + coin.name); button.onclick = () => loadCoins([coin]);
        row.append(text, button); $('cg-results').append(row);
      }
      online.status = `Найдено: ${coins.length}. Проверяйте CoinGecko ID перед выбором.`;
    } catch (error) {
      if (generation !== online.generation) return;
      if (error.kind !== 'closed') message(error.message);
      if (error.kind === 'auth') { client.disconnect(); online.client = null; online.verified = false; }
      online.status = '';
    } finally { if (generation === online.generation) { online.busy = false; renderOnline(); } }
  }
  function renderAssets() {
    $('assets').replaceChildren(); $('asset-count').textContent = state.datasets.length;
    if (!state.datasets.length) $('assets').append(element('p', 'empty-assets', 'Добавьте первый набор данных.'));
    for (const d of state.datasets) {
      const row = element('div', 'asset-row' + (d.id === state.active ? ' current' : ''));
      row.style.setProperty('--coin', d.color);
      const select = element('button', 'asset-select'); select.setAttribute('aria-label', `Выбрать ${d.label}`);
      select.setAttribute('aria-pressed', String(d.id === state.active));
      select.append(element('span', 'asset-monogram', d.symbol[0]));
      const name = element('span'); const title = element('span', 'asset-name', d.label); title.title = d.label;
      name.append(title, element('span', 'asset-sub', (d.demo ? 'Демо · ' : '') + number.format(d.points.length) + ' точек')); select.append(name);
      select.onclick = () => { state.active = d.id; d.selected = true; render(); };
      const check = element('input', 'asset-check'); check.type = 'checkbox'; check.checked = d.selected;
      check.setAttribute('aria-label', `Сравнивать ${d.label}`);
      check.onchange = () => {
        d.selected = check.checked;
        if (!d.selected && state.active === d.id) state.active = state.datasets.find(x => x.selected)?.id ?? null;
        if (d.selected && state.active === null) state.active = d.id;
        render();
      };
      const remove = element('button', 'asset-remove', '×'); remove.setAttribute('aria-label', `Удалить ${d.label}`);
      remove.disabled = online.busy;
      remove.onclick = () => {
        state.datasets = state.datasets.filter(x => x.id !== d.id);
        if (state.active === d.id) state.active = state.datasets.find(x => x.selected)?.id ?? null;
        render();
      };
      row.append(select, check, remove); $('assets').append(row);
    }
  }
  function selectedData() {
    const active = state.datasets.find(d => d.id === state.active);
    if (!active) return [];
    return [active, ...state.datasets.filter(d => d.selected && d.id !== active.id)];
  }
  function render() {
    renderOnline();
    renderAssets();
    document.querySelectorAll('[data-days]').forEach(b => { const active = +b.dataset.days === state.days; b.classList.toggle('selected', active); b.setAttribute('aria-pressed', active); });
    document.querySelectorAll('[data-mode]').forEach(b => { const active = b.dataset.mode === state.mode; b.classList.toggle('selected', active); b.setAttribute('aria-pressed', active); });
    const selected = selectedData();
    const windowed = A.windowData(selected, state.days, state.mode === 'compare');
    state.current = windowed;
    const active = selected[0]; const points = windowed.series[0]?.points || [];
    const metrics = A.stats(points);
    const hasDemo = selected.some(d => d.demo);
    $('notice').classList.toggle('real', !hasDemo);
    $('notice-text').textContent = hasDemo
      ? 'Демонстрационные ALPHA, BETA и GAMMA — вымышленные активы. Это пример работы панели, не реальные котировки.'
      : selected.some(d => d.origin === 'coingecko') ? 'Реальная история CoinGecko в USD. Это снимок на момент загрузки; обновление — по кнопке. Цены могут запаздывать.'
        : state.datasets.length ? 'CSV обрабатываются локально и не сохраняются после закрытия страницы. Вы смотрите загруженную историю.'
        : 'Начните с CoinGecko: подключите ключ и загрузите реальные BTC, ETH и SOL. CSV и деморежим доступны отдельно.';
    $('active-symbol').textContent = active?.label || 'Выберите актив';
    $('active-icon').textContent = active?.symbol[0] || '+';
    $('active-icon').style.color = active?.color || colors[0];
    $('active-source').textContent = active ? (active.demo ? 'Вымышленный ряд · ежедневные наблюдения' : active.origin === 'coingecko' ? active.source + ' · получено ' + longDate.format(active.fetchedAt) + ' UTC' : active.source) : 'Подключите CoinGecko или загрузите CSV';
    $('active-source').title = active?.source || '';
    $('metric-price').textContent = metrics ? price(metrics.last) : '—';
    $('metric-quote').textContent = metrics ? `Мин. ${price(metrics.min)} · макс. ${price(metrics.max)}` : 'В выбранном периоде';
    $('metric-change').textContent = metrics ? pct(metrics.change) : '—';
    $('metric-change').className = 'metric-value' + (metrics ? (metrics.change >= 0 ? ' positive' : ' negative') : '');
    $('metric-start').textContent = metrics ? `Начальная цена: ${price(metrics.first)}` : 'От первой до последней цены';
    $('metric-drawdown').textContent = metrics ? number.format(metrics.maxDrawdown) + '%' : '—';
    $('metric-drawdown').className = 'metric-value' + (metrics && metrics.maxDrawdown > 0 ? ' negative' : '');
    $('metric-count').textContent = metrics ? number.format(metrics.count) : '—';
    $('metric-dates').textContent = metrics ? `${shortDate.format(metrics.start)} — ${shortDate.format(metrics.end)} · UTC` : 'UTC';
    $('drawdown-badge').textContent = metrics ? 'MAX ' + number.format(metrics.maxDrawdown) + '%' : '—';
    $('price-heading').textContent = state.mode === 'compare' ? 'Сравнение траекторий' : 'Динамика цены';
    $('chart-note').textContent = state.mode === 'compare' ? 'Первое наблюдение каждого ряда в общем периоде = 100.' : 'Цена выбранного актива в единицах исходной пары.';
    $('chart-range').textContent = windowed.series.length ? `${dateFormat.format(windowed.start)} — ${dateFormat.format(windowed.end)}` : 'Нет общего периода';
    $('legend').replaceChildren();
    for (const d of windowed.series) { const item = element('span', 'legend-item'); const dot = element('i'); dot.style.background = d.color; item.append(dot, document.createTextNode(d.label)); $('legend').append(item); }
    const chartSeries = windowed.series.map(d => ({ ...d, points: d.points.map(p => ({ time: p.time, value: state.mode === 'compare' ? p.price / d.points[0].price * 100 : p.price })) }));
    drawChart($('price-chart'), chartSeries, { start: windowed.start, end: windowed.end, error: windowed.error, normalized: state.mode === 'compare', id: 'price' });
    drawChart($('drawdown-chart'), metrics ? [{ label: active.label, color: '#ff8d94', points: metrics.drawdowns }] : [], { start: windowed.start, end: windowed.end, error: windowed.error, drawdown: true, id: 'drawdown' });
    renderQuality(active, metrics);
    $('comparison-body').replaceChildren();
    for (const d of windowed.series) {
      const m = A.stats(d.points); const tr = element('tr'); const name = element('td'); const dot = element('i'); dot.style.background = d.color;
      name.append(dot, document.createTextNode(d.label));
      tr.append(name, element('td', '', price(m.last)), element('td', m.change >= 0 ? 'positive' : 'negative', pct(m.change)),
        element('td', m.maxDrawdown > 0 ? 'negative' : '', number.format(m.maxDrawdown) + '%'), element('td', '', number.format(m.count)),
        element('td', '', shortDate.format(m.start) + ' — ' + shortDate.format(m.end)));
      $('comparison-body').append(tr);
    }
    if (!windowed.series.length) { const td = element('td', '', windowed.error); td.colSpan = 6; const tr = element('tr'); tr.append(td); $('comparison-body').append(tr); }
    $('comparison-count').textContent = windowed.series.length + ' ряд(а)';
    $('export-open').disabled = !windowed.series.length;
  }
  function interval(value) {
    if (value >= 86400000) return number.format(value / 86400000) + ' дн.';
    if (value >= 3600000) return number.format(value / 3600000) + ' ч';
    if (value >= 60000) return number.format(value / 60000) + ' мин.';
    return number.format(value / 1000) + ' сек.';
  }
  function renderQuality(dataset, filteredMetrics) {
    const body = $('quality-body'); body.className = 'quality-body'; body.replaceChildren();
    if (!dataset) { body.append(element('p', 'quality-summary', 'Выберите актив для проверки.')); return; }
    const all = A.stats(dataset.points); const m = filteredMetrics || all;
    const warning = m.irregular > 0 || dataset.sorted;
    $('quality-dot').classList.toggle('warning', warning);
    const rows = [
      ['Часовой пояс', 'UTC · проверен'],
      ['Медианный интервал', interval(m.medianInterval)],
      ['Интервалов > 1,5× медианы', String(m.gaps)],
      ['Последняя запись файла', dateFormat.format(all.end)],
    ];
    for (const [label, value] of rows) { const row = element('div', 'quality-row'); row.append(element('span', '', label), element('strong', '', value)); body.append(row); }
    let note = m.irregular ? `Нерегулярных интервалов: ${m.irregular}. Самый длинный: ${interval(m.longestGap)}. ` : 'Интервалы равномерные. ';
    if (dataset.sorted) note += 'Строки автоматически отсортированы. ';
    note += 'Пропуски оцениваются по интервалам, а не по расписанию источника. Подлинность и полнота данных не проверены.';
    body.append(element('p', 'quality-summary' + (warning ? ' warning' : ''), note));
    if (dataset.origin === 'coingecko') body.append(element('p', 'quality-summary', 'Источник: CoinGecko ID ' + dataset.coinId + '. Отброшено некорректных / повторных записей API: ' + dataset.discarded + '.'));
  }
  function drawChart(container, series, options) {
    container.replaceChildren();
    container.onkeydown = null;
    if (!series.length) { container.append(element('div', 'chart-empty', options.error || 'Нет данных.')); return; }
    const w = Math.max(container.clientWidth, 260), h = container.clientHeight;
    const pad = { left: 13, right: w < 500 ? 63 : 77, top: 17, bottom: 33 };
    const pw = w - pad.left - pad.right, ph = h - pad.top - pad.bottom;
    let min = Infinity, max = -Infinity;
    for (const s of series) for (const p of s.points) { min = Math.min(min, p.value); max = Math.max(max, p.value); }
    let range = max - min;
    if (!range) range = Math.abs(max) * .1 || 1;
    if (options.drawdown) { max = 0; min = Math.min(-1, min * 1.12); }
    else { min = Math.max(0, min - range * .16); max += range * .16; }
    const x = time => pad.left + (time - options.start) / (options.end - options.start) * pw;
    const y = value => pad.top + (max - value) / (max - min) * ph;
    const svg = svgNode('svg', { viewBox: `0 0 ${w} ${h}`, width: w, height: h, 'aria-hidden': 'true', xmlns: 'http://www.w3.org/2000/svg' });
    const defs = svgNode('defs'); const gradient = svgNode('linearGradient', { id: options.id + '-fill', x1: '0', x2: '0', y1: '0', y2: '1' });
    gradient.append(svgNode('stop', { offset: '0%', 'stop-color': series[0].color, 'stop-opacity': '.16' }), svgNode('stop', { offset: '100%', 'stop-color': series[0].color, 'stop-opacity': '0' })); defs.append(gradient); svg.append(defs);
    for (let i = 0; i < 5; i++) {
      const yy = pad.top + ph * i / 4; const value = max - (max - min) * i / 4;
      svg.append(svgNode('line', { x1: pad.left, x2: w - pad.right, y1: yy, y2: yy, class: 'gridline', stroke: '#242b31', 'stroke-dasharray': '3 5' }));
      let label = options.drawdown ? number.format(value) + '%' : Math.abs(value) >= 1e12 ? value.toExponential(2) : Math.abs(value) >= 1e6 ? number.format(value / 1e6) + 'M' : Math.abs(value) >= 1e4 ? number.format(value / 1e3) + 'K' : Math.abs(value) >= 1 ? number.format(value) : price(value);
      svg.append(svgNode('text', { x: w - pad.right + 12, y: yy + 3, fill: '#73808d', 'font-size': '10' }, label));
    }
    const ticks = w < 500 ? 3 : 5;
    for (let i = 0; i < ticks; i++) {
      const xx = pad.left + pw * i / (ticks - 1); const t = options.start + (options.end - options.start) * i / (ticks - 1);
      svg.append(svgNode('text', { x: xx, y: h - 8, 'text-anchor': i === 0 ? 'start' : i === ticks - 1 ? 'end' : 'middle', fill: '#73808d', 'font-size': '10' }, shortDate.format(t)));
    }
    series.forEach((s, i) => {
      const reduced = A.sample(s.points, Math.max(100, Math.floor(pw)));
      const line = reduced.map((p, j) => `${j ? 'L' : 'M'}${x(p.time).toFixed(2)},${y(p.value).toFixed(2)}`).join(' ');
      if (i === 0) {
        const bottom = options.drawdown ? y(0) : pad.top + ph;
        svg.append(svgNode('path', { d: line + ` L${x(reduced.at(-1).time)},${bottom} L${x(reduced[0].time)},${bottom} Z`, fill: `url(#${options.id}-fill)` }));
      }
      svg.append(svgNode('path', { d: line, fill: 'none', stroke: s.color, 'stroke-width': i === 0 ? '2.3' : '1.8', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
    });
    const cross = svgNode('g', { 'data-transient': 'true', visibility: 'hidden' });
    const line = svgNode('line', { y1: pad.top, y2: pad.top + ph, stroke: '#61707e', 'stroke-dasharray': '4 4' }); cross.append(line);
    const dots = series.map(s => { const dot = svgNode('circle', { r: '4', fill: s.color, stroke: '#111418', 'stroke-width': '2' }); cross.append(dot); return dot; }); svg.append(cross);
    container.append(svg);
    const tooltip = element('div', 'chart-tooltip'); tooltip.hidden = true; container.append(tooltip);
    function inspect(time, cx) {
      cross.setAttribute('visibility', 'visible'); line.setAttribute('x1', cx); line.setAttribute('x2', cx);
      tooltip.replaceChildren(element('time', '', longDate.format(time) + ' UTC'));
      if (series.length > 1) tooltip.append(element('span', 'tooltip-sample', 'Ближайшие наблюдения каждого ряда'));
      series.forEach((s, i) => {
        const p = A.nearest(s.points, time); dots[i].setAttribute('cx', x(p.time)); dots[i].setAttribute('cy', y(p.value));
        const row = element('div', 'tooltip-row'); const name = element('span', '', s.label); name.style.color = s.color;
        row.append(name, element('strong', '', options.drawdown ? number.format(p.value) + '%' : price(p.value))); tooltip.append(row);
        if (series.length > 1) tooltip.append(element('span', 'tooltip-sample', longDate.format(p.time) + ' UTC'));
      });
      tooltip.hidden = false;
      tooltip.style.left = Math.max(0, Math.min(cx + 14, w - tooltip.offsetWidth - 5)) + 'px';
    }
    svg.addEventListener('pointermove', e => {
      const rect = svg.getBoundingClientRect(), cx = Math.max(pad.left, Math.min(w - pad.right, e.clientX - rect.left));
      inspect(options.start + (cx - pad.left) / pw * (options.end - options.start), cx);
    });
    function clear() { tooltip.hidden = true; cross.setAttribute('visibility', 'hidden'); }
    svg.addEventListener('pointerleave', clear); container.onblur = clear;
    let keyIndex = 0;
    container.onkeydown = e => {
      if (e.key === 'Escape') { clear(); return; }
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      keyIndex = e.key === 'Home' ? 0 : e.key === 'End' ? series[0].points.length - 1 : Math.max(0, Math.min(series[0].points.length - 1, keyIndex + (e.key === 'ArrowLeft' ? -1 : 1)));
      const p = series[0].points[keyIndex]; inspect(p.time, x(p.time));
    };
  }
  let importing = false;
  async function importFiles(files) {
    if (importing) return;
    importing = true; $('csv-input').disabled = true;
    const errors = []; let firstImported = null;
    try {
      for (const file of files) {
        if (state.datasets.length >= 8) { errors.push('Одновременно можно открыть до 8 рядов. Удалите ненужные.'); break; }
        try {
          if (file.size > 5 * 1024 * 1024) throw Error('Файл превышает 5 МБ.');
          const raw = await file.arrayBuffer();
          const text = new TextDecoder('utf-8', { fatal: true }).decode(raw);
          const dataset = A.parse(text);
          let hash = null;
          if (window.crypto?.subtle) {
            const digest = await crypto.subtle.digest('SHA-256', raw);
            hash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
          }
          addDataset({ ...dataset, demo: false, source: file.name, hash });
          if (firstImported === null) firstImported = state.datasets.at(-1).id;
        } catch (error) { errors.push(file.name + ': ' + error.message); }
      }
      if (firstImported !== null) {
        state.datasets.forEach(d => { d.selected = !d.demo; });
        state.active = firstImported; state.days = 0;
      }
      render(); errors.forEach(message);
    } finally { importing = false; $('csv-input').disabled = false; $('csv-input').value = ''; }
  }
  function download(content, type, filename) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = element('a'); a.href = url; a.download = filename; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
  const markdownEscape = text => String(text).replace(/[\\`*_\[\]<>|]/g, '\\$&').replace(/[\r\n]/g, ' ');
  function reportObject() {
    return { title: 'Crypto Research Toolkit', generated_at_utc: new Date().toISOString(), mode: state.mode,
      period: { start_utc: new Date(state.current.start).toISOString(), end_utc: new Date(state.current.end).toISOString() },
      notes: ['Saved observations, not live prices. Demo series are fictional.', 'Browser calculations use JavaScript floating-point numbers.',
        'Drawdown resets at the selected period start. No liquidity, safety, or future-return assessment.', 'Gap detection is a heuristic using 1.5 times the median interval.',
        ...(state.current.series.some(d => d.origin === 'coingecko') ? ['Market data provided by CoinGecko: https://www.coingecko.com/en/api'] : [])],
      series: state.current.series.map(d => { const m = A.stats(d.points); return {
        label: d.label, symbol: d.symbol, synthetic: !!d.demo, source: d.source, input_sha256: d.hash || null,
        provider: d.origin || (d.demo ? 'demo' : 'csv'), coin_id: d.coinId || null, source_url: d.sourceURL || null,
        fetched_at_utc: d.fetchedAt ? new Date(d.fetchedAt).toISOString() : null,
        start_utc: new Date(m.start).toISOString(), end_utc: new Date(m.end).toISOString(), observations: m.count,
        first_price: m.first, last_price: m.last, sample_min: m.min, sample_max: m.max,
        change_pct: m.change, max_drawdown_pct: m.maxDrawdown,
        quality: { median_interval_ms: m.medianInterval, irregular_intervals: m.irregular, long_intervals: m.gaps, longest_interval_ms: m.longestGap },
      }; }) };
  }
  function exportReport(format) {
    if (!state.current?.series.length) return;
    const report = reportObject();
    if (format === 'json') download(JSON.stringify(report, null, 2), 'application/json', 'crypto-research-report.json');
    if (format === 'markdown') {
      const rows = ['# Crypto Research Toolkit', '', `Generated: ${report.generated_at_utc}`, `Period (UTC): ${report.period.start_utc} — ${report.period.end_utc}`, '',
        '| Series | Synthetic | First | Last | Change (%) | Max drawdown (%) | Observations |', '| --- | --- | --- | --- | --- | --- | --- |'];
      for (const s of report.series) rows.push(`| ${markdownEscape(s.label)} | ${s.synthetic ? 'YES' : 'No'} | ${s.first_price} | ${s.last_price} | ${s.change_pct.toFixed(6)} | ${s.max_drawdown_pct.toFixed(6)} | ${s.observations} |`);
      rows.push('', '## Sources', '');
      for (const s of report.series) rows.push(`- ${markdownEscape(s.label)}: ${markdownEscape(s.source)}; SHA-256: ${s.input_sha256 || 'not applicable / unavailable'}; actual UTC range: ${s.start_utc} — ${s.end_utc}; long intervals: ${s.quality.long_intervals}.` + (s.source_url ? ` Source: ${s.source_url}; fetched: ${s.fetched_at_utc}.` : ''));
      rows.push('', '## Limitations', '', ...report.notes.map(n => '- ' + n), '');
      download(rows.join('\n'), 'text/markdown;charset=utf-8', 'crypto-research-report.md');
    }
    if (format === 'csv') {
      const quote = value => '"' + String(value).replace(/"/g, '""') + '"';
      const rows = ['timestamp,symbol,series,price,synthetic'];
      for (const d of state.current.series) for (const p of d.points) rows.push([new Date(p.time).toISOString(), d.symbol, d.label, p.price, !!d.demo].map(quote).join(','));
      download(rows.join('\r\n') + '\r\n', 'text/csv;charset=utf-8', 'crypto-research-observations.csv');
    }
    if (format === 'svg') {
      const original = $('price-chart').querySelector('svg'); if (!original) return;
      const width = Number(original.getAttribute('width')), height = Number(original.getAttribute('height'));
      const svg = svgNode('svg', { xmlns: 'http://www.w3.org/2000/svg', width, height: height + 132, viewBox: `0 0 ${width} ${height + 132}` });
      svg.append(svgNode('rect', { width: '100%', height: '100%', fill: '#111418' }));
      svg.append(svgNode('text', { x: 18, y: 27, fill: '#edf2f5', 'font-family': 'Arial,sans-serif', 'font-size': 15 }, 'Crypto Research Toolkit · ' + (state.mode === 'compare' ? 'Normalized to 100' : 'Price')));
      svg.append(svgNode('text', { x: 18, y: 47, fill: '#929da8', 'font-family': 'Arial,sans-serif', 'font-size': 10 }, report.period.start_utc.slice(0, 10) + ' — ' + report.period.end_utc.slice(0, 10) + ' UTC'));
      const chart = original.cloneNode(true); chart.querySelectorAll('[data-transient]').forEach(n => n.remove());
      const group = svgNode('g', { transform: 'translate(0,60)' }); group.append(...Array.from(chart.childNodes)); svg.append(group);
      // A separate colored legend line per series also works on narrow screens.
      const lineLength = Math.max(24, Math.floor((width - 36) / 6));
      let legendLine = 0;
      report.series.forEach((s, i) => {
        const label = s.label + (s.synthetic ? ' [SYNTHETIC]' : '');
        for (let pos = 0; pos < label.length; pos += lineLength) {
          svg.append(svgNode('text', { x: 18, y: height + 79 + legendLine++ * 14, fill: state.current.series[i].color, 'font-family': 'Arial,sans-serif', 'font-size': 10 }, label.slice(pos, pos + lineLength)));
        }
      });
      const credited = report.series.some(s => s.provider === 'coingecko');
      const finalHeight = height + 110 + legendLine * 14 + (credited ? 15 : 0); svg.setAttribute('height', finalHeight); svg.setAttribute('viewBox', `0 0 ${width} ${finalHeight}`);
      if (credited) {
        const credit = svgNode('a', { href: 'https://www.coingecko.com/en/api' });
        credit.append(svgNode('text', { x: 18, y: finalHeight - 27, fill: '#a4b69d', 'font-family': 'Arial,sans-serif', 'font-size': 9 }, 'Market data provided by CoinGecko')); svg.append(credit);
      }
      svg.append(svgNode('text', { x: 18, y: finalHeight - 12, fill: '#73808d', 'font-family': 'Arial,sans-serif', 'font-size': 9 }, 'Saved observations. No forecast. Sampled rendering; metrics use all observations.'));
      download(new XMLSerializer().serializeToString(svg), 'image/svg+xml;charset=utf-8', 'crypto-research-chart.svg');
    }
    $('export-dialog').close();
  }
  document.querySelectorAll('[data-days]').forEach(b => b.addEventListener('click', () => { state.days = +b.dataset.days; render(); }));
  document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => { state.mode = b.dataset.mode; render(); }));
  $('csv-input').addEventListener('change', e => importFiles(Array.from(e.target.files)));
  const zone = $('drop-zone');
  zone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('csv-input').click(); } });
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragging'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragging'));
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('dragging'); importFiles(Array.from(e.dataTransfer.files)); });
  // Keep an accidentally dropped CSV from navigating away from the current research.
  window.addEventListener('dragover', e => e.preventDefault()); window.addEventListener('drop', e => e.preventDefault());
  $('demo-load').onclick = loadDemo;
  $('cg-connect').onclick = openConnection;
  $('cg-dialog').addEventListener('close', () => { $('cg-key').value = ''; });
  $('cg-key-form').onsubmit = async event => {
    event.preventDefault();
    try {
      const client = CG.createClient($('cg-key').value);
      online.client?.disconnect(); online.generation++; online.client = client;
      online.verified = false; online.busy = false; online.status = '';
      $('cg-key').value = ''; $('cg-dialog').close();
      await loadCoins(CG.DEFAULT_COINS);
    } catch (error) { $('cg-key-error').hidden = false; $('cg-key-error').textContent = error.message; }
  };
  $('cg-disconnect').onclick = () => {
    online.client?.disconnect(); online.client = null; online.verified = false;
    online.generation++; online.busy = false; online.status = ''; $('cg-key').value = '';
    $('cg-dialog').close(); $('cg-results').replaceChildren(); render();
  };
  $('cg-search-form').onsubmit = searchCoins;
  $('cg-refresh').onclick = refreshCoins;
  $('cg-history').onchange = () => { if (online.client) refreshCoins(); };
  document.querySelectorAll('[data-coin]').forEach(b => b.onclick = () => loadCoins([CG.DEFAULT_COINS.find(c => c.id === b.dataset.coin)]));
  $('format-open').onclick = () => $('format-dialog').showModal();
  $('export-open').onclick = () => $('export-dialog').showModal();
  document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => $(b.dataset.close).close());
  document.querySelectorAll('[data-export]').forEach(b => b.onclick = () => exportReport(b.dataset.export));
  $('template-download').onclick = () => download('timestamp,symbol,price\r\n2026-01-01T00:00:00Z,SAMPLE/USD,100\r\n2026-01-02T00:00:00Z,SAMPLE/USD,120\r\n2026-01-03T00:00:00Z,SAMPLE/USD,90\r\n2026-01-04T00:00:00Z,SAMPLE/USD,110\r\n2026-01-05T00:00:00Z,SAMPLE/USD,80\r\n2026-01-06T00:00:00Z,SAMPLE/USD,105\r\n', 'text/csv;charset=utf-8', 'sample_prices.csv');
  let resizeTimer; window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(render, 100); });
  render();
})();
