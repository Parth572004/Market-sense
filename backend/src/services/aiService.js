import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import { cache } from './cacheService.js';
import { buildFinancialImpact, buildRuleImpact, normalizeImpactShape } from './impactEngine.js';

let client = null;

function getClient() {
  if (env.nodeEnv === 'test') return null;
  if (!env.geminiApiKey) return null;
  if (!client) {
    client = new GoogleGenAI({ apiKey: env.geminiApiKey });
  }
  return client;
}

function getModels() {
  return [...new Set([env.geminiModel, env.geminiFallbackModel].filter(Boolean))];
}

function ensureString(value, fallback) {
  if (typeof value === 'string' && value.trim()) return value.trim();
  return fallback;
}

function normalizeConfidence(value = '') {
  const normalized = String(value || '').trim().toLowerCase();
  if (['low', 'medium', 'high'].includes(normalized)) return normalized;
  return 'medium';
}

function buildPrompt(event, explainMode = 'normal') {
  const baseImpact = buildRuleImpact(event);
  const simpleInstruction = explainMode === 'simple'
    ? 'Use Explain Like I am 15 language: short sentences, no jargon, and concrete money examples.'
    : 'Use clear non-expert language with practical financial context.';

  return [
    'You are a financial news explanation engine for students and non-experts.',
    'Never provide stock tips, exact price predictions, or investment advice.',
    'Your job is to explain how the news can affect people\'s money.',
    'Rule-based financial impact is already available. Improve the wording if useful, but preserve the same meaning and never remove personal finance impact.',
    'Return valid JSON only with these exact keys: what_happened, why_it_matters, market_impact, personal_finance_impact, suggested_action, possible_outcomes.',
    simpleInstruction,
    '',
    `Event title: ${event.title}`,
    `Event summary: ${event.summary}`,
    `Category: ${event.category}`,
    `Sub-category: ${event.sub_category}`,
    `Region: ${event.region}`,
    `Published at: ${event.published_at}`,
    `Rule impact JSON: ${JSON.stringify(baseImpact)}`
  ].join('\n');
}

function buildPredictionPrompt(event) {
  return [
    'You are a startup news prediction assistant.',
    'Return high-level scenario guidance only. Never provide stock tips, valuation targets, or exact price predictions.',
    'Respond with valid JSON only using these exact keys: short_term, long_term, confidence.',
    'confidence must be one of: low, medium, high.',
    '',
    `Event title: ${event.title}`,
    `Event summary: ${event.summary}`,
    `Category: ${event.category}`,
    `Region: ${event.region}`,
    `Why it matters: ${event.why_it_matters}`,
    `Market impact: ${JSON.stringify(event.market_impact || [])}`,
    `Personal finance impact: ${JSON.stringify(event.personal_finance_impact || [])}`
  ].join('\n');
}

function parseJsonResponse(text) {
  if (!text) return null;
  const trimmed = text.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(trimmed);
}

export function buildRulePrediction(event = {}) {
  const text = `${event.title || ''} ${event.summary || ''}`.toLowerCase();

  if (text.includes('ipo') || text.includes('listing') || text.includes('public offering')) {
    return {
      short_term: 'Investors may reassess startup valuations and public-market appetite as peers compare the path to listing.',
      long_term: 'A successful listing window can improve exit options, while a weak one can push startups to stay private longer and focus on profitability.',
      confidence: 'medium'
    };
  }

  if (text.includes('acquisition') || text.includes('acquire') || text.includes('buyout') || text.includes('merger')) {
    return {
      short_term: 'The deal can lift sentiment around startup exits and shift competition in the affected sector.',
      long_term: 'If consolidation continues, founders may optimize for strategic fit and stronger unit economics rather than growth at any cost.',
      confidence: 'medium'
    };
  }

  if (text.includes('unicorn')) {
    return {
      short_term: 'The headline can improve confidence around late-stage funding and sector visibility.',
      long_term: 'Sustained momentum still depends on revenue quality, profitability discipline, and follow-on capital staying available.',
      confidence: 'low'
    };
  }

  if (
    text.includes('funding')
    || text.includes('venture capital')
    || text.includes('seed round')
    || text.includes('series a')
    || text.includes('series b')
    || text.includes('series c')
  ) {
    return {
      short_term: 'Fresh funding can boost hiring, product investment, and investor appetite for comparable startups in the near term.',
      long_term: 'If capital stays selective, stronger startups may scale while weaker ones face sharper pressure to prove margins and repeat demand.',
      confidence: 'medium'
    };
  }

  return {
    short_term: 'Startup sentiment may improve briefly if the story signals stronger capital access or strategic demand.',
    long_term: 'Longer-term impact depends on whether startups convert attention into durable revenue, efficient growth, and clearer exit paths.',
    confidence: 'low'
  };
}

function normalizePredictionShape(value = {}, fallback = buildRulePrediction()) {
  return {
    short_term: ensureString(value.short_term ?? value.shortTerm, fallback.short_term),
    long_term: ensureString(value.long_term ?? value.longTerm, fallback.long_term),
    confidence: normalizeConfidence(value.confidence ?? fallback.confidence)
  };
}

export async function analyzeEvent(event, options = {}) {
  const explainMode = options.explainMode || 'normal';
  const modelKey = getModels().join('|');
  const cacheKey = `analysis:${event.id}:${modelKey}:${explainMode}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const ruleImpact = buildRuleImpact(event);
  const ai = getClient();
  if (!ai) {
    return cache.set(cacheKey, {
      ...ruleImpact,
      ai_provider: 'rule_engine',
      ai_status: 'not_configured'
    }, env.cacheTtlMs);
  }

  let lastError = null;

  for (const model of getModels()) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: buildPrompt(event, explainMode),
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              what_happened: { type: 'string' },
              why_it_matters: { type: 'string' },
              market_impact: { type: 'array', items: { type: 'string' } },
              personal_finance_impact: { type: 'array', items: { type: 'string' } },
              suggested_action: { type: 'string' },
              possible_outcomes: { type: 'array', items: { type: 'string' } }
            },
            required: [
              'what_happened',
              'why_it_matters',
              'market_impact',
              'personal_finance_impact',
              'suggested_action',
              'possible_outcomes'
            ]
          }
        }
      });

      const parsed = parseJsonResponse(response.text);
      return cache.set(cacheKey, {
        ...buildFinancialImpact(event, normalizeImpactShape(parsed, ruleImpact)),
        ai_provider: 'gemini',
        ai_model: model,
        ai_status: 'ok',
        explain_mode: explainMode
      }, env.cacheTtlMs);
    } catch (error) {
      lastError = error;
    }
  }

  return cache.set(cacheKey, {
    ...ruleImpact,
    ai_provider: 'rule_engine',
    ai_status: 'error',
    ai_error: lastError?.message,
    explain_mode: explainMode
  }, env.cacheTtlMs);
}

export async function analyzeEvents(events, options = {}) {
  return Promise.all(events.map(async (event) => ({
    ...event,
    ...(await analyzeEvent(event, options))
  })));
}

export async function predictEvent(event) {
  const modelKey = getModels().join('|');
  const cacheKey = `prediction:${event.id}:${modelKey}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const fallbackPrediction = buildRulePrediction(event);
  const ai = getClient();
  if (!ai) {
    return cache.set(cacheKey, fallbackPrediction, env.cacheTtlMs);
  }

  let lastError = null;

  for (const model of getModels()) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: buildPredictionPrompt(event),
        config: {
          temperature: 0.25,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              short_term: { type: 'string' },
              long_term: { type: 'string' },
              confidence: { type: 'string' }
            },
            required: ['short_term', 'long_term', 'confidence']
          }
        }
      });

      const parsed = parseJsonResponse(response.text);
      return cache.set(cacheKey, normalizePredictionShape(parsed, fallbackPrediction), env.cacheTtlMs);
    } catch (error) {
      lastError = error;
    }
  }

  return cache.set(cacheKey, {
    ...fallbackPrediction,
    confidence: lastError ? fallbackPrediction.confidence : 'medium'
  }, env.cacheTtlMs);
}

export async function predictEvents(events = []) {
  return Promise.all(events.map(async (event) => ({
    ...event,
    prediction: await predictEvent(event)
  })));
}
