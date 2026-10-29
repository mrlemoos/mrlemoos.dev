---
name: find-rc
description: Finds root cause through reproducible evidence. Use when user reports bug, failure, regression, or unexpected slowness.
---

# Find root cause

Short evidence, no emojis. Read relevant context.md, Language.md, ADRs. Redact secrets from fixtures/logs. Inspect code to construct repro; no speculative fix before failing loop.

1. Build fast agent-runnable command asserting user's exact symptom. Prefer existing test; else HTTP/CLI/browser replay or minimal harness. Pin inputs/time/randomness. Flaky bug: measure elevated repro rate and run enough trials. Human-only trigger: explicit repeatable steps + recorded verdict.
2. Run command; show invocation + actual failure. Wrong symptom invalid. No runnable loop: list attempts, request missing access/artifact; stop hypotheses. Production instrumentation needs authorisation.
3. Minimise one input/step at time; rerun. Remaining pieces must explain failure. State justified limitation if further reduction impossible.
4. List ranked falsifiable hypotheses + predicted observations. Usually 3; fewer only with evidence ruling alternatives out. Show user, proceed unless new evidence changes ranking. One-variable probes; debugger first, targeted uniquely tagged logs second. No log-everything. Performance: baseline + profiler/timing + controlled comparison, measure before fix.
5. Search every caller of affected shared function. Correct seam must reproduce real caller pattern. Turn minimal repro into regression before fix; watch red. No suitable seam: document architecture limitation, retain runnable harness. Fix root cause once; watch green. Rerun original unreduced scenario + relevant checks.
6. Remove tagged instrumentation and temporary harnesses unless retained as explicit regression. Report cause, evidence, changed behaviour, limits. Never claim live proof from local tests.

After fix, recommend prevention; consequential architecture tradeoff merits ADR and scoped small-model review, e.g. Luna/Haiku if available. Spawn only when authorised. Never skip validation to save tokens.
