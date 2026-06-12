/**
 * Ensures dist/server.js exists before starting.
 * Used by `npm start` on Render when build step only runs `npm install`.
 */
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const entry = path.join(__dirname, '..', 'dist', 'server.js');

if (!fs.existsSync(entry)) {
  console.log('[ensure-dist] dist/server.js not found — compiling TypeScript...');
  execSync('npx tsc', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('[ensure-dist] Build complete.');
}
