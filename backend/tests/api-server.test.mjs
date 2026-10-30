import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { app, prisma } from '../src/server.mjs';

function executeAppRequest(app, { method = 'GET', url = '/', headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const req = new EventEmitter();
    req.method = method;
    req.url = url;
    req.originalUrl = url;
    req.headers = { host: 'localhost:5000', ...headers };
    req.query = {};
    req.params = {};
    req.body = body;

    const resHeaders = {};
    let statusCode = 200;
    let bodyBuffer = '';

    const res = new EventEmitter();
    res.setHeader = (key, val) => {
      resHeaders[key.toLowerCase()] = val;
    };
    res.getHeader = (key) => resHeaders[key.toLowerCase()];
    res.get = (key) => resHeaders[key.toLowerCase()];
    res.status = (code) => {
      statusCode = code;
      return res;
    };
    res.writeHead = (code, headers) => {
      statusCode = code;
      if (headers) {
        Object.entries(headers).forEach(([k, v]) => {
          resHeaders[k.toLowerCase()] = v;
        });
      }
    };
    res.end = (chunk) => {
      if (chunk) bodyBuffer += chunk.toString();
      let parsed = null;
      try {
        parsed = JSON.parse(bodyBuffer);
      } catch {
        parsed = bodyBuffer;
      }
      resolve({
        status: statusCode,
        headers: resHeaders,
        body: parsed,
      });
    };

    try {
      app(req, res);
      if (body) {
        req.emit('data', JSON.stringify(body));
      }
      req.emit('end');
    } catch (err) {
      reject(err);
    }
  });
}

test('Express API: Health endpoint returns database status and service count', async () => {
  const res = await executeAppRequest(app, { method: 'GET', url: '/api/health' });
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
  assert.equal(res.body.database, 'connected');
  assert.equal(typeof res.body.serviceCount, 'number');
  assert.ok(res.body.serviceCount >= 20, 'Should have at least 20 seeded services');
});

test('Express API: CORS headers are properly returned on response', async () => {
  const res = await executeAppRequest(app, {
    method: 'GET',
    url: '/api/health',
    headers: { origin: 'http://localhost:3000' },
  });
  assert.equal(res.status, 200);
  assert.ok(
    res.headers['access-control-allow-origin'],
    'access-control-allow-origin header must be present'
  );
});

test('Express API: Services endpoint returns active service catalog with options', async () => {
  const res = await executeAppRequest(app, { method: 'GET', url: '/api/services' });
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(Array.isArray(res.body.services));
  assert.ok(res.body.services.length >= 20);

  const first = res.body.services[0];
  assert.ok(first.title);
  assert.ok(first.slug);
  assert.ok(first.category);
  assert.equal(first.isActive, true);
});

test('Express API: Categories endpoint returns service distribution by category', async () => {
  const res = await executeAppRequest(app, { method: 'GET', url: '/api/categories' });
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(Array.isArray(res.body.categories));
  assert.ok(res.body.categories.length >= 4);

  const keys = res.body.categories.map((c) => c.key);
  assert.ok(keys.includes('AI_ACCOUNTS'));
  assert.ok(keys.includes('VIDEO_EDITING'));
});

test('Express API: Unknown route returns structured 404 JSON', async () => {
  const res = await executeAppRequest(app, {
    method: 'GET',
    url: '/api/nonexistent-endpoint-xyz',
  });
  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
  assert.ok(res.body.error.includes('not found'));
});
