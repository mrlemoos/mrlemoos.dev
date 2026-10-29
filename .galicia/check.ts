import { scanSpecs, scanSummary } from './check-specs.ts';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const scan = await scanSpecs(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
console.log(scanSummary(scan) || `No metadata flags in ${scan.inspected} inspected specs. Semantic implementation review not performed.`);
