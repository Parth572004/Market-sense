import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'market-sense-api',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

export default router;
