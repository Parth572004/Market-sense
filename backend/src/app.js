import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import analyzeRoutes from './routes/analyze.routes.js';
import configRoutes from './routes/config.routes.js';
import debugRoutes from './routes/debug.routes.js';
import geoInsightsRoutes from './routes/geoInsights.routes.js';
import healthRoutes from './routes/health.routes.js';
import newsRoutes from './routes/news.routes.js';
import quickScanRoutes from './routes/quickScan.routes.js';
import startupInsightsRoutes from './routes/startupInsights.routes.js';
import translationRoutes from './routes/translation.routes.js';

export const app = express();

app.use(cors({
  origin: env.nodeEnv === 'production' ? env.frontendOrigin : true,
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

app.use('/api/health', healthRoutes);
app.use('/api/config', configRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/geo-insights', geoInsightsRoutes);
app.use('/api/quick-scan', quickScanRoutes);
app.use('/api/startup-insights', startupInsightsRoutes);
app.use('/api/translate', translationRoutes);

// Route aliases match the requested endpoint names while keeping /api as the
// frontend-facing namespace.
app.use('/health', healthRoutes);
app.use('/config', configRoutes);
app.use('/debug', debugRoutes);
app.use('/news', newsRoutes);
app.use('/analyze', analyzeRoutes);
app.use('/geo-insights', geoInsightsRoutes);
app.use('/quick-scan', quickScanRoutes);
app.use('/startup-insights', startupInsightsRoutes);
app.use('/translate', translationRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'not_found',
    message: `No route found for ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, _next) => {
  const status = err.statusCode || err.status || 500;
  const code = err.code || 'internal_error';
  const message = env.nodeEnv === 'production' && status === 500
    ? 'Unexpected server error'
    : err.message || 'Unexpected server error';

  res.status(status).json({ error: code, message });
});
