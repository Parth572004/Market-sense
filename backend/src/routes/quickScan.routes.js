import { Router } from 'express';
import { quickScan } from '../controllers/quickScanController.js';

const router = Router();

router.get('/', quickScan);
router.post('/', quickScan);

export default router;
