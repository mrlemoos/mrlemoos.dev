import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanSpecs, scanSummary } from './check-specs.ts';

// Installed alongside checker in .galicia; resolve independently of agent cwd.
const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
try {
  const summary = scanSummary(await scanSpecs(project));
  if (process.argv[2] === 'cursor') console.log(JSON.stringify({ additional_context: summary }));
  else console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: summary } }));
} catch (error) {
  console.error(`Galicia spec scan failed: ${(error as Error).message}`);
  console.log('{}');
}
