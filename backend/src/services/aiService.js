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

function parseJsonResponse(text) {
  if (!text) return null;
  const trimmed = text.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(trimmed);
}

export async function analyzeEvent(event, options = {}) {
  const explainMode = options.explainMode || 'normal';
  const modelKey = [env.geminiModel, env.geminiFallbackModel].filter(Boolean).join('|');
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

  const models = [...new Set([env.geminiModel, env.geminiFallbackModel].filter(Boolean))];
  let lastError = null;

  for (const model of models) {
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
