import { DatabaseError } from '@/shared/application/errors';

const DB_NAME = 'app-lectura-oracion';
const DB_VERSION = 1;
const STORE_NAME = 'database';
const DB_KEY = 'sqlite_db_bytes';

export class IndexedDbStore {
  private db: IDBDatabase | null = null;

  async open(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(
          new DatabaseError(
            `Error al abrir IndexedDB: ${request.error?.message}`
          )
        );
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  }

  async load(): Promise<Uint8Array | null> {
    if (!this.db) {
      throw new DatabaseError('IndexedDB no está abierta');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(DB_KEY);

      request.onerror = () => {
        reject(new DatabaseError(`Error al leer de IndexedDB`));
      };

      request.onsuccess = () => {
        resolve(request.result || null);
      };
    });
  }

  async save(data: Uint8Array): Promise<void> {
    if (!this.db) {
      throw new DatabaseError('IndexedDB no está abierta');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data, DB_KEY);

      request.onerror = () => {
        reject(new DatabaseError(`Error al guardar en IndexedDB`));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  async clear(): Promise<void> {
    if (!this.db) {
      throw new DatabaseError('IndexedDB no está abierta');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => {
        reject(new DatabaseError(`Error al limpiar IndexedDB`));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
