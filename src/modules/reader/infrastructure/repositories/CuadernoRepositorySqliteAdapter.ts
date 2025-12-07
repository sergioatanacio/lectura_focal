import type { Cuaderno } from '../../domain/entities/Cuaderno';
import type { CuadernoRepositoryPort } from '../../application/ports/CuadernoRepositoryPort';
import type { Database } from '../db/sqljs/loadSqlJs';

export class CuadernoRepositorySqliteAdapter implements CuadernoRepositoryPort {
  constructor(private db: Database) {}

  async save(cuaderno: Cuaderno): Promise<void> {
    this.db.run(
      `INSERT INTO cuadernos (cuaderno_id, nombre, created_at, updated_at)
       VALUES (?, ?, ?, ?)`,
      [
        cuaderno.cuaderno_id,
        cuaderno.nombre,
        cuaderno.created_at,
        cuaderno.updated_at,
      ]
    );
  }

  async findById(cuadernoId: string): Promise<Cuaderno | null> {
    const result = this.db.exec(
      `SELECT cuaderno_id, nombre, created_at, updated_at
       FROM cuadernos WHERE cuaderno_id = ?`,
      [cuadernoId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    const row = result[0].values[0];
    return {
      cuaderno_id: row[0] as string,
      nombre: row[1] as string,
      created_at: row[2] as number,
      updated_at: row[3] as number,
    };
  }

  async findAll(): Promise<Cuaderno[]> {
    const result = this.db.exec(
      `SELECT cuaderno_id, nombre, created_at, updated_at
       FROM cuadernos ORDER BY created_at DESC`
    );

    if (result.length === 0) {
      return [];
    }

    return result[0].values.map((row) => ({
      cuaderno_id: row[0] as string,
      nombre: row[1] as string,
      created_at: row[2] as number,
      updated_at: row[3] as number,
    }));
  }

  async update(cuaderno: Cuaderno): Promise<void> {
    this.db.run(
      `UPDATE cuadernos SET nombre = ?, updated_at = ?
       WHERE cuaderno_id = ?`,
      [cuaderno.nombre, cuaderno.updated_at, cuaderno.cuaderno_id]
    );
  }

  async delete(cuadernoId: string): Promise<void> {
    this.db.run(`DELETE FROM cuadernos WHERE cuaderno_id = ?`, [cuadernoId]);
  }
}
