# 🏠 Parents Expense & Bill Tracker
### والدین خرچ اور بل ٹریکر

A simple, premium, **offline** web app for a parent to track household money — income, expenses, bills, meter readings, savings goals and reminders. Big buttons, large text, Urdu + English. No account, no password. All data stays on the device (localStorage) unless you choose to share it with a **sync code** — see "Sync / دوسرے آلے پر کھولیں" below.

> والدین کے لیے ایک آسان، خوبصورت اور مکمل آف لائن ایپ — گھر کی آمدنی، خرچے، بل، میٹر ریڈنگ، بچت کے اہداف اور یاد دہانیاں۔ بڑے بٹن، بڑا متن، اردو اور انگریزی۔ کوئی اکاؤنٹ نہیں، کوئی پاس ورڈ نہیں، ڈیٹا صرف آپ کے آلے پر رہتا ہے — جب تک آپ خود سنک کوڈ سے دوسرے آلے پر نہ کھولیں۔

---

## ✨ Features / خصوصیات

| Feature | What it does |
|---|---|
| 💰 Monthly income | Multiple sources — salary, pension, business, other — with date and note |
| 🛒 Expenses by category | Groceries, transport, medicine, school, eating out, other — with date, amount, note, and who spent it |
| 🧾 Monthly bills | Electricity, gas, water, internet, phone, rent, other — amount, due date, paid / unpaid, one-tap "Mark Paid" |
| 🔮 Next-month bill prediction | Average of the last 3 months for the same bill type, with an up / down / same trend vs last month |
| ⚡ Meter photo + reading | Upload / take a photo of the electricity or gas meter (photo is compressed and stored on-device), enter the reading; the app compares the last two readings, shows units used and the estimated bill at the per-unit rate from Settings |
| 🎯 Savings goals | Create a goal (e.g. Hajj, new fridge), target amount, add money, progress bar, remaining amount |
| 📊 Monthly summary + charts | Total income, expenses, bills, balance left; bar chart by category and donut chart of money split — pure CSS/JS, no CDN, works offline |
| ⏰ Reminders | Bill due-date reminders on the dashboard: overdue, due today, due in 3 days — toggleable in Settings |
| 👨‍👩‍👧‍👦 Family members | Add family members, assign expenses to a member, see each member's total spending |
| 🔁 Recurring expenses | Monthly recurring entries (e.g. internet, milkman) — one tap adds them all for the selected month |
| ⬇️⬆️ Export / Import | Export all data as JSON (full backup) or CSV (spreadsheet); import a JSON backup to restore |
| 🔄 Sync (sync code) | Create a 6-character sync code to open the full dataset on another device; loading from a code replaces the local data (after a confirm). localStorage stays the local cache — every change still saves locally first |
| 🌐 Urdu / English toggle | Full UI switch, default **Urdu** (RTL), English (LTR) |
| 🔒 Offline & private | Everything in `localStorage`; works with no internet; a clear note in the app says data stays on the device |
| 🎁 Demo data | One tap loads clearly-labelled realistic demo data (Nov 2026, Rs amounts); removable from Settings without touching your own data |

## 🚀 How to run / کیسے چلائیں

No build step, no install, no server needed.

1. Download / copy this folder.
2. Double-click **`index.html`** — it opens in any modern browser (Chrome, Edge, Firefox, Safari).
3. Or serve it locally (optional, same result):
   ```bash
   # Python
   python3 -m http.server 8000
   # then open http://localhost:8000
   ```
4. That's it. Start with **🎁 Demo Data** (top-right) to see everything working, then remove it from **Settings → Remove Demo Data** and add your own entries.

> **Try the demo (verified numbers):** load demo data, switch the month to **2026-11**, and you will see income Rs 100,000, expenses Rs 25,800, bills Rs 41,400, balance Rs 32,800, a prediction for electricity (Rs 9,133), a meter comparison (250 units, ~Rs 8,750 at Rs 35/unit), two savings goals, and 4 bill reminders.

## 🔄 Sync / دوسرے آلے پر کھولیں

Data lives in localStorage on one device — the sync code is the bridge to another device. No account, no password.

1. On the device that **has** the data, open **🔄 Sync** and press **"سنک کوڈ بنائیں / Create Sync Code"**. A 6-character code appears (e.g. `K7Q2XA`) and the full dataset — all months, bills, meter readings (including photos), goals, members, recurring expenses and settings — is saved on the server under that code.
2. On the **other** device, open the same section, type the code and press **"کوڈ سے ڈیٹا لادیں / Load Data from Code"**. The app asks for confirmation first, because loading **replaces** that device's data with the synced data.
3. The section shows the last-synced time and an honest status line ("Sync code created ✓", "That code was not found", "Could not reach the server").

Notes:
- The code is the only key — anyone with the code can load the data, so share it only with family, e.g. by reading it aloud or in a private message. Codes use an easy-to-read alphabet (no 0/O/1/I/L).
- After loading on the second device, that device has its own local copy; later changes on one device do **not** automatically appear on the other — create a fresh code from the device with the newest data and load it on the other one.
- The server store is configured in `config.js` as `APP_CONFIG = { bucket, prefix: "pt:", apiBase: "" }`. With `apiBase` empty the app talks to KVdb directly; set it to the self-hosted backend URL later and the same code talks to that instead.

## 📱 How to use (in 30 seconds)

1. Pick the month at the top.
2. Add income, then an expense, then a bill — each form is one big button.
3. Add a meter reading (photo optional) — the comparison appears below the form.
4. Create a savings goal and add money to it whenever you can.
5. Check the dashboard reminders before a bill's due date.
6. Back up from **Settings → JSON / CSV** once a month.

## 🛠️ Tech

- Single-page static app: `index.html` + `styles.css` + `app.js` (+ `config.js` for the server store, `store.js` for the KVStore data layer)
- Vanilla JS only — no frameworks, no CDN, no build step
- Storage: `localStorage` key `parentsExpenseTracker.v1` (meter photos are down-scaled to max 800px JPEG before storing, so storage stays small); sync copies the same state to KVdb under a 6-character code (`config.js` → `APP_CONFIG`, prefix `pt:`)
- Charts: plain CSS bar chart + `conic-gradient` donut — nothing to break offline

## 📁 Files

```
parents-expense-tracker/
├── index.html    # App UI (Urdu default, RTL)
├── styles.css    # Premium, large-text, responsive styling
├── config.js     # Server store config (APP_CONFIG: bucket, prefix, apiBase)
├── store.js      # KVStore: PUT/GET/DELETE against KVdb or apiBase
├── app.js        # All logic: i18n, CRUD, prediction, meter math, export/import, sync
├── test-store.js # Node tests against a local mock KVdb server (see TEST-LOG.md)
├── TEST-LOG.md   # Test results
├── README.md     # This file
├── LICENSE       # MIT
└── .gitignore
```

## 🔮 Prediction & meter maths (so you can check it)

- **Prediction:** for a bill type, take the totals of the last 3 months that have data, average them, round to the nearest rupee. Trend compares the latest month with the one before it.
  - Example (demo): electricity Sep 8,800 + Oct 9,500 + Nov 9,100 = 27,400 ÷ 3 = **9,133** (trend ↓, since Nov 9,100 < Oct 9,500).
- **Meter:** units = latest reading − previous reading; estimated bill = units × per-unit rate (Settings: electricity Rs 35/unit, gas Rs 25/unit by default).
  - Example (demo): 12,730 − 12,480 = **250 units** × 35 = **Rs 8,750**.

## ⚠️ Notes

- Data lives in the browser's localStorage on **one device** — use **🔄 Sync** (sync code) or **Export JSON** to move it to another device.
- Clearing browser data for this site will erase the app's data — keep a JSON backup, or a sync code from the device with the newest data.
- Demo data is removed by id (tracked when loaded), so your own entries are never deleted by "Remove Demo Data".

## 📄 License

MIT — see [LICENSE](LICENSE). © 2026 Mr. Abdul Rahman Dogar.
