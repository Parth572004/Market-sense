import { Router } from 'express';
import { analyze } from '../controllers/analysisController.js';

const router = Router();

router.post('/', analyze);

export default router;
