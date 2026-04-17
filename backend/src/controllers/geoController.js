import { getGeoInsights } from '../services/scanService.js';
import { scanQuerySchema } from '../validators/schemas.js';

export async function getGeoInsightsController(req, res, next) {
  try {
    const options = scanQuerySchema.parse(req.query);
    const result = await getGeoInsights(options);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
