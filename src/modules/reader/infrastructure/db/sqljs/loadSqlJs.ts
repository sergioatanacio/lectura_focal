import type { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js';

export type Database = SqlJsDatabase;
export type { SqlJsStatic };

let sqlJsInstance: SqlJsStatic | null = null;

export async function getSqlJs(): Promise<SqlJsStatic> {
  if (!sqlJsInstance) {
    // Importación dinámica para evitar problemas con ESM
    const sqlJsModule = await import('sql.js');

    // sql.js puede exportar como default o como módulo completo
    const initSqlJs =
      typeof sqlJsModule.default === 'function'
        ? sqlJsModule.default
        : (sqlJsModule as any);

    if (typeof initSqlJs !== 'function') {
      throw new Error('No se pudo cargar initSqlJs');
    }

    sqlJsInstance = await initSqlJs({
      locateFile: (file) => `/${file}`,
    });
  }
  return sqlJsInstance;
}
