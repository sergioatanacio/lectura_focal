import type { Fragmento } from '../../domain/entities/Fragmento';
import type { FragmentoRepositoryPort } from '../../application/ports/FragmentoRepositoryPort';
import type { Database } from '../db/sqljs/loadSqlJs';

export class FragmentoRepositorySqliteAdapter
  implements FragmentoRepositoryPort
{
  constructor(private db: Database) {}

  async save(fragmento: Fragmento): Promise<void> {
    this.db.run(
      `INSERT INTO fragmentos (fragmento_id, texto_lectura_id, position, texto_original, texto_actual, is_deleted)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        fragmento.fragmento_id,
        fragmento.texto_lectura_id,
        fragmento.position,
        fragmento.texto_original,
        fragmento.texto_actual,
        fragmento.is_deleted ? 1 : 0,
      ]
    );
  }

  async saveAll(fragmentos: Fragmento[]): Promise<void> {
    for (const fragmento of fragmentos) {
      await this.save(fragmento);
    }
  }

  async findById(fragmentoId: string): Promise<Fragmento | null> {
    const result = this.db.exec(
      `SELECT fragmento_id, texto_lectura_id, position, texto_original, texto_actual, is_deleted
       FROM fragmentos WHERE fragmento_id = ?`,
      [fragmentoId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    const row = result[0].values[0];
    return {
      fragmento_id: row[0] as string,
      texto_lectura_id: row[1] as string,
      position: row[2] as number,
      texto_original: row[3] as string,
      texto_actual: row[4] as string,
      is_deleted: (row[5] as number) === 1,
    };
  }

  async findByTextoLectura(textoLecturaId: string): Promise<Fragmento[]> {
    const result = this.db.exec(
      `SELECT fragmento_id, texto_lectura_id, position, texto_original, texto_actual, is_deleted
       FROM fragmentos WHERE texto_lectura_id = ?
       ORDER BY position ASC`,
      [textoLecturaId]
    );

    if (result.length === 0) {
      return [];
    }

    return result[0].values.map((row) => ({
      fragmento_id: row[0] as string,
      texto_lectura_id: row[1] as string,
      position: row[2] as number,
      texto_original: row[3] as string,
      texto_actual: row[4] as string,
      is_deleted: (row[5] as number) === 1,
    }));
  }

  async findByTextoLecturaAndPosition(
    textoLecturaId: string,
    position: number
  ): Promise<Fragmento | null> {
    const result = this.db.exec(
      `SELECT fragmento_id, texto_lectura_id, position, texto_original, texto_actual, is_deleted
       FROM fragmentos WHERE texto_lectura_id = ? AND position = ?`,
      [textoLecturaId, position]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    const row = result[0].values[0];
    return {
      fragmento_id: row[0] as string,
      texto_lectura_id: row[1] as string,
      position: row[2] as number,
      texto_original: row[3] as string,
      texto_actual: row[4] as string,
      is_deleted: (row[5] as number) === 1,
    };
  }

  async update(fragmento: Fragmento): Promise<void> {
    this.db.run(
      `UPDATE fragmentos SET texto_actual = ?, is_deleted = ?
       WHERE fragmento_id = ?`,
      [
        fragmento.texto_actual,
        fragmento.is_deleted ? 1 : 0,
        fragmento.fragmento_id,
      ]
    );
  }

  async deleteByTextoLectura(textoLecturaId: string): Promise<void> {
    this.db.run(`DELETE FROM fragmentos WHERE texto_lectura_id = ?`, [
      textoLecturaId,
    ]);
  }

  async countByTextoLectura(
    textoLecturaId: string,
    includeDeleted = false
  ): Promise<number> {
    const query = includeDeleted
      ? `SELECT COUNT(*) FROM fragmentos WHERE texto_lectura_id = ?`
      : `SELECT COUNT(*) FROM fragmentos WHERE texto_lectura_id = ? AND is_deleted = 0`;

    const result = this.db.exec(query, [textoLecturaId]);

    if (result.length === 0 || result[0].values.length === 0) {
      return 0;
    }

    return result[0].values[0][0] as number;
  }
}
