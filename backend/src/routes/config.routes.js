import { Router } from 'express';
import { env } from '../config/env.js';
import { getCategoryOptions } from '../utils/classifier.js';
import { listRegions } from '../utils/coordinateMapper.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    categories: [{ id: 'all', label: 'All Signals' }, ...getCategoryOptions()],
    regions: listRegions(),
    defaults: {
      scope: 'Global Macro',
      region: 'Global',
      category: 'all',
      mapCenter: [20, 0],
      mapZoom: 2
    },
    integrations: {
      newsProvider: env.newsProvider,
      hasNewsApiKey: Boolean(env.newsApiKey),
      hasGnewsApiKey: Boolean(env.gnewsApiKey),
      hasGeminiApiKey: Boolean(env.geminiApiKey),
      geminiModel: env.geminiModel
    }
  });
});

export default router;
