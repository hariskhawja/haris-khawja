const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { createRoyaleHandler } = require('./royale.cjs');
const { createLeetCodeHandler } = require('./leetcode.cjs');
const root = __dirname;
if (fs.existsSync(path.join(root, '.env')) && process.loadEnvFile) {
  process.loadEnvFile(path.join(root, '.env'));
}
const port = Number(process.env.PORT || 3000);
const allowed = new Set([
  'index.html',
  'styles.css',
  'previews.css',
  'content.js',
  'previews.js',
  'app.js',
  'intro.js',
  'assets/haris-khawja-resume-swe.pdf',
  'assets/haris-khawja-resume-quant.pdf',
]);
const handleRoyale = createRoyaleHandler();
const handleLeetCode = createLeetCodeHandler();
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf',
};
http
  .createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      res.writeHead(400);
      res.end('Bad request');
      return;
    }
    if (pathname === '/api/clash-royale') {
      handleRoyale(req, res);
      return;
    }
    if (pathname === '/api/leetcode') {
      handleLeetCode(req, res);
      return;
    }
    const file = pathname === '/' ? 'index.html' : pathname.slice(1);
    const isImage = /^assets\/[a-z0-9-]+\.(svg|png|webp|jpg)$/.test(file);
    if (!allowed.has(file) && !isImage) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    fs.readFile(path.join(root, file), (error, buffer) => {
      if (error) {
        res.writeHead(error.code === 'ENOENT' ? 404 : 500);
        res.end('Unable to load file');
        return;
      }
      res.writeHead(200, {
        'Content-Type': types[path.extname(file)],
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Length': buffer.length,
        ...(file.endsWith('.pdf')
          ? { 'Content-Disposition': `inline; filename="${path.basename(file)}"` }
          : {}),
      });
      res.end(buffer);
    });
  })
  .listen(port, '127.0.0.1', () =>
    console.log(`Portfolio ready at http://localhost:${port}`),
  );
