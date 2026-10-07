import snapshot from './data/github-contributions.json' with { type: 'json' };

export const DAY_MS = 86_400_000;
export type GitHubActivity = typeof snapshot;
const levels = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];
let cached: GitHubActivity = snapshot;
let pending: Promise<{ activity: GitHubActivity; fresh: boolean }> | undefined;

function calendar(days: GitHubActivity['days'], now = Date.now()): GitHubActivity {
  if (days.length < 350 || new Set(days.map(day => day.date)).size !== days.length || days.some(day => !/^\d{4}-\d{2}-\d{2}$/.test(day.date) || !Number.isSafeInteger(day.count) || day.count < 0 || !Number.isInteger(day.level) || day.level < 0 || day.level > 4)) {
    throw new Error('GitHub returned an incomplete contribution calendar');
  }
  return { fetchedAt: new Date(now).toISOString(), total: days.reduce((sum, day) => sum + day.count, 0), days: days.sort((a, b) => a.date.localeCompare(b.date)) };
}

export function parseContributions(html: string, now = Date.now()): GitHubActivity {
  const counts = new Map([...html.matchAll(/<tool-tip\b[^>]*for="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g)].map(match => [match[1], /^No contributions/.test(match[2]) ? 0 : Number(match[2].match(/^[\d,]+/)?.[0].replaceAll(',', '') ?? NaN)]));
  const days = [...html.matchAll(/<td\b[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="([^"]+)"[^>]*data-level="([0-4])"[^>]*>/g)].map(match => ({ date: match[1], count: counts.get(match[2]) ?? NaN, level: Number(match[3]) }));
  return calendar(days, now);
}

export async function fetchGitHubActivity(token?: string, request: typeof fetch = fetch, now = Date.now()): Promise<GitHubActivity> {
  if (!token) {
    // ponytail: public calendar HTML when no token exists; GraphQL avoids markup dependency.
    const response = await request('https://github.com/users/mrlemoos/contributions', { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    return parseContributions(await response.text(), now);
  }
  const response = await request('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'mrlemoos.dev' },
    body: JSON.stringify({ query: 'query { user(login: "mrlemoos") { contributionsCollection { contributionCalendar { weeks { contributionDays { date contributionCount contributionLevel } } } } } }' }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  const body = await response.json();
  if (body.errors || !Array.isArray(body.data?.user?.contributionsCollection?.contributionCalendar?.weeks)) throw new Error('GitHub returned an incomplete contribution calendar');
  const weeks = body.data.user.contributionsCollection.contributionCalendar.weeks as { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[];
  return calendar(weeks.flatMap(week => week.contributionDays.map(day => ({ date: day.date, count: day.contributionCount, level: levels.indexOf(day.contributionLevel) }))), now);
}

export async function getGitHubActivity(token?: string, request: typeof fetch = fetch, now = Date.now()) {
  if (now - Date.parse(cached.fetchedAt) < DAY_MS) return { activity: cached, fresh: true };
  // ponytail: per-instance cache; CDN caches across requests, cold regions may each fetch once.
  pending ??= fetchGitHubActivity(token, request, now).then(activity => {
    cached = activity;
    return { activity, fresh: true };
  }).catch(() => ({ activity: cached, fresh: false }));
  try { return await pending; } finally { pending = undefined; }
}
