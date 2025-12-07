import type { TextoDeLectura } from '../../domain/entities/TextoDeLectura';
import type { TextoDeLecturaRepositoryPort } from '../../application/ports/TextoDeLecturaRepositoryPort';
import type { SegmentationModeValue } from '../../domain/values/SegmentationMode';
import type { Database } from '../db/sqljs/loadSqlJs';

export class TextoDeLecturaRepositorySqliteAdapter
  implements TextoDeLecturaRepositoryPort
{
  constructor(private db: Database) {}

  async save(textoDeLectura: TextoDeLectura): Promise<void> {
    this.db.run(
      `INSERT INTO textos_de_lectura (texto_lectura_id, texto_original_id, modo_segmentacion, nombre, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        textoDeLectura.texto_lectura_id,
        textoDeLectura.texto_original_id,
        textoDeLectura.modo_segmentacion,
        textoDeLectura.nombre || null,
        textoDeLectura.created_at,
      ]
    );
  }

  async findById(textoLecturaId: string): Promise<TextoDeLectura | null> {
    const result = this.db.exec(
      `SELECT texto_lectura_id, texto_original_id, modo_segmentacion, nombre, created_at
       FROM textos_de_lectura WHERE texto_lectura_id = ?`,
      [textoLecturaId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    const row = result[0].values[0];
    return {
      texto_lectura_id: row[0] as string,
      texto_original_id: row[1] as string,
      modo_segmentacion: row[2] as SegmentationModeValue,
      nombre: row[3] as string | undefined,
      created_at: row[4] as number,
    };
  }

  async findByTextoOriginal(
    textoOriginalId: string
  ): Promise<TextoDeLectura[]> {
    const result = this.db.exec(
      `SELECT texto_lectura_id, texto_original_id, modo_segmentacion, nombre, created_at
       FROM textos_de_lectura WHERE texto_original_id = ?
       ORDER BY created_at DESC`,
      [textoOriginalId]
    );

    if (result.length === 0) {
      return [];
    }

    return result[0].values.map((row) => ({
      texto_lectura_id: row[0] as string,
      texto_original_id: row[1] as string,
      modo_segmentacion: row[2] as SegmentationModeValue,
      nombre: row[3] as string | undefined,
      created_at: row[4] as number,
    }));
  }

  async findByCuaderno(cuadernoId: string): Promise<TextoDeLectura[]> {
    const result = this.db.exec(
      `SELECT tl.texto_lectura_id, tl.texto_original_id, tl.modo_segmentacion, tl.nombre, tl.created_at
       FROM textos_de_lectura tl
       INNER JOIN textos_originales tor ON tl.texto_original_id = tor.texto_original_id
       WHERE tor.cuaderno_id = ?
       ORDER BY tl.created_at DESC`,
      [cuadernoId]
    );

    if (result.length === 0) {
      return [];
    }

    return result[0].values.map((row) => ({
      texto_lectura_id: row[0] as string,
      texto_original_id: row[1] as string,
      modo_segmentacion: row[2] as SegmentationModeValue,
      nombre: row[3] as string | undefined,
      created_at: row[4] as number,
    }));
  }

  async update(textoDeLectura: TextoDeLectura): Promise<void> {
    this.db.run(
      `UPDATE textos_de_lectura SET nombre = ?
       WHERE texto_lectura_id = ?`,
      [textoDeLectura.nombre || null, textoDeLectura.texto_lectura_id]
    );
  }

  async delete(textoLecturaId: string): Promise<void> {
    this.db.run(
      `DELETE FROM textos_de_lectura WHERE texto_lectura_id = ?`,
      [textoLecturaId]
    );
  }
}
