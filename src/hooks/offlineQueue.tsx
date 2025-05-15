import { openDB } from 'idb';

const dbPromise = openDB('offline-queue', 1, {
  upgrade(db) {
    db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
  },
});

export async function addRequest(request) {
  const db = await dbPromise;
  await db.add('requests', request);
}

export async function getRequests() {
  const db = await dbPromise;
  return db.getAll('requests');
}

export async function clearRequests() {
  const db = await dbPromise;
  await db.clear('requests');
}
