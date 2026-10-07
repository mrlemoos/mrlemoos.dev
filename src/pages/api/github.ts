import type { APIRoute } from 'astro';
import { getGitHubActivity } from '@/lib/github-contributions';

export const prerender = false;

export const GET: APIRoute = async () => {
  const { activity, fresh } = await getGitHubActivity(import.meta.env.GITHUB_TOKEN);
  // Failed refreshes retry soon, rather than caching an old snapshot for another day.
  const ttl = fresh ? Math.max(1, Math.floor((Date.parse(activity.fetchedAt) + 86_400_000 - Date.now()) / 1000)) : 300;
  return new Response(JSON.stringify(activity), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${ttl}`,
      'CDN-Cache-Control': `public, s-maxage=${ttl}, stale-while-revalidate=3600`,
    },
  });
};
