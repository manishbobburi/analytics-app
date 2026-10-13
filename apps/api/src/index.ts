import app from './app.js';
import { serverConfig } from './config/index.js';

app.listen(serverConfig.port, () => {
  console.log(`API running on PORT: ${serverConfig.port}`);
  console.log(`Env: ${serverConfig.nodeEnv}`);
});
