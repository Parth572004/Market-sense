import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 20000
});

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

async function translateViaBrowser(texts = [], targetLanguage = 'hi', sourceLanguage = 'auto') {
  const uniqueTexts = [...new Set(texts.map(normalizeText).filter(Boolean))];

  if (!uniqueTexts.length) {
    return {
      targetLanguage,
      sourceLanguage,
      translations: {}
    };
  }

  if (targetLanguage === 'en') {
    return {
      targetLanguage,
      sourceLanguage,
      translations: Object.fromEntries(uniqueTexts.map((text) => [text, text]))
    };
  }

  const translatedEntries = await Promise.all(uniqueTexts.map(async (text) => {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sourceLanguage)}&tl=${encodeURIComponent(targetLanguage)}&dt=t&q=${encodeURIComponent(text)}`
    );

    if (!response.ok) {
      throw new Error(`Browser translation fallback failed with ${response.status}`);
    }

    const payload = await response.json();
    return [text, extractTranslatedText(payload) || text];
  }));

  return {
    targetLanguage,
    sourceLanguage,
    translations: Object.fromEntries(translatedEntries)
  };
}

export async function fetchConfig() {
  const response = await api.get('/config');
  return response.data;
}

export async function quickScan(payload = {}) {
  const response = await api.post('/quick-scan', payload);
  return response.data;
}

export async function fetchNews(params = {}) {
  const response = await api.get('/news', { params });
  return response.data;
}

export async function fetchGeoInsights(params = {}) {
  const response = await api.get('/geo-insights', { params });
  return response.data;
}

export async function fetchDebug() {
  const response = await api.get('/debug');
  return response.data;
}

export async function fetchStartupInsights(params = {}) {
  const response = await api.get('/startup-insights', { params });
  return response.data;
}

export async function translateBatch(payload = {}) {
  try {
    const response = await api.post('/translate', payload);
    if (response.data?.translations && Object.keys(response.data.translations).length) {
      return response.data;
    }
  } catch {
    // Fall through to the browser-side translator so UI content can still localize.
  }

  return translateViaBrowser(payload.texts || [], payload.targetLanguage || 'hi', payload.sourceLanguage || 'auto');
}

export default api;
