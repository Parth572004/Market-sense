import axios from 'axios';
import { env } from '../config/env.js';
import { cache } from './cacheService.js';

const GOOGLE_TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single';
const SUPPORTED_LANGUAGES = new Set(['en', 'hi', 'bn', 'mr', 'te', 'ta', 'gu']);

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function extractTranslatedText(payload) {
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) return '';
  return payload[0]
    .map((part) => (Array.isArray(part) ? part[0] || '' : ''))
    .join('')
    .trim();
}

async function translateSingle(text, targetLanguage, sourceLanguage) {
  const normalizedText = normalizeText(text);
  if (!normalizedText || targetLanguage === 'en') return normalizedText;

  const cacheKey = `translation:${sourceLanguage}:${targetLanguage}:${normalizedText}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(GOOGLE_TRANSLATE_URL, {
      params: {
        client: 'gtx',
        sl: sourceLanguage,
        tl: targetLanguage,
        dt: 't',
        q: normalizedText
      },
      timeout: env.requestTimeoutMs
    });

    const translatedText = extractTranslatedText(response.data) || normalizedText;
    return cache.set(cacheKey, translatedText, env.cacheTtlMs);
  } catch {
    return cache.set(cacheKey, normalizedText, Math.min(env.cacheTtlMs, 60_000));
  }
}

export async function translateTexts(texts = [], options = {}) {
  const targetLanguage = SUPPORTED_LANGUAGES.has(options.targetLanguage) ? options.targetLanguage : 'hi';
  const sourceLanguage = options.sourceLanguage || 'auto';
  const uniqueTexts = [...new Set(texts.map(normalizeText).filter(Boolean))];

  if (!uniqueTexts.length) return {};
  if (targetLanguage === 'en') {
    return Object.fromEntries(uniqueTexts.map((text) => [text, text]));
  }

  const translations = {};

  for (let index = 0; index < uniqueTexts.length; index += 8) {
    const chunk = uniqueTexts.slice(index, index + 8);
    const chunkEntries = await Promise.all(chunk.map(async (text) => [text, await translateSingle(text, targetLanguage, sourceLanguage)]));
    Object.assign(translations, Object.fromEntries(chunkEntries));
  }

  return translations;
}
