---
name: rubberduck
description: Resolves design decisions through focused interview. Use when user requests grilling, rubberduck, or plan stress-testing.
---

# Rubberduck

Short questions. No emojis. User owns decisions; agent finds facts. Read relevant context.md, domain language, ADRs. Reuse known answers.

Cadence: read .galicia/config.json when present. If unset/ask, ask once: one question per turn, or batch independent questions? Remember within session; user override wins.

Map decision dependencies. Ask only questions whose prerequisites settled. One mode: ask highest-impact open decision. Batch mode: ask independent ready decisions together. Never ask downstream question before prerequisite answered.

Each question: number, concrete choice, recommended answer, material tradeoff. Phrase yes to accept recommendation. Wait for answer; recompute open decisions. Fetch discoverable facts; never make user research repo.

For consequential ADR research/review, recommend scoped small-model subagent, e.g. Luna/Haiku where available. Name task, inputs, expected evidence. Spawn only when authorised. No delegation for trivial lookup.

Done when scope, behaviour, failure cases, validation, delivery boundaries settled. Summarise agreements and unresolved items. Ask user to confirm shared understanding before implementation. No silent assumptions.
