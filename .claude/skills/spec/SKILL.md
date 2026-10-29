---
name: spec
description: Synthesises agreed discussion into local change specification. Use when user requests spec, PRD, or implementation handoff.
---

# Spec

Synthesise existing discussion; no new interview. Read relevant context.md, docs/Language.md, domain context, ADRs, current behaviour. Mark missing decisions explicitly; never invent agreement. No emojis.

Prefer existing highest useful behavioural test seam. Confirm seam with user unless already agreed. New seam: explain need. Cover distinct user outcomes, edge cases, failures; skip repetitive story boilerplate.

Write docs/specs/<slug>.md unless repo prescribes another local path. Status: draft, active, complete, superseded, or abandoned. Include owner/domain, related ADRs, tickets, superseded-by when relevant.

Sections: problem; intended behaviour; acceptance checks; implementation decisions/contracts; test seam + commands/prior art; exclusions; unresolved decisions. Paths useful for navigation; avoid brittle implementation recipes. Prototype snippet only when clearer than prose; label provenance.

Recommend breakdown when change spans independently verifiable slices, substantial migration, or exceeds fresh agent context. Small coherent change stays single spec. Never manufacture ticket count threshold.

Consequential durable tradeoff: recommend ADR + scoped small-model research/review subagent, e.g. Luna/Haiku if available. Spawn only when authorised. Domain definitions belong in Language.md, not framework glossary.

Local Markdown only. Preserve existing files; revise deliberately, never overwrite unrelated spec. No tracker publishing. Completion needs acceptance evidence; age never proves staleness. Preserve decision rationale through linked ADRs before proposing spec deletion; deletion always explicit approval.
