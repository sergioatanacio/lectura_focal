import * as sqlJs from 'sql.js';

export type Database = sqlJs.Database;
export type SqlJsStatic = sqlJs.SqlJsStatic;

let sqlJsInstance: SqlJsStatic | null = null;

export async function getSqlJs(): Promise<SqlJsStatic> {
  if (!sqlJsInstance) {
    const initSqlJs = sqlJs.default || sqlJs;
    sqlJsInstance = await initSqlJs({
      locateFile: (file) => `/${file}`,
    });
  }
  return sqlJsInstance;
}
