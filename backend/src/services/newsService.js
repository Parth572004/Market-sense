import axios from 'axios';
import { env } from '../config/env.js';
import { buildNewsQuery } from '../utils/classifier.js';
import { normalizeArticles } from '../utils/normalizeArticle.js';
import { addDebugLog } from './debugService.js';
import { loadDemoArticles, loadFallbackArticles, loadStartupFallbackArticles } from './fallbackService.js';

const STARTUP_QUERY = '(startup OR funding OR "venture capital" OR IPO OR unicorn OR acquisition)';
const STARTUP_KEYWORDS = [
  'startup',
  'funding',
  'venture capital',
  'vc',
  'ipo',
  'unicorn',
  'acquisition',
  'acquire',
  'buyout',
  'merger',
  'seed round',
  'series a',
  'series b',
  'series c',
  'founder'
];
const INDIA_HINTS = ['india', 'indian', 'bengaluru', 'bangalore', 'mumbai', 'delhi', 'hyderabad', 'pune', 'chennai'];

function resolveProvider(requestedProvider = 'auto') {
  const provider = requestedProvider === 'auto' ? env.newsProvider : requestedProvider;

  if (provider === 'newsapi' && env.newsApiKey) return 'newsapi';
  if (provider === 'gnews' && env.gnewsApiKey) return 'gnews';
  if (provider === 'fallback') return 'fallback';
  if (provider === 'demo') return 'demo';

  if (env.newsProvider === 'newsapi' && env.newsApiKey) return 'newsapi';
  if (env.newsProvider === 'gnews' && env.gnewsApiKey) return 'gnews';
  if (env.newsApiKey) return 'newsapi';
  if (env.gnewsApiKey) return 'gnews';

  return 'fallback';
}

async function fetchFromNewsApi({ query, limit }) {
  const response = await axios.get(`${env.newsApiBaseUrl}/everything`, {
    timeout: env.requestTimeoutMs,
    params: {
      q: query,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: limit,
      apiKey: env.newsApiKey
    }
  });

  return response.data?.articles || [];
}

async function fetchFromGNews({ query, limit }) {
  const response = await axios.get(`${env.gnewsBaseUrl}/search`, {
    timeout: env.requestTimeoutMs,
    params: {
      q: query,
      lang: 'en',
      max: limit,
      apikey: env.gnewsApiKey
    }
  });

  return response.data?.articles || [];
}

async function loadFallbackDataset(dataset = 'default') {
  if (dataset === 'startup') {
    return loadStartupFallbackArticles();
  }

  return loadFallbackArticles();
}

function buildQuery(options = {}) {
  return options.query || buildNewsQuery(options);
}

function startupText(event = {}) {
  return `${event.title || ''} ${event.summary || ''} ${(event.matched_keywords || []).join(' ')}`.toLowerCase();
}

function countKeywordMatches(text, keywords) {
  return keywords.reduce((score, keyword) => (text.includes(keyword) ? score + 1 : score), 0);
}

function isStartupEvent(event = {}) {
  const text = startupText(event);
  return countKeywordMatches(text, STARTUP_KEYWORDS) > 0;
}

function prioritizeStartupEvents(events = []) {
  return [...events]
    .map((event) => {
      const text = startupText(event);
      const keywordScore = countKeywordMatches(text, STARTUP_KEYWORDS);
      const indiaBoost = event.region === 'India'
        ? 2
        : countKeywordMatches(text, INDIA_HINTS) > 0 || event.region === 'Global'
          ? 1
          : 0;
      const publishedAt = Date.parse(event.published_at || '') || 0;

      return {
        event,
        score: keywordScore + indiaBoost,
        publishedAt
      };
    })
    .sort((left, right) => right.score - left.score || right.publishedAt - left.publishedAt)
    .map(({ event }) => event);
}

async function fallbackResult({ query, limit, reason, dataset }) {
  const articles = await loadFallbackDataset(dataset);
  return {
    articles: articles.slice(0, limit),
    provider: 'fallback',
    query,
    fromFallback: true,
    fallbackReason: reason,
    demoMode: false
  };
}

export async function fetchArticles(options = {}) {
  const limit = options.limit || env.maxArticles;
  const query = buildQuery(options);
  const provider = options.demoMode ? 'demo' : resolveProvider(options.provider);
  const fallbackDataset = options.fallbackDataset || 'default';

  if (provider === 'demo') {
    const articles = await loadDemoArticles();
    return {
      articles: articles.slice(0, limit),
      provider: 'demo',
      query,
      fromFallback: false,
      fallbackReason: null,
      demoMode: true
    };
  }

  if (provider === 'fallback') {
    addDebugLog({
      type: 'fallback',
      message: 'Using fallback news dataset because no live provider is configured.',
      source: 'fallback'
    });
    return fallbackResult({
      query,
      limit,
      reason: 'No live news provider is configured.',
      dataset: fallbackDataset
    });
  }

  try {
    const articles = provider === 'newsapi'
      ? await fetchFromNewsApi({ query, limit })
      : await fetchFromGNews({ query, limit });

    return {
      articles,
      provider,
      query,
      fromFallback: false,
      fallbackReason: null,
      demoMode: false
    };
  } catch (error) {
    addDebugLog({
      type: 'fallback',
      message: 'Live news request failed; fallback dataset loaded.',
      source: provider,
      error: error.response?.data?.message || error.message || 'Live news request failed.'
    });
    return fallbackResult({
      query,
      limit,
      reason: error.response?.data?.message || error.message || 'Live news request failed.',
      dataset: fallbackDataset
    });
  }
}

export async function fetchNormalizedEvents(options = {}) {
  const result = await fetchArticles(options);
  let events = normalizeArticles(result.articles, result.provider)
    .filter((event) => event.relevant)
    .filter((event) => !options.region || options.region === 'Global' || event.region === options.region)
    .filter((event) => !options.category || options.category === 'all' || event.category === options.category)
    .slice(0, options.limit || env.maxArticles);

  if (!events.length && !result.fromFallback && result.provider !== 'demo') {
    addDebugLog({
      type: 'fallback',
      message: 'Live provider returned no relevant market events; fallback dataset loaded.',
      source: result.provider
    });
    const fallbackArticles = await loadFallbackArticles();
    events = normalizeArticles(fallbackArticles, 'fallback')
      .filter((event) => event.relevant)
      .filter((event) => !options.region || options.region === 'Global' || event.region === options.region)
      .filter((event) => !options.category || options.category === 'all' || event.category === options.category)
      .slice(0, options.limit || env.maxArticles);

    return {
      ...result,
      provider: 'fallback',
      fromFallback: true,
      fallbackReason: 'Live provider returned no relevant market events.',
      events
    };
  }

  return {
    ...result,
    events
  };
}

export async function fetchStartupEvents(options = {}) {
  const limit = Math.min(options.limit || 6, 25);
  const liveFetchLimit = Math.min(Math.max(limit * 3, limit), 25);
  const result = await fetchArticles({
    ...options,
    limit: liveFetchLimit,
    query: STARTUP_QUERY,
    fallbackDataset: 'startup'
  });

  let events = prioritizeStartupEvents(
    normalizeArticles(result.articles, result.provider)
      .filter((event) => event.relevant)
      .filter((event) => isStartupEvent(event))
      .filter((event) => !options.region || options.region === 'Global' || event.region === options.region)
  ).slice(0, limit);

  if (!events.length && !result.fromFallback) {
    addDebugLog({
      type: 'fallback',
      message: 'Live provider returned no relevant startup events; startup fallback dataset loaded.',
      source: result.provider
    });
    const fallbackArticles = await loadStartupFallbackArticles();
    events = prioritizeStartupEvents(
      normalizeArticles(fallbackArticles, 'fallback')
        .filter((event) => event.relevant)
        .filter((event) => isStartupEvent(event))
        .filter((event) => !options.region || options.region === 'Global' || event.region === options.region)
    ).slice(0, limit);

    return {
      ...result,
      provider: 'fallback',
      query: STARTUP_QUERY,
      fromFallback: true,
      fallbackReason: 'Live provider returned no relevant startup events.',
      events
    };
  }

  return {
    ...result,
    query: STARTUP_QUERY,
    events
  };
}
