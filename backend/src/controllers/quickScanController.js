import { env } from '../config/env.js';
import { runQuickScan } from '../services/scanService.js';
import { scanQuerySchema } from '../validators/schemas.js';

export async function quickScan(req, res, next) {
  try {
    const rawOptions = req.method === 'GET' ? req.query : req.body;
    const options = scanQuerySchema.parse(rawOptions);
    const result = await runQuickScan({
      ...options,
      limit: options.limit || env.maxArticles
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}
