import type { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js';

export type Database = SqlJsDatabase;
export type { SqlJsStatic };

let sqlJsInstance: SqlJsStatic | null = null;

export async function getSqlJs(): Promise<SqlJsStatic> {
  if (!sqlJsInstance) {
    try {
      // Importación dinámica con destructuring del módulo completo
      const sqlJsModule = await import('sql.js');

      // sql.js exporta la función directamente en el módulo, no como default
      // Necesitamos obtener la función init del módulo
      const initSqlJs = (sqlJsModule as any).default || sqlJsModule;

      if (typeof initSqlJs !== 'function') {
        console.error('sql.js module:', sqlJsModule);
        throw new Error('initSqlJs no es una función. Tipo: ' + typeof initSqlJs);
      }

      // Usar BASE_URL para compatibilidad con subdirectorios y file://
      const baseUrl = import.meta.env.BASE_URL || '/';

      sqlJsInstance = await initSqlJs({
        locateFile: (file) => `${baseUrl}${file}`,
      });
    } catch (error) {
      console.error('Error loading sql.js:', error);
      throw new Error(
        `No se pudo cargar sql.js: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  return sqlJsInstance;
}
