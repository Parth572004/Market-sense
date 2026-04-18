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

test('quick scan forceRefresh bypasses cached response', async () => {
  const initialResponse = await request(app)
    .post('/api/quick-scan')
    .send({ provider: 'fallback', limit: 2 })
    .expect(200);

  const cachedResponse = await request(app)
    .post('/api/quick-scan')
    .send({ provider: 'fallback', limit: 2 })
    .expect(200);

  const refreshedResponse = await request(app)
    .post('/api/quick-scan')
    .send({ provider: 'fallback', limit: 2, forceRefresh: true })
    .expect(200);

  assert.equal(cachedResponse.body.cache, 'hit');
  assert.equal(refreshedResponse.body.cache, 'miss');
  assert.notEqual(refreshedResponse.body.events[0].id, initialResponse.body.events[0].id);
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

test('startup insights returns prediction data', async () => {
  const response = await request(app)
    .get('/api/startup-insights')
    .query({ provider: 'fallback', limit: 3 })
    .expect(200);

  assert.equal(response.body.fromFallback, true);
  assert.ok(response.body.events.length > 0);
  assert.equal(typeof response.body.events[0].prediction.short_term, 'string');
  assert.equal(typeof response.body.events[0].prediction.long_term, 'string');
  assert.ok(['low', 'medium', 'high'].includes(response.body.events[0].prediction.confidence));
});

test('startup insights can filter for India', async () => {
  const response = await request(app)
    .get('/api/startup-insights')
    .query({ provider: 'fallback', limit: 6, region: 'India' })
    .expect(200);

  assert.ok(response.body.events.length > 0);
  assert.ok(response.body.events.every((event) => event.region === 'India'));
});
