// Simple HTTPS reverse proxy in front of Next.js standalone server.js
// - Spawns `node server.js` (Next standalone) on PORT=3001
// - Listens on 3000 with HTTPS using local certificates
// - Proxies HTTP requests and WebSocket upgrades to 3001

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CERT_DIR = path.join(__dirname, 'certificates');
const CERT_PATH = path.join(CERT_DIR, 'localhost.pem');
const KEY_PATH = path.join(CERT_DIR, 'localhost-key.pem');

const HTTPS_PORT = parseInt(process.env.PORT || '3000', 10);
const UPSTREAM_PORT = parseInt(process.env.UPSTREAM_PORT || '3001', 10);

function startNextStandalone() {
  const env = {
    ...process.env,
    PORT: String(UPSTREAM_PORT),
    HOSTNAME: '0.0.0.0',
  };

  const child = spawn('node', ['server.js'], {
    cwd: __dirname,
    env,
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  child.on('exit', (code, signal) => {
    console.error(`[server.js] exited code=${code} signal=${signal}`);
    process.exit(code || 1);
  });

  return child;
}

async function waitForUpstream(timeoutMs = 60000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const req = http.get({ hostname: '127.0.0.1', port: UPSTREAM_PORT, path: '/', timeout: 2000 }, (res) => {
        res.resume();
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error('Upstream did not become ready in time'));
        } else {
          setTimeout(tryOnce, 200);
        }
      });
      req.on('timeout', () => {
        req.destroy();
        if (Date.now() - start > timeoutMs) {
          reject(new Error('Upstream did not become ready in time (timeout)'));
        } else {
          setTimeout(tryOnce, 200);
        }
      });
    };
    tryOnce();
  });
}

function createProxyServer() {
  const cert = fs.readFileSync(CERT_PATH);
  const key = fs.readFileSync(KEY_PATH);

  const server = https.createServer({ cert, key }, (req, res) => {
    const options = {
      hostname: '127.0.0.1',
      port: UPSTREAM_PORT,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: req.headers.host?.replace(/:\d+$/, `:${UPSTREAM_PORT}`) || `localhost:${UPSTREAM_PORT}`,
      },
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      if (!res.headersSent) res.writeHead(502);
      res.end('Bad Gateway');
    });

    req.pipe(proxyReq, { end: true });
  });

  // WebSocket/Upgrade support
  server.on('upgrade', (req, socket, head) => {
    const options = {
      hostname: '127.0.0.1',
      port: UPSTREAM_PORT,
      path: req.url,
      headers: req.headers,
    };
    const proxySocket = http.request({ ...options, method: 'GET' });
    proxySocket.on('upgrade', (proxyRes, proxySock, proxyHead) => {
      socket.write('HTTP/1.1 101 Switching Protocols\r\n');
      for (const [key, value] of Object.entries(proxyRes.headers)) {
        if (Array.isArray(value)) {
          for (const v of value) socket.write(`${key}: ${v}\r\n`);
        } else if (value) {
          socket.write(`${key}: ${value}\r\n`);
        }
      }
      socket.write('\r\n');
      if (head && head.length) proxySock.write(head);
      proxySock.pipe(socket).pipe(proxySock);
    });
    proxySocket.on('error', (err) => {
      console.error('Upgrade proxy error:', err);
      socket.destroy();
    });
    proxySocket.end();
  });

  server.listen(HTTPS_PORT, '0.0.0.0', () => {
    console.log(`[https-proxy] listening on https://0.0.0.0:${HTTPS_PORT}`);
  });

  server.on('error', (err) => {
    console.error('HTTPS server error:', err);
    process.exit(1);
  });

  return server;
}

// Start processes: wait for upstream before exposing HTTPS
startNextStandalone();
await waitForUpstream().catch((err) => {
  console.error('[https-proxy] Upstream readiness check failed:', err);
  process.exit(1);
});
createProxyServer();
