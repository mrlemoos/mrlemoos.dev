# Growth playbook — distribution and cadence for mrlemoos.dev

Written against the site as it stands on 15 August 2026: six live Posts, three external pieces on the Credo AI blog, three Projects, a Resend audience that collects addresses, and no feed.

This is an operating document, not a strategy deck. Section 1 is the thing you run on every publish. Section 2 is the rhythm. Section 3 is what to write next. Section 4 is how you tell whether any of it worked.

---

## 0. What you actually have, and what is missing

### The inventory

| Post | Date | Words | Shape |
| --- | --- | --- | --- |
| Tailwind CSS: A Divisive Darling or Just Divisive? | 2025-04-22 | 1,536 | Personal reversal narrative, CSS |
| I don't know which analytics tool to use | 2025-05-14 | 636 | Short build log, ends in "just use Vercel Analytics" |
| Don't be stupid – Be an engineer | 2025-08-09 | 1,092 | Argument: development vs engineering, AI |
| The AI Design System You Should Actually Build | 2026-04-03 | 1,834 | Thesis + four-layer model, design systems + agents |
| Juniors, You Have to Earn AI | 2026-07-11 | 1,422 | Contrarian argument, mentorship, AI |
| The bill for the code nobody asked me to write | 2026-07-29 | 1,648 | First-person data piece, US$1,526.48 of Cursor spend |

Externally: three Credo AI posts (agentic coding in monorepos, the GAIA design-engineering handoff, the cost of tokens). Projects: **plan/ria** (UK Open Banking, in progress), **Grabkit** (TypeScript HTTP client, live, open source), **Nota** (native macOS notes app, live).

Two things fall out of that table immediately.

**Your audience is not one audience.** Three of the six Posts argue about AI and craft; two are frontend how-I-changed-my-mind pieces; one is a 636-word build log. The AI-and-craft posts are the ones with an opinion someone could disagree with, and they are the ones worth pushing hard. The build log is not distributable and never was — do not spend a slot promoting it.

**Your single best asset is "The bill".** It has a number nobody else has published, a method you can describe in one sentence, an admission against interest, and an explicit request for other people's data at the end. That is the exact shape that survives Hacker News. Nothing else you have written is close, and the follow-up you promised in it (July's figures) is the highest-value unwritten post on the backlog.

### Prerequisites you do not have — flagged, not built

Parts of this playbook are blocked. Be honest about which parts.

1. **There is no RSS feed.** `src/pages/rss.xml.ts` does not exist and `@astrojs/rss` is not in `package.json`. This blocks more than feed readers: newsletter curators (Cooperpress's *JavaScript Weekly* / *Frontend Focus*, *This Week in React*, *Pointer.io*) run their pipelines off feeds and expect one on your domain; aggregators like daily.dev and Feedly cannot list you at all; and dev.to's RSS-import route for cross-posting is closed to you, so every cross-post is manual. Every "submit to a newsletter" line in Section 1 is at half strength until this exists. It is the single cheapest unblock on this list.
2. **Nothing has ever been sent to subscribers.** `src/lib/subscribe.ts` adds a contact to a Resend audience and stops there. A broadcast path (`src/lib/broadcast.ts`, `src/lib/admin/broadcast.ts`, and an admin route) is being built as this is written but is not yet committed or shipped — until it is live and you have actually sent one, every person who submits that form is told "You're in. Watch your inbox." and then hears nothing. This gets worse with time, not better: an unmailed list forgets it subscribed, and a first send to a cold six-month-old list earns spam complaints that damage the sending domain. Treat a working broadcast as a prerequisite for pushing the subscribe form any harder than you already do.
3. **There is no welcome email.** The first message after signup has the highest open rate you will ever get, and yours is empty air. Two links to your best existing Posts in that email is the cheapest way to turn a new subscriber into someone who has read three things.
4. **There is no UTM discipline.** Vercel Analytics shows referrers, but X and LinkedIn strip or obscure them, so a real chunk of your traffic lands as "direct" and you cannot tell which venue paid off. Fixed by convention, not code: tag every link you post by hand.
5. **Google Search Console is not evidenced in the repo.** The `@astrojs/sitemap` integration is installed, so `/sitemap-index.xml` exists and works; nobody appears to be reading the search data it enables. Section 4 leans on GSC more than on any other tool.
6. **Tag pages are in flight, unshipped.** Frontmatter has carried tags on every Post from the start, but until now the only blog routes were `/blog` and `/blog/[slug]`; `src/pages/blog/tags/` and `src/lib/tags.ts` are on disk uncommitted as this is written. Once they ship, your three AI-and-craft Posts become one internal hub — link them from each other and point every cross-post bio at the hub rather than at `/blog`.
7. **lobste.rs is invite-only.** You need an invitation from an existing user before it is a channel at all.

What already works and needs no attention: canonical tags are emitted correctly in `BaseLayout.astro`, the dynamic OG image route at `/og` gives every link a decent card, JSON-LD `Person` and `WebSite` are in place, and the subscribe form appears both in the footer and at the end of every Post. That is a better technical baseline than most personal sites. The gap is entirely distribution.

---

## 1. Per-post distribution checklist

Run this on every publish. It takes about ninety minutes spread over ten days. Do not do it all on day one — a Post that appears everywhere within an hour looks like a campaign and gets treated like one.

### Before you press publish

- [ ] **Title carries the claim, not the topic.** "Juniors, You Have to Earn AI" works because someone can disagree with it in the headline. "I don't know which analytics tool to use" does not travel. Every venue below shows the title and nothing else in its list view; the title is 90% of the click.
- [ ] **Description reads as a standalone sentence.** It is the meta description, the OG card subtitle, the newsletter blurb, and the LinkedIn hook. Note that `ai-design-system.mdx` and `dont-be-stupid-be-an-engineer.mdx` currently share an identical `description` — that is a duplicate-content signal to Google and a wasted hook on both. Fix before promoting either.
- [ ] **One quotable number or one quotable line.** "$1,526.48." "Multiply zero by anything and you still get zero." This is what you paste into the X thread and the LinkedIn post. If you cannot find one, the Post is not ready to distribute.
- [ ] **Two internal links out, at least one internal link in.** You already do this well (the Tailwind Post links to the analytics and design-system Posts). Extend it: when you publish, edit the two most-related older Posts to link forward to the new one. This is the only SEO work that compounds without effort.
- [ ] **Check the OG card renders.** Paste the URL into the LinkedIn Post Inspector and X's card validator before you post anywhere. A broken card halves the click rate and you cannot fix it after the fact — LinkedIn caches the card per URL.

### Day 0 — your own channels

- [ ] **Push to `main`, confirm the Vercel deploy, load the live URL.** Publishing is a git operation here; the site is the source of truth for the canonical URL everything else points at.
- [ ] **Google Search Console → URL Inspection → Request Indexing.** Thirty seconds. It gets the original crawled and indexed before any copy of it exists anywhere else, which is the whole basis of the canonical strategy below.
- [ ] **Send the broadcast to the Resend audience.** Blocked until the broadcast path lands. When it does: subject line = the Post title, body = the first two paragraphs plus a link, nothing else. Your subscribers opted in for the writing, not a newsletter format.

### Day 0 — LinkedIn (your strongest venue, and you have proof)

You wrote in `earn-your-ai-multiplier.mdx` that a LinkedIn version of that argument "travelled further than my stuff usually does". That is the only hard audience data in the repo. Treat LinkedIn as the primary channel, not the afterthought.

- **Format:** native post, 150–220 words, the argument stated in full so it stands alone without the click. Hard line break after the first sentence — LinkedIn truncates at roughly 200 characters and the "see more" fold is where you lose people. No link in the body. Put the link in your own first comment, immediately after posting.
- **When:** Tuesday to Thursday, 08:00–09:00 UK. That catches the UK commute and is still overnight for US readers, so the post has accumulated engagement by the time the US wakes up.
- **The rule that kills you:** an external link in the post body. LinkedIn demotes posts that send people off-platform, and the penalty is severe enough to be the difference between 500 and 5,000 impressions. Second rule: do not edit the post in the first hour; edits reset distribution.
- **The part everyone skips:** reply to every comment within the first two hours, with a sentence that adds something rather than "thanks!". The comment thread is where the reach comes from — and, as the AI-multiplier Post proves, the comment thread is also where your next Post comes from. Screenshot the good objections.

### Day 0 — X (@mrlemoos)

- **Format:** a thread, not a link. Five to seven posts, one claim each, pulled verbatim from the Post — you write in short declarative lines already, so this is extraction rather than rewriting. Link in the final post of the thread or in a self-reply, never in the first. If the Post has a number or a chart, the first post is an image of it.
- **When:** 13:00–15:00 UK, weekdays. Overlaps UK afternoon with US morning.
- **The rule that kills you:** posting the bare URL with no context. It gets no reach and it teaches the algorithm that your account is a link dispenser. Second: never delete and repost to "try again" — it splits the engagement and the second attempt performs worse.

### Day 0 or 1 — Hacker News

Only for Posts that can survive it. Of what exists: **"The bill for the code nobody asked me to write"** (yes, clearly), **"Juniors, You Have to Earn AI"** (yes, and expect a fight), the future Nota and Grabkit write-ups (yes, as `Show HN`). The Tailwind Post is three years late to that argument and the analytics Post is too thin. Do not submit them.

- **Format:** URL submission, title copied exactly from the Post. Do not add "— my thoughts on…", do not add a year, do not editorialise. Moderators rewrite baity titles and the rewrite is usually worse than yours.
- **When:** Tuesday to Thursday, 08:00–10:00 US Eastern (13:00–15:00 UK). Weekday mornings have the most voters awake; the front-page threshold is higher but so is the ceiling. Weekends have a lower threshold and a much lower ceiling — worth it only for a Post you think is marginal.
- **The comment you should post yourself:** immediately after submitting, add one comment giving the method and the limits. For "The bill" that is: six months, one tool, personal card, n=1, here is how I pulled the data. HN rewards visible epistemic honesty and punishes anything that reads as marketing. Do not describe your job, your employer, or your other projects in it.
- **The rule that gets you banned:** asking anyone to upvote. Not in a group chat, not on LinkedIn, not to one friend. Voting-ring detection is the fastest route to a domain-level ban, and a banned domain cannot be undone quickly. Secondary rule: submit your own work no more than roughly once a fortnight, and read and comment on other people's threads in between. An account that only ever submits `mrlemoos.dev` gets flagged whatever the content.
- **If it dies with three points, it dies.** Do not resubmit. Do not ask a moderator for a second-chance pool slot more than once ever.

### Day 1 — Reddit

Pick one or two subreddits per Post. Never crosspost the same link to five subs on the same day; site-wide spam heuristics catch it and Reddit will shadow-remove all of them without telling you.

| Subreddit | Which of your Posts | Format that works | The rule that gets you removed |
| --- | --- | --- | --- |
| r/ExperiencedDevs | "Don't be stupid", "Juniors, You Have to Earn AI" | **Text post**, argument in full, link at the bottom or omitted entirely | Link-only submissions are removed on sight. This is a discussion sub; if you are not prepared to argue in the comments, do not post |
| r/programming | "The bill" | Link submission, exact title | Opinion pieces get buried by downvotes; only submit here when you have data. Self-promotion above ~10% of your submissions gets you flagged |
| r/webdev | Tailwind Post, a future Astro-migration Post | Link submission with a comment explaining what you changed and why | Project links belong in Showoff Saturday only; posting one midweek gets removed |
| r/tailwindcss | Tailwind Post, a Tailwind v4 follow-up | Link submission | Small sub — it will not move numbers, but it converts well. Do not repost the same link on updates |
| r/reactjs | "The AI Design System", a JSDoc/Storybook extraction | Link submission, substantive only | No "check out my blog". The post must stand on the technical content |
| r/cursor, r/ChatGPTCoding | "The bill" | Link or text with the headline figure in the title | Anything that reads as promoting a paid product or referral gets removed. You are safe here because you are criticising your own spending |
| r/SideProject, r/opensource | Grabkit, Nota | Text post: problem, what you built, link | Both enforce comment-history requirements. An account with no history posting a link is auto-removed |

**Universal Reddit rule:** most subs enforce roughly a 9:1 ratio of participation to self-promotion, some via AutoModerator, some via human mods reading your history. If your submitted-links page is nothing but your own domain, you are one report away from a site-wide ban. Spend ten minutes a week commenting somewhere you have nothing to sell.

### Day 1 — lobste.rs

Blocked until you have an invitation. When you do:

- **Format:** URL submission, accurate tags (`ai`, `practices`, `culture`, `javascript`, `css`), and you **must** tick "authored by you". Failing to disclose authorship is the single fastest way to get flagged.
- **What belongs there:** the technical Posts only — a Grabkit design write-up, the Astro migration, Tailwind v4 mechanics. Lobsters downvotes opinion and career content hard; "Juniors, You Have to Earn AI" would be tagged `rant` and buried inside an hour. Do not submit it. Knowing which of your Posts *not* to submit is the whole skill on this site.

### Days 3–7 — canonical cross-posts

Wait at least three days after publishing on your own domain, and only after Search Console confirms the original is indexed. This is the entire game: whichever copy Google crawls first has the strongest claim to being the original.

- **dev.to:** set `canonical_url: https://mrlemoos.dev/blog/{slug}` in the front matter of the dev.to editor. It emits `<link rel="canonical" href="https://mrlemoos.dev/blog/{slug}">` on the dev.to page.
- **Hashnode:** paste the same URL into "Original article URL" in the post's settings sidebar. Same effect.
- **Medium:** only via *Import a story*, which sets the canonical automatically. Never paste into a fresh Medium draft — that creates an uncanonicalised duplicate. Given your audience, Medium is optional; dev.to is not.

**Why this matters, concretely.** dev.to has orders of magnitude more domain authority than mrlemoos.dev. Publish the same 1,600 words there without a canonical tag and Google has two identical documents, one on a trusted domain and one on a two-year-old personal site. It will usually rank dev.to's copy for your own sentences, your site accumulates none of the authority, and the growth you are chasing — search traffic that arrives every month without you doing anything — accrues to someone else's platform. The canonical tag tells Google "the dev.to page is a copy; consolidate all ranking signals onto mrlemoos.dev". You keep dev.to's in-platform distribution and referral clicks; your domain keeps the SEO. It costs one field in a form and it is not optional.

- **dev.to specifics:** maximum four tags (`#ai`, `#career`, `#webdev`, `#typescript` cover your range), and add a cover image or the reach drops noticeably. Cross-posting with no canonical and no engagement gets flagged as spam by dev.to's own moderation, so this is a rule with two independent reasons to follow it.
- **Do not cross-post everything.** Two or three of your best per year is plenty. A dev.to profile that mirrors your entire blog gives readers no reason to visit your site.

### Day 3–10 — newsletters and curators

All of these want: a stable URL, a clean title, one sentence of context, and — for the ones running automated pipelines — a feed on your domain. See prerequisite 1.

| Newsletter | Fit | How to submit |
| --- | --- | --- |
| *Frontend Focus* (Cooperpress) | Tailwind, CSS, Astro migration Posts | Submission form on the site. One sentence, no pitch |
| *JavaScript Weekly* (Cooperpress) | Grabkit write-ups, TypeScript Posts | Same form. They favour "here is how it works" over "here is what I think" |
| *This Week in React* | Design-system and JSDoc/Storybook Posts | Submission form; Sébastien reads everything submitted |
| *Pointer.io* | "Don't be stupid", "Juniors, You Have to Earn AI" | Submission form. Explicitly a dev-leadership audience — your career arguments fit here better than anywhere else on this page |
| *Bytes.dev* | Anything JS-adjacent with a joke in it | Reply to any issue; they read replies |
| *TLDR* | "The bill", if you have the chart | Submission form on tldr.tech |
| *CSS Weekly* | CSS-specific content only | Submission form. Do not submit the AI Posts |
| Astro community showcase / Discord | The Astro migration Post, when written | Post in the community channel once, do not repeat |

**The rule across all of them:** submit once, never follow up, and never submit something outside the newsletter's stated scope. Curators remember names, and the memory works in both directions.

### Day 7 — the internal pass

- [ ] Add the new Post to the two most-related older Posts as an inline link.
- [ ] Check Vercel Analytics referrers: which venue actually sent people? Write it down. After three Posts you will have a ranked list of venues that work for *you*, which is worth more than this entire section.
- [ ] Screenshot the best objection you received and file it as a backlog idea.

---

## 2. Cadence

### What your history actually shows

Six Posts across roughly sixteen months. The gaps, in order: 22 days, 87 days, 237 days, 99 days, 18 days. That averages to one Post every ten weeks, but the average hides the shape — you write two in quick succession, then stop for a season.

The eight-month gap from August 2025 to April 2026 is the expensive one. Any reader who found the Tailwind Post in that window arrived, read one thing, found nothing recent, and left with no reason to come back. Every pound of distribution effort spent during a silence like that leaks straight out.

The uncomfortable detail: during spring 2026, while this site was quiet, you published three pieces on the Credo AI blog in three months — April, May, June. You are perfectly capable of a monthly cadence. Your employer got it and your own domain did not.

### The recommendation: one Post every three weeks, and nothing more ambitious

Seventeen Posts a year. Not weekly — weekly forces you to publish the 636-word build log, and you have already proved what that produces. Three weeks is long enough to have something worth arguing with and short enough that a new reader always finds something recent.

**Why frequency beats quality at your current size, up to a point.** Three things compound, and all three are counted in Posts rather than in words:

1. **Search surface.** Every Post is an independent set of queries you can be found for. Six Posts is a rounding error in an index; thirty is a topic. Rankings also age in — a Post typically does its best search traffic six to twelve months after publication, which means today's compounding was decided last spring.
2. **The return visit.** Nobody subscribes on their first read. They subscribe on the second or third, once they have decided you are a person with a recurring point of view rather than a link. A reader who arrives during a three-week gap sees a live site; a reader who arrives during an eight-month gap sees an abandoned one, and the subscribe form at the end of the Post is asking them to trust a site that looks dead.
3. **Venue standing.** Hacker News, Reddit and lobste.rs all account for the ratio of your own links to your participation. A steady cadence lets you submit occasionally and participate constantly. A burst of four Posts in a fortnight followed by silence is exactly the pattern their spam heuristics are built to catch.

The argument only holds while quality stays roughly where it is. Your floor is around 1,100 words with a real position in it. Do not go below that to hit a date — miss the date instead.

### The mechanics that make three weeks survivable

- **Two drafts in flight at all times.** `status: "draft"` already exists in the frontmatter schema and Local Admin already lists drafts. Use it as a queue, not a graveyard.
- **Publish on Tuesday or Wednesday morning.** Same day every time. Readers and curators both benefit from predictability, and it means your Day 0 LinkedIn slot never has to be rescheduled.
- **Ship the follow-up while the loop is warm.** "The bill" ends with an explicit promise to look at July's numbers and an open request for other people's curves. That promise expires. A follow-up in September is a Post; in February it is an apology.

### Weeks with no Post

Two of every three weeks have no publish. They are not idle weeks — they are the weeks that make the next Post land.

- **Write one LinkedIn post per off-week** on an idea that is not yet a Post. Your own history says this is the cheapest audience test you have: the AI-multiplier Post exists because a LinkedIn post travelled and the comments told you what the full argument needed. Ideas that die on LinkedIn should not be promoted to Posts.
- **Comment where you do not have a link.** Twenty minutes a week on HN, lobste.rs, or r/ExperiencedDevs, substantively, on other people's threads. This is not networking; it is the participation ratio that keeps you submittable. Do it in the quiet weeks and it is never a chore in the loud ones.
- **Refresh one old Post per month.** Add the `updated` frontmatter field, add links to newer Posts, and fix what has gone stale. The Tailwind Post now predates Tailwind v4 shipping on this very site; the analytics Post is 636 words and predates the Google Analytics work currently landing. Both would be better and more findable with an hour each. Updating an existing indexed URL often outperforms publishing a new one.
- **Answer the newsletter and email replies.** When the broadcast path lands, replies to your sends are the highest-signal feedback you will get. They are also, historically, where the "n=1, show me your curve" material comes from.
- **Bank one number.** Screenshot a billing page, run a benchmark, count something in a codebase. Your best Post came from opening a bill and reading it properly. That is a repeatable habit, not a one-off.

---

## 3. Post backlog

Twelve ideas, each derived from a Post you have already written or a Project you already run. Ordered roughly by what would do most for readership.

1. **"What July's bill actually said"** — You promised this in "The bill": deliberate model routing, three-strikes context resets, and fresh sessions, measured against the same six-month baseline. A published prediction checked against the data is the rarest thing on a personal blog and the surest HN submission you will have this year.
2. **"Show me the shape of your curve"** — Collate the spend curves readers sent you after "The bill". Turns your n=1 into an n=whatever and makes the people who replied into people who share it.
3. **"Grabkit returns a tuple, and here is the argument for it"** — Errors as values in TypeScript, why `throw` loses at API boundaries, and what the ergonomics actually cost. Your only genuinely lobste.rs-shaped Post, and it makes the Project findable.
4. **"JSON:API by default was an unfashionable choice and I would make it again"** — Defend the Grabkit default. Unfashionable-but-defended positions travel further than safe ones.
5. **"Moving this site from Next.js to Astro made the build boring"** — The migration is done and undocumented. Concrete numbers (build time, JS shipped, what broke), and boring as the explicit selling point. Strong fit for r/webdev, *Frontend Focus*, and the Astro community.
6. **"The JSDoc you write is the prompt you do not have to"** — Extract the second layer of "The AI Design System" into a standalone piece with real before/after prop interfaces. The parent Post is 1,834 words and buries this; alone, it is a r/reactjs and *This Week in React* submission.
7. **"A rules file is a code review you only write once"** — `.cursor/rules` and `AGENTS.md` as governance rather than configuration, drawn from the same four-layer model. Pairs naturally with your Credo AI agentic-coding piece.
8. **"What I removed to make a notes app quiet"** — Nota: no feed, no nudges, no streaks, and what building native macOS taught a frontend engineer. A different audience entirely from your AI Posts, and precisely the shape HN rewards as a `Show HN`.
9. **"Tailwind v4, a year after I changed my mind"** — Your 2025 Post argued its way to yes; v4 through Vite is now running this site. What the upgrade actually cost, what the new config model gets right. Updates your best-performing evergreen topic with new material.
10. **"UK Open Banking is harder than the API docs suggest"** — plan/ria field notes: consent expiry, reauthentication, the gap between the specification and what the banks return. Reaches a fintech audience you currently have no route into.
11. **"The analytics post, corrected"** — Fifteen months on from a 636-word Post that ended in "just click the tab", write the honest version: what Vercel Analytics cannot tell you, why Search Console matters more, what adding Google Analytics changed. The weakest Post on the site is also the most improvable.
12. **"I let an agent maintain my design tokens for a month"** — The AI-design-system thesis, run as an experiment with a diff count, a rejection rate, and the failures. You already know that data beats argument on this blog; this converts your most theoretical Post into your most concrete one.

Two you should not write: another "AI will not replace engineers" argument — you have made it twice, and the third has nothing new; and anything about a tool you have not personally paid for or shipped with, because the credibility of everything above rests on you having done the thing.

---

## 4. What to measure

Five numbers. Check them monthly, not daily — daily numbers on a site this size are noise and will make you write for the noise.

### 1. Returning visitors as a share of total

**Where:** Vercel Analytics, Visitors vs Page Views over 30 days.
**Why:** total pageviews measure how well you posted last week. The returning share measures whether you are building a readership. A 5,000-view HN spike with 2% returning is a nice afternoon; 400 views with 25% returning is an audience.
**Watch for:** the Vercel free tier keeps a 30-day window, so compare month to month and write the figure down somewhere permanent, because the tool will not remember it for you.

### 2. Subscribers per 1,000 readers

**Where:** Resend audience count, divided by Vercel Analytics visitors for the same period.
**Why:** this is the only metric that measures intent. The form sits in the footer and at the end of every Post, so the rate is a clean read on whether the writing convinced anyone. Roughly 1–2% is respectable for a developer blog; below 0.5% means the Posts are being skimmed, not read.
**Caveat:** the number is meaningless until subscribers receive something. An audience you never mail is a list of email addresses, not readers.

### 3. Non-brand search impressions and clicks

**Where:** Google Search Console — Performance, with queries containing "lemos" or "mrlemoos" filtered out.
**Why:** this is the compounding one. Everything else in this playbook is a push that decays within 48 hours; search traffic arrives every month without you doing anything, and it is the only channel where publishing more genuinely makes each earlier Post worth more. Impressions rising while clicks stay flat means your titles and descriptions are wrong — a cheap fix. Both rising means the cadence is working.
**Note:** Vercel Analytics and Google Analytics both describe people who already arrived. Only Search Console tells you how often Google offered you and was declined.

### 4. Referrer mix per Post

**Where:** Vercel Analytics referrers, plus UTM parameters you add by hand (`?utm_source=linkedin`, `?utm_source=hn`, `?utm_source=reddit-experienceddevs`) since X and LinkedIn obscure the referrer.
**Why:** Section 1 is a hypothesis. After three or four Posts this tells you which two venues actually pay and which five are ritual. Delete the ones that do not pay. Ninety minutes per publish is only worth it if you know where it goes.

### 5. Deep-read rate

**Where:** Google Analytics 4, once it lands — Enhanced Measurement fires a `scroll` event at 90% depth by default, so the metric is available with no extra instrumentation.
**Why:** your Posts run 1,100–1,800 words and the argument is usually in the last third. The share of readers who reach 90% is the difference between "they saw the headline" and "they read the piece". It also tells you where you lose people: if the 90% rate on a 1,800-word Post is half that of a 1,400-word one, the length is the problem.

### What not to measure

Total pageviews, the height of an HN spike, follower counts, and time on page (uselessly noisy at this volume). None of them survive contact with a good month followed by a quiet one, and all of them reward publishing for the spike rather than for the third week running.

The one-line version, in the spirit of a Post you have already written: you are not trying to find out how many people saw it. You are trying to find out how many came back.
