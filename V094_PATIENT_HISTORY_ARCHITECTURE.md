# v0.94 — Individual patient history

Each patient owns an isolated sequence of immutable session snapshots. The History workspace provides:
- overview;
- longitudinal Five Movements chart;
- symptom-burden trajectory;
- pain trajectories separated by anatomical location;
- independent TCM-pattern evolution;
- complete session list;
- reopening of the exact historical map.

Prototype persistence can be enabled with `?demoStorage=1`; it saves the workspace in browser localStorage in the background. This is intentionally DEMO ONLY. Production clinical data requires authenticated server storage, tenant/user authorization, encryption/policy controls, audit logs, backups, deletion/export flows and LGPD review.

The Five Movements graph is a longitudinal visualization of the app's element-state snapshots. It must not be described as a biomedical measurement or proof of improvement. Pain remains a patient-reported 0–10 outcome and generic pain does not automatically alter TCM pattern scores.
