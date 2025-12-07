import { SqlJsDatabaseAdapter } from '@/modules/reader/infrastructure/db/sqljs/SqlJsDatabaseAdapter';

let dbInstance: SqlJsDatabaseAdapter | null = null;

export async function initDatabase(
  onProgress?: (message: string) => void
): Promise<SqlJsDatabaseAdapter> {
  if (dbInstance) {
    return dbInstance;
  }

  const adapter = new SqlJsDatabaseAdapter();

  onProgress?.('Abriendo IndexedDB...');
  onProgress?.('Cargando sql.js...');
  onProgress?.('Aplicando migraciones...');

  await adapter.initialize();

  dbInstance = adapter;
  return adapter;
}

export function getDatabase(): SqlJsDatabaseAdapter {
  if (!dbInstance) {
    throw new Error('Database no inicializada. Llama a initDatabase primero.');
  }
  return dbInstance;
}
