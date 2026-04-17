import { Router } from 'express';
import { getGeoInsightsController } from '../controllers/geoController.js';

const router = Router();

router.get('/', getGeoInsightsController);

export default router;
