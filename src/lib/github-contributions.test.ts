import { expect, it, vi } from 'vitest';
import { parseContributions, getGitHubActivity, DAY_MS } from './github-contributions';
import activity from './data/github-contributions.json';

it('parses calendar counts and rejects incomplete upstream data', () => {
  const html = activity.days.map((day, i) => `<td data-date="${day.date}" id="day-${i}" data-level="${day.level}"></td><tool-tip for="day-${i}">${day.count || 'No'} contributions on a day.</tool-tip>`).join('');
  expect(parseContributions(html).days).toEqual(activity.days);
  expect(() => parseContributions('<html>Rate limited</html>')).toThrow('incomplete');
  expect(() => parseContributions(html.replace(/<tool-tip[^>]*>.*?<\/tool-tip>/, ''))).toThrow();
});

it('uses GitHub GraphQL counts, reuses 24-hour cache, retains data during outages', async () => {
  const now = Date.now() + DAY_MS;
  const response = { data: { user: { contributionsCollection: { contributionCalendar: { weeks: [{ contributionDays: activity.days.map(day => ({ date: day.date, contributionCount: day.count, contributionLevel: ['NONE','FIRST_QUARTILE','SECOND_QUARTILE','THIRD_QUARTILE','FOURTH_QUARTILE'][day.level] })) }] } } } } };
  const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(response)));
  const fresh = await getGitHubActivity('test-token', request, now);
  expect(fresh.activity.total).toBe(activity.total);
  expect(request.mock.calls[0][0]).toBe('https://api.github.com/graphql');
  expect(request.mock.calls[0][1]?.headers).toMatchObject({ Authorization: 'Bearer test-token' });
  await getGitHubActivity('test-token', request, now + DAY_MS - 1);
  expect(request).toHaveBeenCalledTimes(1);
  request.mockRejectedValue(new Error('GitHub unavailable'));
  const stale = await getGitHubActivity('test-token', request, now + DAY_MS);
  expect(request).toHaveBeenCalledTimes(2);
  expect(stale.activity).toEqual(fresh.activity);
  expect(stale.fresh).toBe(false);
});
