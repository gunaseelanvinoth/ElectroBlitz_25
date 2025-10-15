// One-time script to remove unique index on email and ensure unique id index
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gunaseelanvinothv_db_user:04032008Ns@cluster0.a2vzlan.mongodb.net/myDatabase';
const DB_NAME = process.env.MONGODB_DB || 'myDatabase';
const COLLECTION = process.env.MONGODB_COLLECTION || 'registrations';

async function main() {
  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  await client.connect();
  const col = client.db(DB_NAME).collection(COLLECTION);

  try {
    const indexes = await col.indexes();
    for (const idx of indexes) {
      const isEmail = idx.key && Object.prototype.hasOwnProperty.call(idx.key, 'email');
      const isUnique = !!idx.unique;
      if (isEmail && isUnique) {
        console.log(`Dropping index ${idx.name}`);
        await col.dropIndex(idx.name);
      }
    }
  } catch (e) {
    console.warn('Index drop pass ended with:', e.message);
  }

  try {
    console.log('Ensuring unique id index');
    await col.createIndex({ id: 1 }, { unique: true });
  } catch (e) {
    console.warn('Create id index warning:', e.message);
  }

  await client.close();
  console.log('Indexes fixed.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});


