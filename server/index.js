/*
  Express server for ElectroBlitz registrations backed by MongoDB.
  Exposes minimal endpoints for the existing frontend:
  - GET   /api/registrations         (paged list)
  - GET   /api/registrations/count   (total count + category breakdown)
  - POST  /api/registrations         (create one)
  - DELETE/ api/registrations        (delete all) [admin-only usage from UI button]
*/

const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gunaseelanvinothv_db_user:04032008Ns@cluster0.a2vzlan.mongodb.net/myDatabase';
const DB_NAME = process.env.MONGODB_DB || 'myDatabase';
const COLLECTION = process.env.MONGODB_COLLECTION || 'registrations';

let mongoClient;
let registrations;

async function init() {
  mongoClient = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  await mongoClient.connect();
  const db = mongoClient.db(DB_NAME);
  registrations = db.collection(COLLECTION);

  // Ensure unique id; email may have duplicates, so don't enforce unique on email
  try {
    await registrations.dropIndex('email_1');
  } catch (_) {
    // index may not exist – ignore
  }
  await registrations.createIndex({ id: 1 }, { unique: true }).catch(() => {});
  await registrations.createIndex({ category: 1 }).catch(() => {});
  await registrations.createIndex({ created_at: -1 }).catch(() => {});
}

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Count and category breakdown
app.get('/api/registrations/count', async (_req, res) => {
  try {
    const total = await registrations.countDocuments();
    const tech = await registrations.countDocuments({ category: 'tech' });
    const nonTech = await registrations.countDocuments({ category: 'non-tech' });
    const workshop = await registrations.countDocuments({ category: 'workshop' });
    res.json({ total, categories: { tech, nonTech, workshop } });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Count failed' });
  }
});

// List paged
app.get('/api/registrations', async (req, res) => {
  try {
    const from = Math.max(parseInt(req.query.from || '0', 10), 0);
    const size = Math.min(Math.max(parseInt(req.query.size || '150', 10), 1), 1000);
    const cursor = registrations
      .find({}, { projection: {
        id: 1,
        created_at: 1,
        category: 1,
        first_name: 1,
        last_name: 1,
        email: 1,
        college: 1,
        academic_year: 1,
        department: 1,
        section: 1,
        selected_events: 1,
        accommodation_required: 1,
        uploaded_file_name: 1,
        uploaded_file_url: 1,
        uploaded_file_size: 1,
        uploaded_file_type: 1,
        team_size: 1,
        team_members: 1,
        status: 1,
      } })
      .sort({ created_at: -1 })
      .skip(from)
      .limit(size);
    const list = await cursor.toArray();
    res.json({ data: list });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Fetch failed' });
  }
});

// Create
app.post('/api/registrations', async (req, res) => {
  try {
    const body = req.body || {};
    const now = new Date();
    const doc = {
      ...body,
      created_at: body.created_at || now.toISOString(),
      updated_at: now.toISOString(),
      registration_date: body.registration_date || now.toISOString(),
      status: body.status || 'pending',
    };

    // mimic id field if not provided
    if (!doc.id) {
      doc.id = cryptoRandomUUID();
    }

    await registrations.insertOne(doc);
    res.status(201).json(doc);
  } catch (e) {
    // handle unique email conflict gracefully
    if (e && e.code === 11000) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: e.message || 'Insert failed' });
  }
});

// Delete all (admin button mirror). Protect lightly with optional header.
app.delete('/api/registrations', async (req, res) => {
  try {
    const auth = req.headers['x-admin-token'];
    if (process.env.ADMIN_TOKEN && auth !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const r = await registrations.deleteMany({});
    res.json({ deletedCount: r.deletedCount || 0 });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Delete failed' });
  }
});

// Serve React build (same origin on port 3000)
const buildDir = path.join(__dirname, '..', 'build');
app.use(express.static(buildDir));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(buildDir, 'index.html'));
});

function cryptoRandomUUID() {
  // fallback for Node <19: generate RFC4122 v4-like UUID
  const bytes = Buffer.allocUnsafe(16);
  for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.substr(0,8)}-${hex.substr(8,4)}-${hex.substr(12,4)}-${hex.substr(16,4)}-${hex.substr(20,12)}`;
}

init()
  .then(() => {
    app.listen(PORT, () => console.log(`[server] listening on :${PORT}`));
  })
  .catch((e) => {
    console.error('Failed to init server:', e);
    process.exit(1);
  });


