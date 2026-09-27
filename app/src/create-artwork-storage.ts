export type StoredArtworkImage = { id: string; file: File };

const DATABASE_NAME = "taste-create-artwork-v1";
const STORE_NAME = "draft";
const IMAGES_KEY = "images";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let request: IDBOpenDBRequest;
    try {
      request = indexedDB.open(DATABASE_NAME, 1);
    } catch (error) {
      reject(error);
      return;
    }

    let blocked = false;
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onerror = () => reject(request.error ?? new Error("Could not open image storage."));
    request.onblocked = () => {
      blocked = true;
      reject(new Error("Image storage is blocked by another tab."));
    };
    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => database.close();
      if (blocked) database.close();
      else resolve(database);
    };
  });
}

export async function loadArtworkImages(key = IMAGES_KEY): Promise<StoredArtworkImage[]> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    try {
      const transaction = database.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).get(key);
      let images: StoredArtworkImage[] = [];
      request.onsuccess = () => { images = (request.result as StoredArtworkImage[] | undefined) ?? []; };
      transaction.oncomplete = () => { database.close(); resolve(images); };
      transaction.onerror = () => { database.close(); reject(transaction.error ?? new Error("Could not load draft images.")); };
      transaction.onabort = () => { database.close(); reject(transaction.error ?? new Error("Could not load draft images.")); };
    } catch (error) {
      database.close();
      reject(error);
    }
  });
}

export async function saveArtworkImages(images: StoredArtworkImage[], key = IMAGES_KEY): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    try {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put(images, key);
      transaction.oncomplete = () => { database.close(); resolve(); };
      transaction.onerror = () => { database.close(); reject(transaction.error ?? new Error("Could not save draft images.")); };
      transaction.onabort = () => { database.close(); reject(transaction.error ?? new Error("Could not save draft images.")); };
    } catch (error) {
      database.close();
      reject(error);
    }
  });
}
