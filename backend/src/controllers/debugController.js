import { getDebugSnapshot } from '../services/debugService.js';

export function getDebug(req, res) {
  res.json(getDebugSnapshot());
}
