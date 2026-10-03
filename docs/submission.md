# Ready submission text — DayBridge

Status: preparation only. No Devpost registration, contest submission, eligibility attestation or award is claimed.

## Title / tagline

DayBridge — A calmer tomorrow, from one conversation.

## Primary track

Alexa+ alternate simulation route. No mini challenge selected: this build uses no AWS runtime and no separate additional open-source contribution is claimed.

## Inspiration

A calendar can look valid while a day is impossible: a meeting ends after travel to school pickup must start, a report deadline needs protected focus, and a family handoff still needs communication. DayBridge explores an assistant that connects these facts and shows its follow-through. This is a design hypothesis illustrated with synthetic data, not a claim of completed user research.

## What it does

The user asks DayBridge to rescue tomorrow. It finds the review/travel conflict, proposes a reschedule, protects travel time, reserves report focus before the deadline, and prepares a family message. The user can preserve lunch or change pickup time across turns. Calendar changes remain in preview until approved. Sending the message needs separate consent. An injectable local transport outage demonstrates partial failure; retry executes only the failed action. Receipts distinguish a proposal, an applied calendar write, a failed delivery and a completed local delivery. Booking focus never marks the report completed.

## How we built it

A dependency-free JavaScript constraint planner and finite-state tool orchestration engine, responsive HTML/CSS UI, synthetic calendar/task/message adapters, browser localStorage and a loopback Node server. Intent parsing is deterministic and limited to the documented workflow. Codex assisted code and documentation creation. There is no live LLM, Alexa+ SDK, Echo, MCP server, cloud-provider calendar or real messaging connection.

## Accomplishments

The implemented workflow previews actual proposed changes, persists context, separates planning from execution, preserves fixed-event conflicts, rejects stale previews, protects message consent and records action-level outcomes. The automated tests exercise these properties instead of asserting only that the UI exists.

## Challenges / lessons

Plans must account for travel, not only event overlap. Revisions can make staged messages obsolete, so a new preview supersedes unsent old handoffs. A retry should use the execution ledger, not rerun the entire plan. The simulation route needs a clear boundary so a local receipt cannot be mistaken for live provider delivery.

## What's next

User interviews and accessibility trials; authenticated calendar/message adapters; timezone-aware event models; provider revision and idempotency support; richer language understanding. These are future work, not features of this submission.

## Product feedback (actual tool use)

| Tool | Used for | What worked | Limit / improvement | Onboarding / build again |
|---|---|---|---|---|
| Codex | Code, documentation, test authoring | Produced an inspectable zero-dependency project and iterated on testable invariants | Generated code still requires review; natural-language intent is deliberately bounded here | Available in the existing workspace; yes, with explicit evidence limits |
| Node.js | Local serving and node:test | Built-in modules remove installation and API-key barriers | Production authentication and provider adapters are absent | Run with npm start / npm test; yes |
| Browser DOM and localStorage | UI, durable simulation state and receipts | Works without signup or hardware; context survives refresh | Data is per-browser, unencrypted and can be cleared; no cross-device identity | Open the local app; yes for prototypes, replace storage for sensitive production data |
| Playwright | Development smoke tests and actual demo capture | Exercises real UI, persistence, outage and retry | Test browser is development tooling; no real Alexa hardware tested | Preinstalled development dependency; yes |
| FFmpeg | Convert the actual recorded demo and add English captions | Reproducible video packaging without music or external footage | No narrated or live-device footage is claimed | Preinstalled development tool; yes |

Amazon SDK/API feedback is not claimed because no gated Amazon tool was accessed. The FAQ confirms preview add-on tools are not generally available to hackathon participants.

## Feature requests

- **Important:** a public, zero-cost sample for simulation-route entries with transparent local-adapter receipts and clear consent examples.
- **Important:** clearer documentation distinguishing gated Alexa+ preview SDKs from the allowed alternate simulation route.

These are proposed improvements based on the rules/FAQ and this project design, not claimed observations from running a gated SDK.

## Testing instructions

Clone the source, install Node.js 20+, run `npm test` and `npm start`, and open http://127.0.0.1:4173. Use the README's walkthrough. No credentials or account invitations are required for a public licensed source repository.

## Sources / remaining submission requirements

- Official rules: https://amazonappdev2026.devpost.com/rules
- Official FAQ: https://amazonappdev2026.devpost.com/details/faqs
- Submission deadline: 23 October 2026 12:00 PDT / 24 October 2026 00:30 IST.
- Source repository: https://github.com/Nish916/daybridge-alexa-simulation
- Tested implementation baseline: `8d9134beceeeacfa25d65e4fe8ee705d5eae55c8`; 16 logic tests and 11 real-browser checks passed. Recording checks passed over 111.6 seconds of actual UI footage.
- Demo video must be public on YouTube/Vimeo and under three minutes. A local MP4 alone does not complete this requirement.
- Owner must confirm individual eligibility and authorize the contractual rules before final entry. No legal/tax/KYC forms are signed by this work.

Any advertised prize remains competitive and unapproved. No earnings or settlement is recorded from this preparation.
