import axios from 'axios';
import { env } from '../config/env.js';
import { buildNewsQuery } from '../utils/classifier.js';
import { normalizeArticles } from '../utils/normalizeArticle.js';
import { addDebugLog } from './debugService.js';
import { loadDemoArticles, loadFallbackArticles } from './fallbackService.js';

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

export async function fetchArticles(options = {}) {
  const limit = options.limit || env.maxArticles;
  const query = buildNewsQuery(options);
  const provider = options.demoMode ? 'demo' : resolveProvider(options.provider);

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
    const articles = await loadFallbackArticles();
    return {
      articles: articles.slice(0, limit),
      provider: 'fallback',
      query,
      fromFallback: true,
      fallbackReason: 'No live news provider is configured.',
      demoMode: false
    };
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
    const articles = await loadFallbackArticles();
    return {
      articles: articles.slice(0, limit),
      provider: 'fallback',
      query,
      fromFallback: true,
      fallbackReason: error.response?.data?.message || error.message || 'Live news request failed.',
      demoMode: false
    };
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
