# Wu Xing v0.86 — Deep Review / QA

## Scope
This pass reviews three systems together:
1. theoretical/educational content,
2. symptom/diagnostic knowledge tree,
3. 3D interaction and rendering architecture.

## Important bugs found and fixed

### 1. Safety red-flag mismatch
The symptom tree already contained patient-friendly red flags such as chest pain radiating to the arm and facial weakness, but the SafetyGate only blocked separate internal IDs such as `severe_chest_pain` and `new_neuro_deficit`.

**Risk:** a user could select a clinically important warning cluster and still receive the traditional map.

**Fix:** the SafetyGate now also intercepts:
- chest pain radiating to the arm,
- chest pain + cold sweat,
- chest/shoulder-back radiation with breathlessness/cold sweat,
- new facial weakness.

Synthetic tests now confirm that these scenarios block the traditional result.

### 2. Invisible 3D relationship hit target
`RelationshipTapTarget` used a large invisible torus with pointer interception.

**Risk:** on touch screens it could steal taps intended for the Yin–Yang core or element vessels.

**Fix:** removed the relationship hit target from the patient Scene. The internal relationship engine remains available without creating a hidden touch obstacle.

### 3. Relationship narrative still visible
The EducationSection could show a relationship title/explanation.

**Fix:** patient-facing education now shows a supported TCM imbalance/pattern only, without an “interaction in evidence” narrative.

### 4. Duplicate symptom labels
Two distinct contextual symptoms used the identical label “Piora no fim do dia ou à noite”.

**Fix:** they are now disambiguated as digestive worsening vs pain worsening.

## Theoretical review

A structured education layer was added for:
- Yin–Yang,
- Fire / Heart–Small Intestine / Shen,
- Earth / Spleen–Stomach / Yi,
- Metal / Lung–Large Intestine / Po,
- Water / Kidney–Bladder / Zhi,
- Wood / Liver–Gallbladder / Hun.

The UI uses progressive disclosure:
- short intuitive sentence,
- organ pair,
- core themes,
- spirit/mental dimension,
- expandable advanced section.

The source is intentionally invisible in the product UI, while provenance remains internal.

## Yin–Yang interaction review

The core now:
- has opposite seeds implemented correctly,
- remains inside a translucent glass lens,
- is clickable,
- opens an educational bottom sheet,
- teaches relativity/interdependence/transformation,
- explains excess heat vs deficiency heat without presenting the animation as a physiological measurement.

## 3D rendering review

Changes:
- Fire canonical apex retained.
- Removed hidden relationship touch collider.
- Added ACES filmic tone mapping.
- Added quality-tier transmission resolution scaling.
- Kept motion delta-time based.
- Kept expensive glass/refraction quality adaptive.
- Core interaction now stops propagation so a core tap is not confused with background rotation.

The Three.js renderer currently exposes `transmissionResolutionScale`; lowering it can significantly improve performance when transmission materials are used. This is now tiered for low/medium/high devices.

## Clinical-tree enrichment

Added secondary-source anamnesis rules with lower/controlled authority than book treatment tables. New high-information questions include:
- near-total insomnia,
- marked agitation,
- large cold gulps,
- small sips,
- early-morning (~5am) diarrhea,
- low-pitched tinnitus,
- fixed-theme nightmares,
- changing-theme nightmares.

The transcript layer enriches evidence; it does not delete or silently overwrite book-grounded evidence.

## Synthetic regression results

Expected top pattern:
- Spleen Qi cluster → `spleen_qi`
- Liver Qi stagnation cluster → `liver_stagnation`
- Kidney Yin cluster → `kidney_yin`
- Kidney Yang cluster → `kidney_yang`
- Lung Qi cluster → `lung_qi`
- Heart Fire transcript cluster → `heart_fire`

Safety:
- chest pain radiating to arm + cold sweat + breathlessness → map blocked
- facial weakness / new neurological warning → map blocked

## Static gates
- 12/12 v0.86 source/UI gates pass.
- TypeScript relaxed/preflight compilation passes.
- 207 symptom IDs are unique.
- 61 pattern IDs are unique.
- duplicate visible symptom label found in this pass was corrected.

## Remaining technical debt before production claim

1. Full strict TypeScript mode still has historical typing debt caused largely by broad preflight shims and `any`-typed component boundaries.
2. A real Vite/browser build still needs installed npm dependencies.
3. Visual correctness of glass/transmission and touch handling must be evaluated in real Safari over HTTPS.
4. GPU timing/FPS and WebGL context-loss recovery still require device testing.
5. The entire 170-entry clinical index has not yet been regression-tested end-to-end.

## Test recommendation

Do **not** call this production-ready yet. The next meaningful gate is a real HTTPS Safari test after a build-capable environment is available. At that point test:
- 30–60 seconds idle motion,
- repeated drag/release,
- pinch zoom,
- tap Yin–Yang core,
- tap each element near crossing golden arcs,
- rotate while panel opens/closes,
- low-power/mobile quality tier,
- background/foreground browser transitions,
- orientation portrait → landscape → portrait,
- safety red-flag journeys,
- early-result vs refine flows.
