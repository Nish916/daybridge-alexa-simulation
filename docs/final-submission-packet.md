# DayBridge — final Devpost entry packet (20 October 2026)

## Current submission status
- **Registered**: Devpost account Nish916 is registered for Build, Ship, Shape: Amazon Developer Hackathon.
- **Draft created**: DayBridge draft submission ID **1214043** (3 October 2026 confirmation email).
- **Final submission status**: **NOT CONFIRMED**. A public YouTube/Vimeo video URL, signed-in Devpost completion and any required eligibility declarations are outstanding.
- **Direct edit link (requires the entrant's Devpost login)**: https://devpost.com/submit-to/30992-build-ship-shape-amazon-developer-hackathon/manage/submissions/1214043-daybridge/edit
- **Deadline**: 23 October 2026, 12:00 PM Pacific Daylight Time (24 October 2026, 00:30 IST). Verify on the organizer's rules page.
- **Official rules**: https://amazonappdev2026.devpost.com/rules

## Judge links
- **Live web app**: https://daybridge-alexa-simulation.vercel.app
- **Public source repository**: https://github.com/Nish916/daybridge-alexa-simulation
- **MIT license**: https://github.com/Nish916/daybridge-alexa-simulation/blob/main/LICENSE
- **112-second functioning-browser demo MP4 (GitHub download only)**: https://github.com/Nish916/daybridge-alexa-simulation/releases/download/daybridge-hackathon-2026/DayBridge_Amazon_Hackathon_Final_Demo_2026.mp4
- **Captions, recording and browser check evidence**: https://github.com/Nish916/daybridge-alexa-simulation/releases/tag/daybridge-hackathon-2026

**IMPORTANT**: The GitHub MP4 proves the recording exists and is independently downloadable. It **does not** meet the required YouTube/Vimeo hosting condition by itself. Upload the MP4 to YouTube or Vimeo with public visibility and put that verified video URL into the Devpost entry.

## Devpost title
DayBridge — A Calmer Tomorrow, From One Conversation

## Tagline
A consent-first Alexa+ experience simulation that turns tomorrow's conflicts into auditable actions.

## Primary track
Alexa+ — permitted alternate **simulated Alexa+ experience**. This entry does not claim a live Alexa+ SDK, real Echo device, self-hosted MCP server or Amazon-managed agent integration.

## Inspiration
People often have calendars that appear valid but are impossible to execute. A school pickup requires travel before a meeting ends, a work report needs an uninterrupted focus block, and a family handoff still needs clear communication. DayBridge demonstrates how a bounded assistant could reconcile those needs while keeping the human in control.

## What it does
The user asks DayBridge to rescue tomorrow. It detects a conflict between a project review and school-pickup travel, previews a proposed reschedule, protects travel, reserves report focus before its deadline and drafts a pickup handoff message. The user can protect lunch or move pickup time in a follow-up turn. Calendar changes execute only after explicit approval, and sending the handoff requires separate consent. Injecting a synthetic message-delivery outage demonstrates a failure receipt and a safe retry that executes only unfinished, approved work. State persists after reload; booking a focus block does not pretend the report is finished.

## How we built it
DayBridge uses a dependency-free JavaScript planning and finite-state execution engine, a responsive HTML/CSS front end, browser localStorage, synthetic calendar and message adapters, and a loopback Node.js development server. The public site is statically hosted on Vercel. Codex AI assisted code and test authoring. It has deterministic, intentionally bounded phrase handling rather than a live LLM. All people, schedules, messages and receipts in the demo are synthetic; no third-party account messages or calendar writes occur.

## Accomplishments and validation
- A preview-before-approval workflow with preserved conversational context and fixed-event guards.
- Separate consent for calendar actions and handoff messages.
- Stale-preview protection, superseding obsolete handoffs and idempotent retry after a simulated outage.
- Structured receipts and exportable synthetic local evidence.
- 16/16 Node logic tests passed on 20 October 2026; 11/11 real Chrome-browser checks passed against the public deployment (including mobile layout and reload), with no page runtime errors.
- A 112-second continuous real-browser Playwright recording in MP4 format, under the three-minute limit, plus caption SRT.

## Product feedback (answer each developer-tool field)
1. **Codex** — AI-assisted code and documentation. Positive: accelerated a small, inspectable prototype and deterministic tests. Improvement: generated code needs careful human review, especially for consent, failure handling and product claims. Onboarding: accessible in the coding workspace. Use again: yes, with review and explicit scope.
2. **Node.js built-ins / node:test** — development server and zero-dependency logic tests. Positive: no API key and minimal installation. Improvement: no built-in identity, hosted state or provider integrations. Onboarding: install Node 20+ and run `npm test`, then `npm start`. Use again: yes for prototypes.
3. **Browser DOM and localStorage** — responsive UI and persistent local synthetic state. Positive: accessible demonstration without device/account linking. Improvement: data is browser-local, deletable, not suitable for sensitive real-user workflows. Onboarding: open the hosted page, no signup. Use again: yes for proof-of-concepts.
4. **Playwright and FFmpeg** — automated real-browser tests and the actual MP4 capture. Positive: reproducible actions, mobile checks and evidence; improvement: local setup depends on a browser and recording encoder; onboarding: install development tools separately from zero-dependency application; use again: yes.
No Amazon/Alexa+ preview SDK, MCP, Bedrock or other AWS API was used; do not claim real integration or enter AWS Builder mini-challenge.

## Optional Open Source mini-challenge contribution (separate from DayBridge)
- **GitHub username**: Nish916
- **Contribution URL**: https://github.com/Emmanuel-Ugochukwu1/auditpulse-core/pull/32
- **Original project repository**: https://github.com/Emmanuel-Ugochukwu1/auditpulse-core
- **Contributor's fork**: https://github.com/Nish916/auditpulse-core/tree/bounty-3-ttl-storage-fixtures
- **When**: PR opened 3 October 2026, within the contest window; status as checked 20 October: **open, not merged**.
- **Contribution and significance**: Added focused Soroban storage TTL edge-case fixtures and regression tests to exercise persistent and temporary storage expiration handling. The PR describes validation of its three targeted tests, build verification, safe fixture scans and 249-suite-test pass. It is a separate open-source test contribution; it does not add AWS runtime features to DayBridge and does not imply maintainer acceptance, reward, or merge.
- **Selection**: Choose the Open Source mini-challenge only if the Devpost form allows this separately contributed PR. The official rules state that unmerged PRs may count; judges decide eligibility.
- **Shopify note**: https://github.com/Shopify/ruby/pull/1050 was closed unmerged after an equivalent upstream fix https://github.com/ruby/ruby/pull/18871 was merged by another author. Do not present that duplicate fix as an accepted/paid PR.

## Video title for public YouTube/Vimeo upload
DayBridge | Alexa+ Experience Simulation | Amazon Developer Hackathon 2026

## Video description
DayBridge is a consent-first simulated Alexa+ household day planner. This 112-second screen recording shows an actual functioning web application: conflict detection, multi-step calendar planning, protecting lunch in a follow-up, explicit approval, a simulated handoff delivery outage, safe retry, auditable receipts and state persistence.

Live demo: https://daybridge-alexa-simulation.vercel.app
Source (MIT): https://github.com/Nish916/daybridge-alexa-simulation

This is a **simulation using synthetic data**; it is not a live Alexa+/Amazon SDK integration, and no real external messages are delivered. Produced with AI-assisted coding and actual browser capture.

## Final entry checklist — only mark after verified
- [x] Public source code and MIT license.
- [x] Public live app, returns HTTP 200.
- [x] Logic tests and Chrome/browser checks passed.
- [x] Actual MP4 video, 112 seconds, publicly downloadable from GitHub.
- [x] Devpost account registered and existing draft saved.
- [ ] Video uploaded and publicly visible on **YouTube or Vimeo**, URL verified.
- [ ] Public YouTube/Vimeo video URL populated in the existing Devpost draft.
- [ ] Track selection, project story, product feedback and code URLs populated.
- [ ] Optional Open Source mini-challenge selected and accurate contribution fields populated, if desired.
- [ ] Entrant reviews and accepts required terms / eligibility representations.
- [ ] Final **Submit** action completed and receipt/public confirmation verified.
No prize, payout, final entry or judge acceptance is claimed until documented.

## Optional evidence-backed friction log entries (contest form)
**Friction 1 — framework auto-detection on Vercel.** Task: host a zero-dependency static browser simulation. Expected: the project marked READY should render the front-end. Observed: the first automatically detected Node deployment marked READY but returned HTTP 500 FUNCTION_INVOCATION_FAILED on the live home route (20 October 2026). Severity: high, demo unavailable. Workaround: configure Vercel for static output with `vercel.json` (`framework: null`, `outputDirectory: "."`), redeploy and independently verify GET / and JS/CSS paths return HTTP 200. Actionable suggestion: report a root-route HTTP smoke check as an essential post-deploy gate rather than equating READY with user-facing health.

**Friction 2 — Playwright video encoder prerequisite.** Task: record a real automated end-to-end demo. Expected: Playwright's `recordVideo` records with the installed browser. Observed: `browserContext.newPage` failed because the separate Playwright FFmpeg binary was missing even though system FFmpeg and Chrome were installed (20 October 2026). Severity: medium, demo artifact blocked. Workaround: `npx playwright install ffmpeg`, rerun the real-browser recording; final 112-second MP4 verified. Actionable suggestion: include the recording encoder in the default install/preflight instructions, or display an explicit diagnostic before the browser session starts.

These are authentic observed engineering issues, not a claim of Amazon SDK access, a contest organizer defect, or a completed Devpost form.
