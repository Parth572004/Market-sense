import crypto from 'node:crypto';
import { articleSchema } from '../validators/schemas.js';
import { buildRuleImpact } from '../services/impactEngine.js';
import { classifyArticle } from './classifier.js';
import { detectRegion } from './coordinateMapper.js';

function cleanText(value = '') {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/\[\+\d+ chars\]$/i, '')
    .trim();
}

function createEventId(article) {
  const key = `${article.title}|${article.publishedAt || ''}|${article.url || ''}`;
  return `evt_${crypto.createHash('sha1').update(key).digest('hex').slice(0, 12)}`;
}

export function normalizeArticle(rawArticle, provider = 'fallback') {
  const parsed = articleSchema.safeParse(rawArticle);
  if (!parsed.success) {
    return null;
  }

  const article = parsed.data;
  const summary = cleanText(article.description || article.content || article.title);
  const classification = classifyArticle(article);
  const region = detectRegion(article);
  const publishedAt = article.publishedAt || new Date().toISOString();
  const sourceName = article.source?.name || provider;
  const imageUrl = article.image || article.urlToImage || null;

  const event = {
    id: createEventId(article),
    title: cleanText(article.title),
    category: classification.category,
    category_label: classification.category_label,
    sub_category: classification.sub_category,
    region: region.name,
    lat: region.lat,
    lng: region.lng,
    zoom: region.zoom,
    priority: classification.priority,
    classification_score: classification.score,
    matched_keywords: classification.matchedKeywords,
    relevant: classification.relevant,
    summary,
    source: sourceName,
    source_provider: provider,
    source_url: article.url || article.source?.url || '',
    image_url: imageUrl,
    published_at: publishedAt,
    debug: {
      classification: {
        category: classification.category,
        category_label: classification.category_label,
        sub_category: classification.sub_category,
        score: classification.score,
        matched_keywords: classification.matchedKeywords,
        priority: classification.priority,
        relevant: classification.relevant
      },
      location: {
        region: region.name,
        lat: region.lat,
        lng: region.lng,
        zoom: region.zoom
      }
    }
  };

  return {
    ...event,
    ...buildRuleImpact(event)
  };
}

export function normalizeArticles(articles, provider = 'fallback') {
  return articles
    .map((article) => normalizeArticle(article, provider))
    .filter(Boolean);
}
