import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../app.js';

test('health route responds', async () => {
  const response = await request(app).get('/api/health').expect(200);
  assert.equal(response.body.status, 'ok');
});

test('quick scan returns fallback events without API keys', async () => {
  const response = await request(app)
    .post('/api/quick-scan')
    .send({ provider: 'fallback', limit: 3 })
    .expect(200);

  assert.equal(response.body.fromFallback, true);
  assert.ok(response.body.events.length > 0);
  assert.ok(response.body.events[0].personal_finance_impact.length > 0);
  assert.equal(typeof response.body.events[0].suggested_action, 'string');
});

test('debug route returns processing metadata', async () => {
  await request(app)
    .post('/api/quick-scan')
    .send({ provider: 'demo', limit: 2 })
    .expect(200);

  const response = await request(app).get('/api/debug').expect(200);
  assert.ok(response.body.lastScan);
  assert.ok(response.body.lastScan.processingTimeMs >= 0);
  assert.ok(Array.isArray(response.body.lastScan.events));
});
