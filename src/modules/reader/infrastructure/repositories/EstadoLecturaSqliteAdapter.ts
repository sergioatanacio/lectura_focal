import type { EstadoLectura } from '../../domain/entities/EstadoLectura';
import type { EstadoLecturaPort } from '../../application/ports/EstadoLecturaPort';
import type { Database } from '../db/sqljs/loadSqlJs';

export class EstadoLecturaSqliteAdapter implements EstadoLecturaPort {
  constructor(private db: Database) {}

  async save(estado: EstadoLectura): Promise<void> {
    this.db.run(
      `INSERT INTO estado_lectura (texto_lectura_id, current_position, focus_mode)
       VALUES (?, ?, ?)`,
      [
        estado.texto_lectura_id,
        estado.current_position,
        estado.focus_mode ? 1 : 0,
      ]
    );
  }

  async findByTextoLectura(
    textoLecturaId: string
  ): Promise<EstadoLectura | null> {
    const result = this.db.exec(
      `SELECT texto_lectura_id, current_position, focus_mode
       FROM estado_lectura WHERE texto_lectura_id = ?`,
      [textoLecturaId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    const row = result[0].values[0];
    return {
      texto_lectura_id: row[0] as string,
      current_position: row[1] as number,
      focus_mode: (row[2] as number) === 1,
    };
  }

  async update(estado: EstadoLectura): Promise<void> {
    this.db.run(
      `UPDATE estado_lectura SET current_position = ?, focus_mode = ?
       WHERE texto_lectura_id = ?`,
      [
        estado.current_position,
        estado.focus_mode ? 1 : 0,
        estado.texto_lectura_id,
      ]
    );
  }

  async delete(textoLecturaId: string): Promise<void> {
    this.db.run(`DELETE FROM estado_lectura WHERE texto_lectura_id = ?`, [
      textoLecturaId,
    ]);
  }
}
