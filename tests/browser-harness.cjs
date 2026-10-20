const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

async function openDashboard() {
  const root = path.resolve(__dirname, '..');
  const server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const filename = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!filename.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
      const type = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png' }[path.extname(filename)] || 'application/octet-stream';
      const data = await fs.readFile(filename); response.writeHead(200, { 'Content-Type': type }); response.end(data);
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const baseURL = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    let proxy;
    if (process.env.PLAYWRIGHT_USE_ENV_PROXY && process.env.HTTPS_PROXY) {
      const address = new URL(process.env.HTTPS_PROXY);
      proxy = { server: address.protocol + '//' + address.host, bypass: '127.0.0.1,localhost',
        username: decodeURIComponent(address.username), password: decodeURIComponent(address.password) };
    }
    browser = await chromium.launch({ headless: true, proxy, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || chromium.executablePath(), args: ['--no-sandbox'] });
  } catch (error) { server.close(); throw error; }
  const page = await browser.newPage({ locale: 'ru-RU', viewport: { width: 1512, height: 1200 }, deviceScaleFactor: 1 });
  return { root, baseURL, page, browser, close: async () => { await browser.close(); await new Promise(resolve => server.close(resolve)); } };
}
module.exports = { openDashboard };
