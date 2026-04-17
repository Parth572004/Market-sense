import { env } from '../config/env.js';
import { fetchNormalizedEvents } from '../services/newsService.js';
import { scanQuerySchema } from '../validators/schemas.js';

export async function getNews(req, res, next) {
  try {
    const options = scanQuerySchema.parse(req.query);
    const result = await fetchNormalizedEvents({
      ...options,
      limit: options.limit || env.maxArticles
    });

    res.json({
      generatedAt: new Date().toISOString(),
      query: result.query,
      provider: result.provider,
      fromFallback: result.fromFallback,
      fallbackReason: result.fallbackReason,
      count: result.events.length,
      events: result.events
    });
  } catch (error) {
    next(error);
  }
}
