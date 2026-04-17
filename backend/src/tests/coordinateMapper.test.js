import test from 'node:test';
import assert from 'node:assert/strict';
import { detectRegion, getRegionByName, listRegions } from '../utils/coordinateMapper.js';

test('detects India from RBI-related content', () => {
  const region = detectRegion({
    title: 'RBI keeps repo rate unchanged',
    description: 'Indian inflation remains sticky.'
  });

  assert.equal(region.name, 'India');
});

test('falls back to Global for unknown region', () => {
  const region = detectRegion({
    title: 'Market analysts await fresh data',
    description: 'Investors are cautious.'
  });

  assert.equal(region.name, 'Global');
});

test('lists configured map regions', () => {
  assert.ok(listRegions().length >= 5);
  assert.equal(getRegionByName('Europe').name, 'Europe');
});
