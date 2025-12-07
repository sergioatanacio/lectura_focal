import type { TextoOriginal } from '../../domain/entities/TextoOriginal';
import type { TextoOriginalRepositoryPort } from '../../application/ports/TextoOriginalRepositoryPort';
import type { Database } from '../db/sqljs/loadSqlJs';

export class TextoOriginalRepositorySqliteAdapter
  implements TextoOriginalRepositoryPort
{
  constructor(private db: Database) {}

  async save(textoOriginal: TextoOriginal): Promise<void> {
    this.db.run(
      `INSERT INTO textos_originales (texto_original_id, cuaderno_id, contenido, created_at)
       VALUES (?, ?, ?, ?)`,
      [
        textoOriginal.texto_original_id,
        textoOriginal.cuaderno_id,
        textoOriginal.contenido,
        textoOriginal.created_at,
      ]
    );
  }

  async findById(textoOriginalId: string): Promise<TextoOriginal | null> {
    const result = this.db.exec(
      `SELECT texto_original_id, cuaderno_id, contenido, created_at
       FROM textos_originales WHERE texto_original_id = ?`,
      [textoOriginalId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    const row = result[0].values[0];
    return {
      texto_original_id: row[0] as string,
      cuaderno_id: row[1] as string,
      contenido: row[2] as string,
      created_at: row[3] as number,
    };
  }

  async findByCuaderno(cuadernoId: string): Promise<TextoOriginal[]> {
    const result = this.db.exec(
      `SELECT texto_original_id, cuaderno_id, contenido, created_at
       FROM textos_originales WHERE cuaderno_id = ?
       ORDER BY created_at DESC`,
      [cuadernoId]
    );

    if (result.length === 0) {
      return [];
    }

    return result[0].values.map((row) => ({
      texto_original_id: row[0] as string,
      cuaderno_id: row[1] as string,
      contenido: row[2] as string,
      created_at: row[3] as number,
    }));
  }

  async delete(textoOriginalId: string): Promise<void> {
    this.db.run(
      `DELETE FROM textos_originales WHERE texto_original_id = ?`,
      [textoOriginalId]
    );
  }
}
