import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load .env file in local environment if available
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
  process.loadEnvFile(envPath);
}

const { default: app } = await import('./app.js');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
