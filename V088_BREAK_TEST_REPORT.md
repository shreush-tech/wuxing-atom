# Wu Xing v0.88 — Break Test & Integration Review

This pass deliberately tried to break the product rather than add decorative features.

## Major bugs found

### React hook-order bug
Both `PatientRail` and `SessionNotebook` could call `useMemo` only after a role/patient conditional return. Switching between Patient / Student / Professional could therefore change the order of React hooks and crash the component.

Fixed by making all hooks unconditional.

### Cross-patient draft contamination
The note and acupuncture-point fields lived in one shared component state. If the practitioner started a note for Patient A and switched to Patient B before saving, the text could appear under B.

Fixed by maintaining draft state keyed by `patientId`. Switching patients no longer transfers the draft.

### Acupuncture point identity bug
Brazilian notation and international notation could be stored as different points:
- F3 vs LV3
- IG4 vs LI4
- E36 vs ST36
- BP6 vs SP6
- R6 vs KD6
- VC6 vs REN6
- VG20 vs DU20

A canonical point parser now stores one internal identity and a pt-BR display code. Duplicate aliases collapse into one point.

### Clinical `minHits` bug
The book-rule engine intended to cap weak/incomplete pattern candidates when fewer than the configured minimum signs were present. The aggregate `raw` score was capped, but the main engine later re-added each evidence item individually, bypassing that cap.

The evidence contributions themselves are now scaled when the minimum-hit threshold is not reached, so the cap actually survives integration.

### WebGL context-loss blank screen
Mobile browsers can lose a WebGL context after GPU pressure, background suspension or memory pressure. The canvas now listens for `webglcontextlost` and falls back to the simplified Five-Element map instead of leaving a blank hero.

### Empty / malformed session records
Empty sessions and malformed acupuncture codes are now rejected. Session IDs and session numbers are both checked for duplication.

## Longitudinal workflow now tied together

Professional/student flow:

`choose patient → latest session snapshot loads → update symptoms → live 3D map changes → inspect supported imbalances → see verified clinician point cores → enter points actually used → add note → optional symptom burden 0–10 → save immutable visit snapshot → timeline/map-change comparison`

Patient mode clears the active professional patient identity and removes the chart UI.

## Historical interpretation

The product now separates two ideas:
- symptom-burden trend can be described as increasing/decreasing over sessions;
- Five-Element activity changes are described only as **map changes**, not automatically as clinical improvement/worsening.

This avoids turning an educational/traditional score into a biomedical outcome measure.

## Stress tests executed

### Clinical engine
20,000 randomized symptom-answer sets were run through the deterministic engine.

Checked:
- all pattern scores finite;
- confidence always 0–1;
- element visual metrics always 0–1;
- next-question IDs exist and contain no duplicates;
- all active pattern IDs exist;
- safety red flags suppress the traditional result.

Result: **0 invariant failures**.

### Workspace
100 synthetic patients × 10 sessions = **1,000 longitudinal sessions**.

Checked:
- session counts;
- chronological retrieval;
- duplicate session rejection;
- orphan session rejection;
- patient-mode privacy transition.

Result: **0 failures**.

### Corruption/migration
Malformed legacy demo data was injected deliberately. The sanitizer now:
- drops orphan sessions;
- clamps invalid element metrics;
- canonicalizes legacy point codes;
- recalculates session counts;
- clears invalid active-patient references.

### Static integration audit
31/31 v0.88 structural gates passed.

The entire project also passes TypeScript `--noEmit` with `noImplicitAny` disabled, which is the current preflight mode. Full strict typing still has historical debt from older files and shims, so strict-mode certification is not claimed.

## What I would attack next

1. Real browser runtime and GPU profiling over HTTPS.
2. Session-history comparison directly inside the single existing 3D scene.
3. Concurrency-safe server session creation and revision control.
4. Authentication/tenant permissions for physician, student and patient.
5. Clinical-knowledge contradiction matrix over all source-grounded pattern rules.
6. Regression paths for the full condition index, not only pattern-level fuzzing.

The product is materially more coherent after this pass, but it is deliberately **not** being called production-ready yet.
