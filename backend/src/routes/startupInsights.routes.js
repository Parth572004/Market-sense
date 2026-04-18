import { Router } from 'express';
import { getStartupInsights } from '../controllers/startupInsightsController.js';

const router = Router();

router.get('/', getStartupInsights);

export default router;
