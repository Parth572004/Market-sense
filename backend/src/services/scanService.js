import { env } from '../config/env.js';
import { listRegions } from '../utils/coordinateMapper.js';
import { cache } from './cacheService.js';
import { analyzeEvents, predictEvents } from './aiService.js';
import { setLastScanDebug } from './debugService.js';
import { fetchNormalizedEvents, fetchStartupEvents } from './newsService.js';

function cacheKeyFor(options) {
  return `scan:${JSON.stringify({
    scope: options.scope || 'Global Macro',
    focus: options.focus || '',
    region: options.region || 'Global',
    category: options.category || 'all',
    provider: options.provider || 'auto',
    demoMode: Boolean(options.demoMode),
    explainMode: options.explainMode || 'normal',
    limit: options.limit || env.maxArticles
  })}`;
}

function startupCacheKey(options) {
  return `startup:${JSON.stringify({
    provider: options.provider || 'auto',
    region: options.region || 'Global',
    limit: options.limit || Math.min(env.maxArticles, 6)
  })}`;
}

function selectRefreshedEvents(events = [], limit = env.maxArticles, previousEvents = []) {
  const previousIds = new Set((previousEvents || []).map((event) => event?.id).filter(Boolean));
  if (!previousIds.size) {
    return events.slice(0, limit);
  }

  const fresh = events.filter((event) => !previousIds.has(event.id));
  const repeated = events.filter((event) => previousIds.has(event.id));
  return [...fresh, ...repeated].slice(0, limit);
}

export async function runQuickScan(options = {}) {
  const startedAt = performance.now();
  const cacheKey = cacheKeyFor(options);
  const cached = options.forceRefresh ? null : cache.get(cacheKey);
  if (cached) {
    return {
      ...cached,
      cache: 'hit'
    };
  }

  const requestedLimit = options.limit || env.maxArticles;
  const newsResult = await fetchNormalizedEvents({
    ...options,
    limit: options.forceRefresh ? Math.min(requestedLimit * 3, 25) : requestedLimit
  });
  const analyzedPool = await analyzeEvents(newsResult.events, {
    explainMode: options.explainMode || 'normal'
  });
  const previousEvents = options.forceRefresh ? (cache.get('lastScan')?.events || []) : [];
  const analyzedEvents = options.forceRefresh
    ? selectRefreshedEvents(analyzedPool, requestedLimit, previousEvents)
    : analyzedPool.slice(0, requestedLimit);
  const processingTimeMs = Math.round(performance.now() - startedAt);
  const payload = {
    generatedAt: new Date().toISOString(),
    query: newsResult.query,
    provider: newsResult.provider,
    fromFallback: newsResult.fromFallback,
    fallbackReason: newsResult.fallbackReason,
    demoMode: Boolean(newsResult.demoMode || options.demoMode),
    processingTimeMs,
    count: analyzedEvents.length,
    events: analyzedEvents,
    cache: 'miss'
  };

  cache.set(cacheKey, payload, env.cacheTtlMs);
  cache.set('lastScan', payload, env.cacheTtlMs);
  setLastScanDebug({
    provider: payload.provider,
    fromFallback: payload.fromFallback,
    fallbackReason: payload.fallbackReason,
    demoMode: payload.demoMode,
    query: payload.query,
    processingTimeMs,
    events: analyzedEvents.map((event) => ({
      id: event.id,
      title: event.title,
      category: event.category,
      category_label: event.category_label,
      priority: event.priority,
      region: event.region,
      classification_score: event.classification_score,
      matched_keywords: event.matched_keywords,
      ai_provider: event.ai_provider,
      ai_status: event.ai_status
    }))
  });
  return payload;
}

export async function runStartupInsights(options = {}) {
  const startedAt = performance.now();
  const cacheKey = startupCacheKey(options);
  const cached = options.forceRefresh ? null : cache.get(cacheKey);
  if (cached) {
    return {
      ...cached,
      cache: 'hit'
    };
  }

  const requestedLimit = options.limit || Math.min(env.maxArticles, 6);
  const newsResult = await fetchStartupEvents({
    provider: options.provider || 'auto',
    region: options.region || 'Global',
    limit: options.forceRefresh ? Math.min(Math.max(requestedLimit * 3, requestedLimit), 25) : requestedLimit
  });
  const analyzedPool = await analyzeEvents(newsResult.events, { explainMode: 'normal' });
  const previousEvents = options.forceRefresh ? (cache.get('lastStartupInsights')?.events || []) : [];
  const analyzedEvents = options.forceRefresh
    ? selectRefreshedEvents(analyzedPool, requestedLimit, previousEvents)
    : analyzedPool.slice(0, requestedLimit);
  const eventsWithPredictions = await predictEvents(analyzedEvents);
  const processingTimeMs = Math.round(performance.now() - startedAt);
  const payload = {
    generatedAt: new Date().toISOString(),
    query: newsResult.query,
    provider: newsResult.provider,
    fromFallback: newsResult.fromFallback,
    fallbackReason: newsResult.fallbackReason,
    processingTimeMs,
    count: eventsWithPredictions.length,
    events: eventsWithPredictions,
    cache: 'miss'
  };

  cache.set(cacheKey, payload, env.cacheTtlMs);
  cache.set('lastStartupInsights', payload, env.cacheTtlMs);
  setLastScanDebug({
    provider: payload.provider,
    fromFallback: payload.fromFallback,
    fallbackReason: payload.fallbackReason,
    demoMode: false,
    query: payload.query,
    processingTimeMs,
    message: 'Startup insights completed',
    events: eventsWithPredictions.map((event) => ({
      id: event.id,
      title: event.title,
      category: event.category,
      category_label: event.category_label,
      priority: event.priority,
      region: event.region,
      classification_score: event.classification_score,
      matched_keywords: event.matched_keywords,
      ai_provider: event.ai_provider,
      ai_status: event.ai_status
    }))
  });
  return payload;
}

export async function getGeoInsights(options = {}) {
  const lastScan = cache.get('lastScan') || await runQuickScan({
    scope: options.scope || 'Global Macro',
    region: options.region || 'Global',
    limit: options.limit || env.maxArticles
  });

  const events = lastScan.events || [];
  const regions = listRegions().map((region) => {
    const regionEvents = events.filter((event) => event.region === region.name);
    return {
      ...region,
      eventCount: regionEvents.length,
      highPriorityCount: regionEvents.filter((event) => event.priority === 'high').length,
      categories: [...new Set(regionEvents.map((event) => event.category))]
    };
  });

  const selectedRegion = options.region && options.region !== 'Global'
    ? regions.find((region) => region.name === options.region)
    : null;

  return {
    generatedAt: new Date().toISOString(),
    sourceScanGeneratedAt: lastScan.generatedAt,
    regions,
    selectedRegion,
    events: selectedRegion ? events.filter((event) => event.region === selectedRegion.name) : events
  };
}
