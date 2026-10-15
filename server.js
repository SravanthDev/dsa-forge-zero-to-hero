/**
 * DSA Forge — MongoDB Progress API Server
 * Exposes GET /progress and PUT /progress to store user progress in MongoDB.
 * Also serves the HTML file at GET / so you can open http://localhost:3001
 */

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { MongoClient } = require('mongodb');

const app  = express();
const PORT = process.env.PORT || 3001;
const URI  = process.env.MONGODB_URI;
const DB   = process.env.DB_NAME         || 'dsa_forge';
const COL  = process.env.COLLECTION_NAME || 'progress';

// ── A single user ID so progress is always loaded from the same document ──
// If you ever want multi-user support, replace this with a proper auth system.
const USER_ID = 'default_user';

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '4mb' }));   // state JSON can be large

// ── Serve the HTML file at the root ────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dsa_forge_zero_to_hero.html'));
});

// ── MongoDB connection (shared client) ─────────────────────────────────────
let col; // will be set once connected

async function connect() {
  const client = new MongoClient(URI, {
    connectTimeoutMS: 10_000,
    serverSelectionTimeoutMS: 10_000,
  });
  await client.connect();
  col = client.db(DB).collection(COL);
  // ensure an index on userId for fast lookups
  await col.createIndex({ userId: 1 }, { unique: true });
  console.log(`✅  Connected to MongoDB  →  ${DB}.${COL}`);
}

// ── GET /progress — load the current user's progress ───────────────────────
app.get('/progress', async (req, res) => {
  try {
    const doc = await col.findOne({ userId: USER_ID });
    if (!doc) return res.json({});          // first visit, empty state
    const { _id, userId, updatedAt, ...state } = doc;
    res.json(state);
  } catch (err) {
    console.error('GET /progress error:', err);
    res.status(500).json({ error: 'Failed to load progress' });
  }
});

// ── PUT /progress — save (upsert) the entire state object ──────────────────
app.put('/progress', async (req, res) => {
  try {
    const state = req.body;
    if (typeof state !== 'object' || Array.isArray(state)) {
      return res.status(400).json({ error: 'Body must be a JSON object' });
    }
    await col.updateOne(
      { userId: USER_ID },
      { $set: { ...state, userId: USER_ID, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /progress error:', err);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// ── Boot ────────────────────────────────────────────────────────────────────
connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀  DSA Forge server running at http://localhost:${PORT}`);
      console.log(`    Open http://localhost:${PORT} in your browser.`);
    });
  })
  .catch(err => {
    console.error('❌  Could not connect to MongoDB:', err.message);
    process.exit(1);
  });
