
// offline-db.ts
// Simple IndexedDB wrapper for offline-first document and image storage
import { openDB, DBSchema } from 'idb';

interface WitepadDoc {
  id: string;
  name: string;
  owner_id: string;
  is_public: boolean;
  data: any;
  snapshot: any;
  created_at: string;
  updated_at: string;
  images?: string[]; // base64 or blob URLs
  synced?: boolean; // true if synced to server
  deleted?: boolean; // true if deleted locally
  favorite?: boolean; // true if marked as favorite
  thumbnailUrl?: string; // thumbnail preview of document
}

interface WitepadAsset {
  id: string;
  type: string;
  size: number;
  metadata?: any;
  createdAt: string;
  owner_id: string;
}

type WitepadDB = {
  documents: {
    key: string;
    value: WitepadDoc;
    indexes: { 
      'by-owner': string; 
      'by-favorite': [string, boolean]; 
      'by-date': string; 
    };
  };
  images: {
    key: string;
    value: Blob;
  };
  assets: {
    key: string;
    value: WitepadAsset;
    indexes: { 
      'by-owner': string; 
      'by-type': string; 
    };
  };
  assetData: {
    key: string;
    value: Blob | string;
  };
} & DBSchema;

export const getDB = async () => {
  return openDB<WitepadDB>('witepad-db', 2, {
    upgrade(db, oldVersion, newVersion) {
      // Create or update document store
      if (!db.objectStoreNames.contains('documents')) {
        const docStore = db.createObjectStore('documents', { keyPath: 'id' });
        docStore.createIndex('by-owner', 'owner_id');
        docStore.createIndex('by-favorite', ['owner_id', 'favorite']);
        docStore.createIndex('by-date', 'updated_at');
      }
      
      // Create or update images store
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images');
      }
      
      // Create assets store (for tldraw assets)
      if (!db.objectStoreNames.contains('assets')) {
        const assetStore = db.createObjectStore('assets', { keyPath: 'id' });
        assetStore.createIndex('by-owner', 'owner_id');
        assetStore.createIndex('by-type', 'type');
      }
      
      // Create asset data store (for tldraw asset data)
      if (!db.objectStoreNames.contains('assetData')) {
        db.createObjectStore('assetData');
      }
    },
  });
};

// Document operations
export async function saveDocument(doc: WitepadDoc) {
  const db = await getDB();
  await db.put('documents', doc);
}

export async function getDocument(id: string) {
  const db = await getDB();
  return db.get('documents', id);
}

export async function getAllDocuments(owner_id: string) {
  const db = await getDB();
  return db.getAllFromIndex('documents', 'by-owner', owner_id);
}

export async function getFavoriteDocuments(owner_id: string) {
  const db = await getDB();
  return db.getAllFromIndex('documents', 'by-favorite', [owner_id, true]);
}

export async function getRecentDocuments(owner_id: string, limit: number = 5) {
  const db = await getDB();
  const tx = db.transaction('documents');
  const index = tx.store.index('by-date');
  
  let documents = [];
  let cursor = await index.openCursor(null, 'prev'); // Sort by date descending
  
  while (cursor && documents.length < limit) {
    if (cursor.value.owner_id === owner_id) {
      documents.push(cursor.value);
    }
    cursor = await cursor.continue();
  }
  
  return documents;
}

export async function deleteDocument(id: string) {
  const db = await getDB();
  await db.delete('documents', id);
}

// Image operations
export async function saveImage(id: string, blob: Blob) {
  const db = await getDB();
  await db.put('images', blob, id);
}

export async function getImage(id: string) {
  const db = await getDB();
  return db.get('images', id);
}

export async function deleteImage(id: string) {
  const db = await getDB();
  await db.delete('images', id);
}

// TLDraw Asset operations
export async function saveAsset(asset: WitepadAsset, data: Blob | string) {
  const db = await getDB();
  const tx = db.transaction(['assets', 'assetData'], 'readwrite');
  await tx.objectStore('assets').put(asset);
  await tx.objectStore('assetData').put(data, asset.id);
  await tx.done;
}

export async function getAsset(id: string) {
  const db = await getDB();
  return db.get('assets', id);
}

export async function getAssetData(id: string) {
  const db = await getDB();
  return db.get('assetData', id);
}

export async function getAssetsByOwner(owner_id: string) {
  const db = await getDB();
  return db.getAllFromIndex('assets', 'by-owner', owner_id);
}

export async function getAssetsByType(type: string) {
  const db = await getDB();
  return db.getAllFromIndex('assets', 'by-type', type);
}

export async function deleteAsset(id: string) {
  const db = await getDB();
  const tx = db.transaction(['assets', 'assetData'], 'readwrite');
  await tx.objectStore('assets').delete(id);
  await tx.objectStore('assetData').delete(id);
  await tx.done;
}

// Generate thumbnail from tldraw snapshot
export async function generateThumbnail(documentData: any): Promise<string | null> {
  try {
    // This is a placeholder - in a real implementation you would 
    // render a small version of the tldraw canvas to a canvas element
    // and export as a small data URL
    return null;
  } catch (error) {
    console.error('Failed to generate thumbnail:', error);
    return null;
  }
}
