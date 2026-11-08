/* Parents Expense & Bill Tracker — server store config.
   localStorage stays the local cache; the sync code (see app.js)
   is the bridge that moves the full dataset to another device
   through the live backend at apiBase (Vercel + Vercel Blob,
   durable storage). Set apiBase to "" to fall back to KVdb
   directly. The bucket id is a random identifier, not a secret.
   © 2026 Mr. Abdul Rahman Dogar */
window.APP_CONFIG = {
  bucket: "Lnt8CwUeMKLsaBKKYDiq9L",
  prefix: "pt:",
  apiBase: "https://apps-backend-tahqeeq.vercel.app"
};
