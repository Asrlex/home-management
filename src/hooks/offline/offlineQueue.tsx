import { HttpEnum } from '@/entities/enums/http.enum';
import { openDB } from 'idb';

export interface RequestData {
  method: HttpEnum;
  url: string;
  headers: {
    Authorization: string;
    'X-api-key': string;
    'Content-Type': HttpEnum;
    Accept: HttpEnum;
  };
  params: Record<string, string | number | boolean>;
  body: Record<string, object>;
}

const dbPromise = openDB('offline-queue', 1, {
  upgrade(db) {
    db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
  },
});

export async function addRequest(request: RequestData) {
  const db = await dbPromise;
  await db.add('requests', request);
}

export async function getRequests(): Promise<RequestData[]> {
  const db = await dbPromise;
  return db.getAll('requests');
}

export async function clearRequests() {
  const db = await dbPromise;
  await db.clear('requests');
}
