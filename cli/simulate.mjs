#!/usr/bin/env node
import { fileURLToPath } from 'node:url';

try {
 // Resolve both the loader and tsconfig from this project, regardless of Python's cwd.
 process.env.TSX_TSCONFIG_PATH = fileURLToPath(new URL('../tsconfig.json', import.meta.url));
 const { require: tsxRequire } = await import('tsx/cjs/api');
 const { runCli } = tsxRequire('./simulate.ts', import.meta.url);
 await runCli();
} catch (error) {
 process.stdout.write(JSON.stringify({
  ok: false,
  error: { code: 'startup_error', message: 'Nie udało się załadować CLI. Sprawdź Node.js i lokalne zależności (pnpm install --offline --frozen-lockfile).' },
 }) + '\n');
 console.error(error);
 process.exitCode = 1;
}
