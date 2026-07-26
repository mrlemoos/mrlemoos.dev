# mrlemoos.dev

Personal site and writing. Content lives as files; the public site renders them.

## Language

**Post**:
A piece of writing stored as one MDX file with frontmatter and a Body. May be a Draft or live.
_Avoid_: Article, entry, document, page

**Local Admin**:
The authoring surface that edits Posts on the author's machine only, against the real content files. Available in development only — not shipped as a public production surface. Routes under `/admin` (list, new, edit by Slug).
_Avoid_: CMS, dashboard, studio, remote editor

**Body**:
The Post's MDX source below the frontmatter — the canonical text stored on disk.
_Avoid_: Content, markdown, document, rich text

**Live Preview**:
The TipTap editing surface itself — no separate rendered pane. Site chrome is checked by viewing the Post route, not inside Local Admin.
_Avoid_: Preview pane, split view, compiled preview

**Body dialect (v1)**:
CommonMark plus GFM (tables, strikethrough, task lists). Maths and JSX are out of scope for Local Admin round-trip until explicitly added later. Save is refused when TipTap serialisation would not round-trip the Body losslessly.
_Avoid_: Full MDX, rich text blob

**Save**:
Persists the Post to the local filesystem only, on explicit action (button / ⌘S). Does not create a git commit or update the remote. No autosave.
_Avoid_: Publish, sync, deploy

**Status**:
Frontmatter enum on a Post: `draft` or `live`. Missing status on older files means `live`. Public site only lists `live` Posts.
_Avoid_: draft (boolean), state, visibility, published (boolean)

**Publish**:
Makes a Post live: sets `status: "live"`, commits and pushes only that Post's path(s) on `main` with `docs(blog): add|update "{title}"`. Refused off `main`.
_Avoid_: Save, deploy (deploy is Vercel's reaction to Publish)

**Draft**:
A Post with `status: "draft"` — on disk but not for the public site until Published. Same blog content folder as live Posts. Stays local until Publish (no separate draft-sync action in v1).
_Avoid_: Unpublished, WIP, temp

**Unpublish**:
Sets `status: "draft"` on a live Post and commit+pushes that change on `main`. Does not delete the file.
_Avoid_: Delete, archive, take down (ambiguous)

**Slug**:
The Post's public URL segment and file identity (`/blog/{slug}` ↔ `{slug}.mdx`). Derived from the title on create; editable while Draft; frozen after first Publish.
_Avoid_: ID, filename, path, handle

**Title**:
The Post's display name stored in frontmatter. Local Admin shows it as TipTap's H1 for editing, but Save writes it only to frontmatter and does not persist a leading H1 into the Body on disk.
_Avoid_: Headline, name

**Date**:
The Post's original publication chronometer in frontmatter. Set on create; not changed by Save or later Publishes unless manually overridden.
_Avoid_: Created at, published at

**Updated**:
Optional frontmatter chronometer for when a live Post last changed. Stamped on Publish after the Post has already been public once; unused while still a Draft.
_Avoid_: Modified, edited at

**Delete**:
Removal of a Draft from Local Admin. Live Posts cannot be deleted here. Untracked Drafts are unlinked locally; tracked Drafts are unlinked and pushed to `origin/main` like Publish (removal commit).
_Avoid_: Archive, unpublish, soft delete
