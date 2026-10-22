---
title: Text Match browser video editor
status: implemented
---

## Problem Statement

Creators want TextMatchCut's rapid newspaper clipping effect with much more control over its appearance. Casual creators need useful presets; experienced editors need detailed controls. Both need full mobile editing and clean exports without accounts, payment or generation gates.

## Solution

Build **Text Match** at **/tools/text-match**, a browser-local Svelte editor inside the existing Astro website. Provide editable generated print layouts, typography and animation controls, local project persistence and watermark-free 1080p exports. Prerender the surrounding page for search. Promote konijn.co through a banner outside the artwork.

## User Stories

1. As a visitor, I want working examples, so that I understand the effect before editing.
2. As a casual creator, I want a usable preset immediately, so that I can make a clip quickly.
3. As an experienced editor, I want expandable controls, so that I can customise without initial clutter.
4. As a creator, I want a focal word or phrase, so that every cut shares an anchor.
5. As a creator, I want phrases beyond 23 characters, so that my wording is preserved.
6. As a creator, I want fit warnings, so that text is never silently truncated.
7. As a creator, I want newspaper, book, magazine and clean typography presets, so that I can choose an aesthetic.
8. As a creator, I want editable headlines and surrounding text, so that the clip suits my message.
9. As a creator, I want font family and weight controls, so that typography matches my work.
10. As a creator, I want a searchable Google Fonts catalogue, so that I can find suitable fonts.
11. As a visitor, I want only selected font files downloaded, so that the tool stays lightweight.
12. As a creator, I want local font uploads, so that I can use custom typography.
13. As a creator, I want text, paper and highlight colours, so that I can match a palette.
14. As a creator, I want highlight style and texture controls, so that artwork can look printed or clean.
15. As a creator, I want focal position, zoom and blur controls, so that framing matches my edit.
16. As a creator, I want duration and cut-speed controls, so that pacing fits my video.
17. As a creator, I want repeatable shuffling, so that I can return to a chosen layout sequence.
18. As a creator, I want optional sound effects and silence, so that exports fit my soundtrack.
19. As a creator, I want immediate preview updates, so that I can judge edits without regeneration gates.
20. As a mobile creator, I want full editing and export, so that desktop access is unnecessary.
21. As a social creator, I want TikTok, Reels and Shorts presets with safe-area overlays, so that I avoid platform UI.
22. As a creator, I want square and landscape outputs, so that I can use other placements.
23. As a creator, I want watermark-free 1080p MP4 with sound, so that I can use finished clips commercially or personally.
24. As a creator without MP4 support, I want a clearly labelled WebM fallback, so that I understand the output format.
25. As a creator, I want “Copy video to clipboard”, so that I can paste into compatible destinations.
26. As a creator without video clipboard support, I want download/share alternatives, so that I can retrieve my clip.
27. As a creator, I want preview and exported artwork to match, so that rendering has no surprises.
28. As a returning creator, I want automatic local draft recovery, so that refreshing preserves work.
29. As a creator, I want project import/export, so that I can back up or move editable work.
30. As a creator, I want permitted font assets included in project files, so that reopening preserves typography.
31. As a creator, I want invalid imports rejected before replacing work, so that my draft stays safe.
32. As a creator, I want reset confirmation, so that I cannot casually erase work.
33. As a visitor, I want system-aware light/dark mode and a toggle, so that the interface suits my environment.
34. As a keyboard or assistive-technology user, I want accessible controls and feedback, so that I can complete the workflow.
35. As a motion-sensitive visitor, I want explicit playback and reduced-motion support, so that rapid animation is optional.
36. As a visitor, I want an indexable guide and FAQ, so that I can discover and understand the tool through search.
37. As a visitor, I want a Konijn banner outside the artwork, so that promotion never contaminates exports.
38. As a visitor, I want an avatar/handle follow card, so that I can follow @leonardo_lemos on X.

## Implementation Decisions

- TypeScript and Svelte within Astro 6, not a SvelteKit migration. npm returned stable Svelte **5.57.2** during specification; recheck latest stable and integration compatibility before installation.
- Prerender the public page, metadata, canonical URL, examples, guide and FAQ. Include the route in the sitemap and suitable internal navigation. Hydrate the editor separately; keep project settings out of indexable URLs.
- Follow existing site typography and theme conventions. System-aware light/dark interface with manual override; UI theme never changes exported artwork colours.
- Tool projects are separate from Posts and Local Admin. Existing Post save/publish semantics remain unchanged.
- One versioned project describes text, styling, timing, ratio, sound, shuffle seed and font resources. Use it for controls, persistence, preview and export.
- Generate original fictional print layouts and editable filler locally. No article corpus or scraping. Do not copy competitor code, assets or filler text.
- Share layout/timing decisions between preview and rendering. Focal text stays aligned across cuts.
- Presets: newspaper, book, magazine and clean typography. Default newspaper uses warm paper, black serif text, yellow marker and subtle grain.
- Proposed defaults accepted with the final scope summary: 3 seconds, 12 cuts/sec, 1.5× zoom.
- Controls cover duration, cut speed, repeatable shuffle, optional sound, zoom, blur, focal position, font family/weight, colours, highlight style, paper texture and editable surrounding text.
- Update a static preview frame while editing. Start animation explicitly; honour reduced motion. Keep advanced controls expandable.
- Full mobile editing/export, preview above collapsible controls, no horizontal overflow.
- TikTok/Reels/Shorts export 1080×1920 with distinct safe-area overlays. Also support 1080×1080 and 1920×1080. Guides never appear in output.
- Searchable Google Fonts catalogue, curated starting choices. Load font files dynamically only after family/weight selection; never preload the catalogue's binaries. Wait for fonts before final preview/export, with actionable load failures instead of silent substitution.
- Choose the simplest reliable catalogue delivery without exposing provider secrets. Catalogue metadata and font binaries are separate concerns. No paid font service required.
- Support local font files. Package font assets where embedding permissions allow. Explain portability limits before project export; disclose unavailable external fonts on reopening. Preserve offline appearance when assets are included.
- Browser-local rendering with progress, clear errors and cleanup. Prefer 1080p MP4 with sound; detect real capability and clearly label WebM fallback. Never report success for empty/failed output.
- Exact action label: **Copy video to clipboard**. Handle supported MIME types, permission denial and incompatibility. Keep download available; offer native sharing where supported.
- Automatically persist one local working draft. Show storage/quota failures. Validate imported version, values and font resources before replacing existing work. Confirm reset.
- Free, no account, no watermark, no forced ad wait. Linked konijn.co banner outside the rendered canvas. No additional ad network.
- Follow card uses the author's portrait and existing @leonardo_lemos account constant, following the supplied screenshot's avatar/handle/button pattern.
- Keyboard access, visible focus, labelled controls and accessible progress/error feedback throughout.

## Testing Decisions

- Main seam: observable editor workflow. Test user outcomes, not component structure. Add lower-level deterministic rendering checks only where UI checks cannot establish alignment/timing reliably; avoid duplicate coverage.
- Reuse Vitest/Astro tooling. Existing Astro Container and public sitemap tests provide prior art for static content/discoverability. Add only Svelte test support needed for the workflow.
- Red: demonstrate failing checks for focal alignment, deterministic shuffle, long-text fit handling, project round-trip, draft recovery, invalid import preservation and reset cancellation. Green: implement minimum complete behaviour, then refactor with checks passing.
- User accepted the preceding red/green outline when requesting this spec. Browser mechanics remain validation work, not claims of existing support.
- Browser acceptance: desktop/mobile, light/dark, full controls, keyboard, reduced motion, dynamic font requests/failures, local font portability and preview/export parity.
- Decode actual exported files to verify dimensions, timing, focal alignment, sound and absence of watermarks, guides and promotion. Exercise real MP4 and labelled WebM fallback on target browsers/devices.
- Verify clipboard where available, denial/unsupported alternatives, failed export and unavailable storage. Capability probes alone do not prove paste interoperability.
- Run repository lint, type checking, relevant tests and production build. Inspect prerendered HTML without client JavaScript and mobile overflow.

## Out of Scope

- Accounts, cloud projects, collaboration, payments and server render queues.
- General video editing, uploaded video timelines, transcription and AI generation.
- Published article search, scraping, screenshot/document imports and source-corpus licensing.
- Forced ads, watermarks, new ad-network integration and competitor branding/assets.
- Changes to Posts, Local Admin or publishing.
- Guaranteed video clipboard support across every browser/destination.
- Implementation, commits, pushes or deployment as part of this specification task.

## Further Notes

- Competitor reference: https://www.textmatchcut.app/
- Inspected public script: https://www.textmatchcut.app/app.js. It generates fictional newspaper names, templated headlines and filler instead of fetching real articles.
- Stable version source: https://registry.npmjs.org/svelte/latest. Recheck before installation.
- Supplied screenshot establishes the avatar, handle and “Follow me on X” card pattern.
- Early technical validation must prove renderer font loading, audio/video export and mobile memory behaviour. Do not promise universal support before testing.
- Google Fonts contacts an external service. Keep privacy information accurate and preserve existing site consent behaviour.
- Track this specification and subsequent tickets as local Markdown files under docs/tickets. GitHub Issues is disabled and is not used for this workflow.

## Implementation and validation, 21 October 2026

- Implemented `/tools/text-match` with Svelte 5.57.2 and Astro-compatible `@astrojs/svelte` 8.1.2. Projects, fonts, rendering and exports stay browser-local. Google Fonts metadata, selected binaries and licences come from Google's public GitHub repository.
- Red/green checks cover deterministic focal alignment, fit warnings, project validation, draft recovery, cancelled reset, rejected imports, portable font uploads, stale font operations, export resource cleanup and editing locks during export.
- Repository validation passed: lint, Astro and Svelte type checks, 189 tests across 36 files, production build and whitespace checks. Existing Local Admin deprecation hint and build chunk-size/local Node 25 warnings remain. Deployment targets Node 24.
- Chromium desktop and 390px mobile emulation checked in light/dark and reduced-motion modes. No horizontal overflow. Editor-scoped WCAG A/AA axe audit reports zero violations or incomplete checks. Existing footer contrast findings are outside the editor.
- Actual MP4 decoded as H.264, 1080 × 1920, approximately 3 seconds, with non-silent AAC when sound is enabled. Forced MP4 capability refusal produced a real VP9/Opus WebM and the labelled fallback. Square and landscape files decoded at 1080 × 1080 and 1920 × 1080.
- Decoded focal regions compared with the shared renderer at 0.5, 1.5 and 2.5 seconds. Mean absolute RGB error was 3.07–3.83 out of 255 after lossy encoding. Inspected output contains no guides, promotion or watermark.
- Verified catalogue-only browsing, selected Roboto loading and a fresh-session offline project import with its embedded font. Invalid imports preserve the current draft; unavailable storage shows an actionable warning. Prerendered HTML contains the guide, canonical URL and follow card; sitemap includes the route.
- Standards and specification reviews completed. Findings fixed include font limits, stale font registration, repeated local uploads, recovery after font failure, vertical fit, clipped print columns and editing during export.
- Remaining acceptance: physical Safari/iOS/Android export and memory behaviour, manual listening, native sharing and video paste interoperability in real destinations. These have not been claimed as verified. Real-time recording requires a visible tab and timing can vary with device load. Local font uploads require confirmed embedding permission; system fonts can vary across devices.
- No push or deployment performed.

## UI correction

- Replaced repeated slogans with a short description and plain control copy. Reduced the header, grouped presets in one row, collapsed advanced controls and brought Export into the first desktop viewport.
- Added a separate preview surface, turned guides off by default and corrected the invalid form font shorthand. Kept controls labelled and keyboard accessible. Range readouts round to two decimal places; the counter identifies cuts rather than frames.
- Reduced oversized print, adjusted columns for portrait output, fitted complete headlines inside the margins and cleared surrounding text behind the focal line. New projects use a fictional local news story; existing drafts remain unchanged.
- Red: a rendering regression showed the default headline exceeded the print margins. Green: the complete headline fits. All 190 tests pass, with lint, type checks and production build passing.
- Browser checks cover desktop, light/dark, reduced motion and 320/390px layouts without overflow. Editor accessibility audit reports zero violations or incomplete checks. An updated MP4 decoded at 1080 × 1920 and approximately three seconds; sampled focal regions match the shared renderer within normal encoding loss.
- Physical-device and destination-paste acceptance remains outstanding as listed above. UI corrections are uncommitted.

## Font UI simplification and video recut

- Removed the provider-branded browse action. Focusing font search loads the catalogue once; curated fonts remain available immediately. Provider and network details stay in the privacy policy.
- Removed the cut counter, redundant preview instructions, duplicate export status and typed font-licence field. Uploads still require embedding permission. Shortened labels and placed Theme beside preview dimensions.
- Replaced the miniature page renderer with close text crops. The phrase sits on the same baseline as surrounding words. Seeded cuts change context, print scale, source serif and slight scan angle while keeping the focal centre fixed. The chosen font applies to the focal phrase; surrounding type follows the print preset. Headlines appear in occasional source crops rather than every frame. No mastheads or artificial blank strip behind the phrase.
- Red/green coverage verifies inline context, deterministic crops, stable focal placement, long-text warnings, edge fit and empty surrounding text. Font search, recovery, import safety, upload and export-lock workflow checks remain covered.
- Browser font search and real Lora selection passed without provider-branded controls. A 320px layout has no overflow; the editor accessibility audit reports zero violations or incomplete checks. Recorded and visually inspected a new H.264 MP4 at 1080 × 1920, approximately three seconds. A temporary review clip is at `/private/tmp/text-match-recut.mp4`.
- Final lint, Astro/Svelte type checks, all 191 tests and production build pass. All four presets render successfully in portrait, square and landscape. Three decoded video samples place the marker centre within half a pixel of the frame centre.
- Existing device and destination-paste limitations remain. No commit, push or deployment for these revisions.

## Borderless UI and announcement draft, 22 October 2026

- Removed the editor card, preview mat, decorative borders and section separators. Controls sit directly on the page; focus outlines and optional safe-area guides remain functional.
- Added Bits UI primitives for the searchable font combobox, collapsible settings and preset radio group. Font search and selection share one field. Export locking, font failures and stale requests preserve the current project and displayed selection.
- Red/green coverage verifies keyboard font selection, Escape, preset and section navigation, same-font weight recovery and failed/stale font display restoration. Lint, Astro/Svelte checks, all 195 tests across 36 files, production build and whitespace checks pass.
- Desktop borderless layout visually inspected. Final browser recheck stalled in the automation session; physical-device acceptance remains outstanding. Existing build warnings concern chunk size and local Node 25 versus the target Node 24.
- Announcement written by a delegated agent at `src/content/blog/text-match.mdx`, reviewed and retained with `status: draft`. Production build excludes its public post route. No publication, commit, push or deployment.
