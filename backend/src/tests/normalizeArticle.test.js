import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeArticle } from '../utils/normalizeArticle.js';

test('normalizes valid article into event shape', () => {
  const event = normalizeArticle({
    title: 'Oil prices rise after OPEC signal',
    description: 'Crude markets reacted to supply comments.',
    url: 'https://example.com/oil',
    publishedAt: '2026-04-17T00:00:00.000Z',
    source: { name: 'Example' }
  }, 'fallback');

  assert.ok(event.id.startsWith('evt_'));
  assert.equal(event.relevant, true);
  assert.equal(event.category, 'energy');
  assert.ok(event.personal_finance_impact.length > 0);
  assert.equal(typeof event.suggested_action, 'string');
  assert.ok(event.possible_outcomes.length > 0);
});

test('returns null for invalid article', () => {
  const event = normalizeArticle({ description: 'No title' }, 'fallback');
  assert.equal(event, null);
});

test('strips raw html from article text before creating event copy', () => {
  const event = normalizeArticle({
    title: 'Laptop deal headline',
    description: 'Buy now <ul><li>padded sleeve fits laptops up to 15"</li></...',
    url: 'https://example.com/deal',
    source: { name: 'Example' }
  }, 'fallback');

  assert.equal(event.summary.includes('<ul>'), false);
  assert.equal(event.what_happened.includes('<li>'), false);
  assert.equal(event.summary.includes('</...'), false);
  assert.match(event.summary, /padded sleeve fits laptops up to 15"/i);
});

test('falls back to cleaned summary when title becomes empty after sanitizing', () => {
  const event = normalizeArticle({
    title: '<div><span></span></div>',
    description: 'European markets reacted to slower inflation prints.',
    url: 'https://example.com/europe-inflation',
    source: { name: 'Example' }
  }, 'fallback');

  assert.equal(event.title, 'European markets reacted to slower inflation prints.');
  assert.equal(event.summary, 'European markets reacted to slower inflation prints.');
});
