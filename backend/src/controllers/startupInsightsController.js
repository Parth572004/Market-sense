import { env } from '../config/env.js';
import { runStartupInsights } from '../services/scanService.js';
import { scanQuerySchema } from '../validators/schemas.js';

export async function getStartupInsights(req, res, next) {
  try {
    const options = scanQuerySchema.parse(req.query);
    const result = await runStartupInsights({
      ...options,
      limit: options.limit || Math.min(env.maxArticles, 6)
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}
