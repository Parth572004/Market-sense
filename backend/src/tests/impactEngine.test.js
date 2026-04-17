import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFinancialImpact, buildRuleImpact, normalizeImpactShape } from '../services/impactEngine.js';

test('maps oil events to fuel-cost personal impact', () => {
  const impact = buildRuleImpact({
    title: 'Oil jumps after supply disruption',
    category: 'energy',
    region: 'Middle East',
    summary: 'Crude markets moved higher after supply concerns.'
  });

  assert.match(impact.personal_finance_impact.join(' '), /fuel|transport|travel/i);
  assert.equal(typeof impact.suggested_action, 'string');
});

test('maps rate events to EMI impact', () => {
  const impact = buildRuleImpact({
    title: 'RBI keeps repo rate unchanged',
    category: 'inflation',
    region: 'India'
  });

  assert.match(impact.personal_finance_impact.join(' '), /EMI|loan|borrowing/i);
});

test('normalizes Gemini-style mixed output into strict contract', () => {
  const fallback = buildRuleImpact({ category: 'global_markets' });
  const normalized = normalizeImpactShape({
    whatHappened: 'A market shock occurred.',
    marketImpact: ['Stocks moved.'],
    suggestedAction: ['Do not panic.']
  }, fallback);

  const merged = buildFinancialImpact({ category: 'global_markets' }, normalized);
  assert.equal(merged.what_happened, 'A market shock occurred.');
  assert.deepEqual(merged.market_impact, ['Stocks moved.']);
  assert.equal(merged.suggested_action, 'Do not panic.');
  assert.ok(merged.personal_finance_impact.length > 0);
});
