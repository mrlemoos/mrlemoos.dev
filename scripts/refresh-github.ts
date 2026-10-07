import { writeFile } from 'node:fs/promises';
import { fetchGitHubActivity } from '../src/lib/github-contributions.ts';

const activity = await fetchGitHubActivity(process.env.GITHUB_TOKEN);
await writeFile(new URL('../src/lib/data/github-contributions.json', import.meta.url), JSON.stringify(activity) + '\n');
