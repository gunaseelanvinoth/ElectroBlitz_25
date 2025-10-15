// Migration script: copy registrations from Supabase (Postgres) to MongoDB
// Usage: node scripts/migrateSupabaseToMongo.js

const { createClient } = require('@supabase/supabase-js');
const { MongoClient } = require('mongodb');

const SUPABASE_URL = 'https://iidtgymrlfuznnccbbyu.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpZHRneW1ybGZ1em5uY2NiYnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA1NjcsImV4cCI6MjA3NTQ3NjU2N30.HmDPnu5sYscIwJ1VbDn4oV50A35a1vI0KQZhfswfJFs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gunaseelanvinothv_db_user:04032008Ns@cluster0.a2vzlan.mongodb.net/myDatabase';
const DB_NAME = process.env.MONGODB_DB || 'myDatabase';
const COLLECTION = process.env.MONGODB_COLLECTION || 'registrations';

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
  const mongo = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  await mongo.connect();
  const col = mongo.db(DB_NAME).collection(COLLECTION);

  await col.createIndex({ email: 1 }, { unique: true }).catch(() => {});

  let from = 0;
  let size = 150; // start modest to avoid timeouts
  const minSize = 50;
  let totalInserted = 0;

  while (true) {
    const to = from + size - 1;
    let data, error;
    for (;;) {
      ({ data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: true })
        .range(from, to));
      if (!error) break;
      const msg = (error && error.message) || '';
      if ((msg.includes('statement timeout') || msg.includes('canceling statement')) && size > minSize) {
        size = Math.max(minSize, Math.floor(size / 2));
        continue; // retry with smaller batch
      }
      throw error;
    }
    if (!data || data.length === 0) break;

    const docs = data.map((r) => ({
      id: r.id,
      created_at: r.created_at,
      updated_at: r.updated_at,
      category: r.category,
      first_name: r.first_name,
      last_name: r.last_name,
      email: r.email,
      phone: r.phone,
      college: r.college,
      academic_year: r.academic_year,
      department: r.department,
      section: r.section,
      selected_events: r.selected_events,
      dietary_requirements: r.dietary_requirements,
      accommodation_required: r.accommodation_required,
      emergency_contact: r.emergency_contact,
      emergency_phone: r.emergency_phone,
      uploaded_file_name: r.uploaded_file_name,
      uploaded_file_url: r.uploaded_file_url,
      uploaded_file_size: r.uploaded_file_size,
      uploaded_file_type: r.uploaded_file_type,
      team_size: r.team_size,
      team_members: r.team_members,
      registration_date: r.registration_date,
      status: r.status,
    }));

    // upsert by id to preserve all rows even if emails repeat
    for (const d of docs) {
      await col.updateOne(
        { id: d.id },
        { $setOnInsert: d },
        { upsert: true }
      );
      totalInserted += 1;
    }

    from += size;
    if (data.length < size) break;
  }

  console.log(`Migration complete. Processed ${totalInserted} records.`);
  await mongo.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


