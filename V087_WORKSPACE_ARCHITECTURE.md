# Wu Xing v0.87 — Longitudinal Clinical Workspace

## Product model

The same 3D engine now supports three experiences without turning the main screen into a conventional medical-record UI.

### Patient
The person explores their own symptoms and dynamic Five-Element map. No patient list is visible.

### Student
A discreet patient/case rail appears. The student can maintain a small list of cases, reopen the latest map, register sessions and compare evolution.

### Physician
The same rail scales to a professional patient workspace: search by name, open a chart, review the latest Five-Element state, change symptoms at the new visit, register points actually used, add notes and save the session as a longitudinal snapshot.

The patient rail is intentionally hidden behind a small glass button. It is not a permanent wide sidebar.

## Longitudinal model

Every session stores an immutable clinical snapshot:
- symptoms and answers at that visit;
- reported clinical diagnoses/context;
- supported TCM patterns;
- five element visual state;
- global symptom-burden score (0–10, optional);
- clinician points actually used;
- map-recommended clinician point cores when available;
- clinician note;
- engine/knowledge version in the future backend.

This means Session 10 can be compared with Session 1 even after the diagnostic engine evolves.

## Critical separation fixed in this pass

The clinician notebook **does not** recycle the patient's at-home acupressure recommendations as if they were an acupuncture treatment plan.

A separate `clinicianPointCore` kernel was introduced. It currently recommends only the pattern cores that have already been explicitly extracted/verified in the reference-book treatment tables. If a supported pattern does not yet have a verified clinician core in the database, the interface shows no fabricated recommendation.

The clinician can always document the points actually used independently of what the engine suggested.

## Patient evolution

The first longitudinal metric is deliberately simple and interpretable:
`global symptom burden 0–10`.

A trend graph is shown across sessions. Each saved visit also keeps the complete element state, so the next layer can animate:
- Session 1 Five Elements
- Session 5 Five Elements
- Session 10 Five Elements

without pretending the element score is a biomedical biomarker.

## Privacy-by-design prototype behavior

The default v0.87 repository is memory-only. Patient names and clinical notes disappear on refresh.

Persistent browser storage exists only behind the explicit query flag:
`?demoStorage=1`

and is labeled as demo-only/non-production.

For the commercial online product, data must move to authenticated tenant-isolated server storage. A PostgreSQL reference schema is included in `DATABASE_SCHEMA_V087.sql`.

## SaaS authorization target

Professional/student accounts:
`user → organization → membership/role → permitted patients → sessions`.

Patient accounts:
`user → own patient record → explicitly shareable result/session fields`.

A student should not automatically inherit access to a clinic's full patient population.

## Performance principles

- Opening the rail does not unmount/remount the 3D scene.
- Patient search renders at most the first 40 matching rows in this prototype.
- Historical sessions are compact snapshots, not duplicate scene graphs.
- Timeline is SVG, not another WebGL canvas.
- The Five-Element renderer keeps a single live state: the active visit.
- Historical 3D comparison should interpolate snapshots in the same existing scene rather than instantiate multiple 3D scenes.

## UX hierarchy

1. 3D map remains hero.
2. symptom exploration remains primary interaction.
3. when professional/student mode is active, patient identity is a small contextual control.
4. session notes appear only after a patient is selected.
5. timeline is below the result, not beside the atom.
6. detailed EHR-like history remains progressively disclosed.

## Next validation gate

Before commercial deployment:
- real database/auth integration;
- role/tenant authorization tests;
- encrypted/protected sensitive fields;
- audit trail;
- session versioning;
- Safari HTTPS 3D profiling;
- test 50 / 500 / 5,000 patient-list behavior;
- interruption/reconnect tests while saving a session;
- conflict handling for two practitioners editing the same patient;
- export/delete/retention workflow;
- patient-sharing permission model.
