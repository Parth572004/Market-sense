import test from 'node:test';
import assert from 'node:assert/strict';
import { buildNewsQuery, classifyArticle } from '../utils/classifier.js';

test('classifies RBI policy news as inflation and rates', () => {
  const result = classifyArticle({
    title: 'RBI keeps repo rate unchanged',
    description: 'The Reserve Bank of India cited inflation pressure.'
  });

  assert.equal(result.relevant, true);
  assert.equal(result.category, 'inflation');
  assert.equal(result.sub_category, 'interest_rate');
  assert.equal(result.priority, 'high');
});

test('classifies Red Sea oil disruption as energy or conflict relevant', () => {
  const result = classifyArticle({
    title: 'Oil rises after Red Sea shipping disruption',
    description: 'Crude traders assess conflict risk.'
  });

  assert.equal(result.relevant, true);
  assert.ok(['energy', 'geopolitics'].includes(result.category));
  assert.ok(['high', 'medium'].includes(result.priority));
});

test('filters irrelevant entertainment news', () => {
  const result = classifyArticle({
    title: 'Celebrity movie premiere dominates fashion coverage',
    description: 'A red carpet event drew attention.'
  });

  assert.equal(result.relevant, false);
});

test('classifies startup funding news as relevant market coverage', () => {
  const result = classifyArticle({
    title: 'AI startup secures Series B funding from venture capital firms',
    description: 'Investors said the funding reflects stronger enterprise demand.'
  });

  assert.equal(result.relevant, true);
  assert.equal(result.category, 'global_markets');
});

test('builds a scoped query with focus and region', () => {
  const query = buildNewsQuery({
    scope: 'Indian Markets',
    focus: 'fuel prices',
    region: 'India'
  });

  assert.match(query, /RBI/);
  assert.match(query, /fuel prices/);
  assert.match(query, /India/);
});
