---
name: breakdown
description: Splits agreed change into local, independently verifiable tickets. Use when user requests breakdown, tickets, or work slicing.
---

# Breakdown

Read full source spec + linked local decisions. Inspect relevant context.md, Language.md, ADRs, callers/test seams. Missing source/access: report gap; never guess. Short prose, no emojis.

Draft complete vertical slices: narrow user behaviour through necessary layers + checks. Each fits fresh context, verifiable alone. Prefactor first only when needed to make slices safe.

Declare genuine blockers; no cycles. Independent work stays independent. Wide mechanical refactor exception: expand compatible form, migrate caller batches, contract after all batches. Keep checks green; if impossible, explicit integration branch + final integrate/verify ticket.

Show numbered titles, blockers, delivered behaviour. Ask granularity, missing dependencies, merges/splits. Wait for approved breakdown before writing tickets.

Write docs/specs/<feature>/tickets/<NN>-<slug>.md unless repo prescribes another local location. Dependency order, one file per ticket. Preserve parent spec; link it. No external tracker. Never close parent automatically.

Each ticket: status ready; parent; what to build; blocked by numbers/titles or none; acceptance checkboxes; validation command/seam; context/ADR links. No copied glossary, fragile code recipe, or omitted cross-layer work. Prototype contract snippet allowed with provenance.

Execute ready frontier, one ticket per fresh context when practical. Report evidence before marking complete. Failure/blocker stays explicit; token target never excuses missing behaviour.
