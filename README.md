# DayBridge

A calmer tomorrow, from one conversation.

DayBridge is an **Alexa+ experience simulation** for Amazon's Build, Ship, Shape 2026 hackathon. It reconciles a synthetic household calendar, a report deadline and a pickup handoff. The workflow maintains context across turns, previews changes, requires calendar approval, asks separately before message delivery, and retries failures without repeating completed work.

## Run and test

Requirements: Node.js 20 or later. There are no npm dependencies, API keys, cloud services or paid devices.

```sh
npm test
npm start
```

Open http://127.0.0.1:4173. For a different port: `PORT=4174 npm start`.

## Judge walkthrough

1. Choose **Rescue tomorrow**. The planner finds the review/travel conflict and proposes changes without writing them.
2. Choose **Protect lunch**. The follow-up changes the plan while preserving context.
3. Optionally choose **Pickup at 3:30** and observe recalculated travel and report time.
4. **Apply calendar plan**. Actual local calendar changes execute; Sam's message is staged, not sent.
5. Enable **Test one message delivery outage**, then **Approve handoff message**. A local adapter intentionally fails and produces a failure receipt.
6. **Retry failed actions**. Only the failed message runs; completed calendar writes do not repeat.
7. Export JSON and inspect the receipts. Reload to verify persisted state. Reset restores fixtures.

## What is real, and what is simulated

The UI, constraint planner, local adapter writes, consent state, idempotency, local persistence, failure injection and receipts execute in the browser. All household data and recipients are synthetic. A deterministic intent router accepts the documented phrases; this is **not a live Alexa+, Echo, LLM, MCP server or Amazon SDK integration**. No real emails, texts, calendar providers, purchases or account connections are used. The app does not claim open-ended language comprehension. A report focus block leaves the task unfinished.

The alternate Alexa+ simulation route in the official rules is the intended entry path. Organizer eligibility and acceptance remain unconfirmed until an actual entry is reviewed.

## Development disclosure

This project was newly created on 3 October 2026 UTC / 4 October IST with Codex AI coding assistance. The code and documentation are generated with AI assistance; no user interview, live-provider execution or human-only coding contribution is claimed. No employer or customer materials are used. This project is distinct from the separately proposed WCC lead-handoff monitor.

## Architecture

- `engine.mjs`: bounded conversational context, constraint planning, consent, synthetic adapters and execution receipts.
- `app.mjs`: DOM rendering using text nodes, browser persistence and evidence export.
- `index.html` / `style.css`: responsive web experience with keyboard-accessible controls and text explanations.
- `server.mjs`: dependency-free local static server bound to loopback.
- `test/engine.test.mjs`: planner invariants, consent, stale previews, retry behavior, idempotency and invalid input.

Production work would require real authenticated calendar/messaging adapters, robust timezone support, source revisions from providers, encrypted storage, provider idempotency, richer natural-language understanding and accessibility evaluation with users. This prototype deliberately keeps those limits explicit.

See [submission packet](docs/submission.md) and [demo storyboard](docs/demo-storyboard.md). MIT licensed; no brand logos or third-party media are included.
