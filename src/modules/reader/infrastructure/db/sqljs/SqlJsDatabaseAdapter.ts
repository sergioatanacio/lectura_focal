import { DatabaseError } from '@/shared/application/errors';
import { getSqlJs, type Database } from './loadSqlJs';
import { IndexedDbStore } from '../indexeddb/IndexedDbStore';
import migration001 from '../../migrations/001_init.sql?raw';
import migration002 from '../../migrations/002_indexes.sql?raw';

const MIGRATIONS = [migration001, migration002];
const CURRENT_VERSION = MIGRATIONS.length;

export class SqlJsDatabaseAdapter {
  private db: Database | null = null;
  private indexedDbStore: IndexedDbStore;

  constructor() {
    this.indexedDbStore = new IndexedDbStore();
  }

  async initialize(): Promise<void> {
    await this.indexedDbStore.open();

    const SQL = await getSqlJs();
    const existingData = await this.indexedDbStore.load();

    if (existingData) {
      this.db = new SQL.Database(existingData);
    } else {
      this.db = new SQL.Database();
    }

    await this.runMigrations();
    await this.persist();
  }

  private async runMigrations(): Promise<void> {
    if (!this.db) {
      throw new DatabaseError('Database no inicializada');
    }

    let currentVersion = 0;
    try {
      const result = this.db.exec('SELECT version FROM schema_version LIMIT 1');
      if (result.length > 0 && result[0].values.length > 0) {
        currentVersion = result[0].values[0][0] as number;
      }
    } catch {
      // No existe la tabla, versión = 0
    }

    for (let i = currentVersion; i < CURRENT_VERSION; i++) {
      try {
        this.db.exec(MIGRATIONS[i]);
      } catch (error) {
        throw new DatabaseError(
          `Error ejecutando migración ${i + 1}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  }

  async persist(): Promise<void> {
    if (!this.db) {
      throw new DatabaseError('Database no inicializada');
    }

    const data = this.db.export();
    await this.indexedDbStore.save(data);
  }

  getDatabase(): Database {
    if (!this.db) {
      throw new DatabaseError('Database no inicializada');
    }
    return this.db;
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.persist();
      this.db.close();
      this.db = null;
    }
    this.indexedDbStore.close();
  }

  private closeWithoutPersist(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    this.indexedDbStore.close();
  }

  async exportBytes(): Promise<Uint8Array> {
    if (!this.db) {
      throw new DatabaseError('Database no inicializada');
    }
    return this.db.export();
  }

  async importBytes(data: Uint8Array): Promise<void> {
    // Cerrar sin persistir para no sobrescribir los nuevos bytes
    this.closeWithoutPersist();
    await this.indexedDbStore.save(data);
    await this.initialize();
  }

  async reset(): Promise<void> {
    // Cerrar sin persistir antes de limpiar
    this.closeWithoutPersist();
    await this.indexedDbStore.clear();
    await this.initialize();
  }
}
