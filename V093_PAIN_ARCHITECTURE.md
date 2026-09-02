# v0.93 — Pain tracking

Pain is now an independent longitudinal clinical dimension.

A patient can mark “Dor hoje”, add one or more anatomical locations in free text, and assign a 0–10 intensity to each location. This is deliberately separate from the TCM pattern engine: generic pain does not automatically create an Element or Pattern score.

Specific symptom items such as low-back pain can still participate in the diagnostic engine when their existing rules support it. The independent pain field remains available for pain that is clinically important but not necessarily element-specific (shoulder, hallux, tennis/golfer elbow, etc.).

Each session stores an array of pain entries, allowing different sites to be followed independently over time. Timeline displays the recent 0–10 values per normalized pain location.

This preserves the distinction:
- pain as a patient-reported outcome;
- pain features that are diagnostically relevant to TCM patterns.
