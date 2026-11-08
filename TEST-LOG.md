# Parents Expense & Bill Tracker — TEST-LOG

Date: 2026-11-08. Tester: node test scripts only (no browser in this session).
Method: `node --check` on every JS file, then `node test-store.js`.
The tests run against a local mock KVdb server (`/tmp/mock-kvdb.js`, Node http,
in-memory, same PUT/GET/DELETE paths as KVdb and as the self-hosted backend
`GET/PUT/DELETE /v1/kv/:key`). The mock runs as a separate process so the
"fresh process" check is a genuinely separate `node` invocation. Live KVdb
was NOT tested — the KVdb account still needs email verification (parent
handles that); the mock verifies the exact URL shapes, headers and
round-trip flows the live code will use.

## Syntax
- `node --check store.js` — PASS
- `node --check app.js` — PASS
- `node --check config.js` — PASS

## `node test-store.js` — 19/19 PASS
| # | Check | Result |
|---|---|---|
| 1 | Sync code is 6 chars from the readable alphabet (no 0/O/1/I/L) | PASS |
| 2 | Two sync codes differ | PASS |
| 3 | Sync payload wraps the full dataset (version/app/state) | PASS |
| 4 | buildSyncPayload deep-copies (payload is not the input object) | PASS |
| 5 | PUT dataset under sync code returns true | PASS |
| 6 | Fresh process loads the dataset under the code | PASS |
| 7 | restoreSyncPayload accepts the payload | PASS |
| 8 | Restored state keeps all months/bills/goals/members/settings | PASS |
| 9 | Meter round-trips: 12730−12480 = 250 units, est. bill Rs 8,750 @ Rs 35/unit | PASS |
| 10 | Prediction round-trips: (8800+9500+9100)/3 = Rs 9,133 | PASS |
| 11 | GET unknown sync code returns null | PASS |
| 12 | restoreSyncPayload rejects null | PASS |
| 13 | restoreSyncPayload rejects a bare invalid object | PASS |
| 14 | restoreSyncPayload rejects an empty object | PASS |
| 15 | KVdb PUT dataset under a code returns true | PASS |
| 16 | KVdb PUT uses Content-Type text/plain and /{bucket}/{prefix}{code} path | PASS |
| 17 | KVdb GET round-trips the dataset (meters intact) | PASS |
| 18 | DELETE code then GET returns null | PASS |
| 19 | DELETE missing key returns false (no throw) | PASS |

Existing features (Urdu/English toggle, income/expenses/bills, prediction,
meter maths, goals, reminders, members, recurring, JSON/CSV export/import,
demo data) were not changed in behaviour — only sync was added, and the
prediction/meter maths above re-verify the demo numbers (250 units,
Rs 9,133) through the sync round-trip.

## Not tested here (needs a browser / live KVdb)
- The Sync section UI, confirm dialog and status/last-synced rendering in
  a real browser (DOM ids referenced by app.js were verified to exist in
  index.html: 68 ids, 0 missing).
- Live KVdb PUT/GET (blocked on the account's email verification).
- Meter photo upload through sync (photos are data URLs inside the state
  and therefore inside the payload; large photos make the payload large —
  noted in README only as a size caveat, not tested at scale).

© 2026 Mr. Abdul Rahman Dogar
