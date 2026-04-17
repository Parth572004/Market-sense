import dotenv from 'dotenv';

dotenv.config();

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toInt(process.env.PORT, 8080),
  frontendOrigin: process.env.FRONTEND_ORIGIN || process.env.FRONTEND_BASE_URL || 'http://localhost:5173',
  backendBaseUrl: process.env.BACKEND_BASE_URL || 'http://localhost:8080',
  newsProvider: (process.env.NEWS_PROVIDER || 'auto').toLowerCase(),
  newsApiKey: process.env.NEWS_API_KEY || '',
  newsApiBaseUrl: process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2',
  gnewsApiKey: process.env.GNEWS_API_KEY || '',
  gnewsBaseUrl: process.env.GNEWS_BASE_URL || 'https://gnews.io/api/v4',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  geminiFallbackModel: process.env.GEMINI_FALLBACK_MODEL || 'gemini-2.0-flash',
  cacheTtlMs: toInt(process.env.CACHE_TTL_MS, 1000 * 60 * 10),
  requestTimeoutMs: toInt(process.env.REQUEST_TIMEOUT_MS, 1000 * 12),
  maxArticles: toInt(process.env.MAX_ARTICLES, 10)
};
