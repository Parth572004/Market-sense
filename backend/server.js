import { app } from './src/app.js';
import { env } from './src/config/env.js';

app.listen(env.port, () => {
  console.log(`Market Sense API listening on http://localhost:${env.port}`);
});
