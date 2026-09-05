#!/usr/bin/env node
// Small, dependency-free static preview server. It deliberately performs no
// per-request console logging so it remains healthy when launched detached.
import http from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const port = Number(option('--port', '8125'));
const root = path.resolve(option('--root', path.resolve('web')));
const types = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
]);

function resolveRequest(url) {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
  const requested = path.resolve(root, `.${pathname}`);
  if (requested !== root && !requested.startsWith(`${root}${path.sep}`)) return null;
  try {
    return statSync(requested).isDirectory() ? path.join(requested, 'index.html') : requested;
  } catch {
    return pathname.endsWith('/') ? path.join(requested, 'index.html') : requested;
  }
}

http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method || '')) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }
  const file = resolveRequest(request.url || '/');
  if (!file) { response.writeHead(400); response.end(); return; }
  try {
    const info = statSync(file);
    if (!info.isFile()) throw new Error('not a file');
    response.writeHead(200, {
      'Content-Length': info.size,
      'Content-Type': types.get(path.extname(file).toLowerCase()) || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    if (request.method === 'HEAD') response.end();
    else createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}).listen(port, '127.0.0.1');
