import { analyzeEvent, analyzeEvents } from '../services/aiService.js';
import { analyzeBodySchema } from '../validators/schemas.js';

export async function analyze(req, res, next) {
  try {
    const body = analyzeBodySchema.parse(req.body);
    if (body.event) {
      const insight = await analyzeEvent(body.event, { explainMode: body.explainMode || 'normal' });
      res.json({ event: { ...body.event, ...insight } });
      return;
    }

    const events = await analyzeEvents(body.events, { explainMode: body.explainMode || 'normal' });
    res.json({ events });
  } catch (error) {
    next(error);
  }
}
