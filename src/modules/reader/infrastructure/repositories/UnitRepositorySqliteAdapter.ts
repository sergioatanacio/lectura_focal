import type { Unit } from '../../domain/entities/Unit';
import type { UnitRepositoryPort } from '../../application/ports/UnitRepositoryPort';
import type { SegmentationModeValue } from '../../domain/values/SegmentationMode';
import type { Database } from '../db/sqljs/loadSqlJs';

export class UnitRepositorySqliteAdapter implements UnitRepositoryPort {
  constructor(private db: Database) {}

  async save(unit: Unit): Promise<void> {
    this.db.run(
      `INSERT INTO units (unit_id, document_id, position, mode, original_text, current_text, is_deleted)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        unit.unit_id,
        unit.document_id,
        unit.position,
        unit.mode,
        unit.original_text,
        unit.current_text,
        unit.is_deleted ? 1 : 0,
      ]
    );
  }

  async saveAll(units: Unit[]): Promise<void> {
    for (const unit of units) {
      await this.save(unit);
    }
  }

  async findById(unitId: string): Promise<Unit | null> {
    const result = this.db.exec(
      `SELECT unit_id, document_id, position, mode, original_text, current_text, is_deleted
       FROM units WHERE unit_id = ?`,
      [unitId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    const row = result[0].values[0];
    return {
      unit_id: row[0] as string,
      document_id: row[1] as string,
      position: row[2] as number,
      mode: row[3] as SegmentationModeValue,
      original_text: row[4] as string,
      current_text: row[5] as string,
      is_deleted: (row[6] as number) === 1,
    };
  }

  async findByDocument(
    documentId: string,
    mode: SegmentationModeValue
  ): Promise<Unit[]> {
    const result = this.db.exec(
      `SELECT unit_id, document_id, position, mode, original_text, current_text, is_deleted
       FROM units WHERE document_id = ? AND mode = ?
       ORDER BY position ASC`,
      [documentId, mode]
    );

    if (result.length === 0) {
      return [];
    }

    return result[0].values.map((row) => ({
      unit_id: row[0] as string,
      document_id: row[1] as string,
      position: row[2] as number,
      mode: row[3] as SegmentationModeValue,
      original_text: row[4] as string,
      current_text: row[5] as string,
      is_deleted: (row[6] as number) === 1,
    }));
  }

  async findByDocumentAndPosition(
    documentId: string,
    mode: SegmentationModeValue,
    position: number
  ): Promise<Unit | null> {
    const result = this.db.exec(
      `SELECT unit_id, document_id, position, mode, original_text, current_text, is_deleted
       FROM units WHERE document_id = ? AND mode = ? AND position = ?`,
      [documentId, mode, position]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    const row = result[0].values[0];
    return {
      unit_id: row[0] as string,
      document_id: row[1] as string,
      position: row[2] as number,
      mode: row[3] as SegmentationModeValue,
      original_text: row[4] as string,
      current_text: row[5] as string,
      is_deleted: (row[6] as number) === 1,
    };
  }

  async update(unit: Unit): Promise<void> {
    this.db.run(
      `UPDATE units SET current_text = ?, is_deleted = ?
       WHERE unit_id = ?`,
      [unit.current_text, unit.is_deleted ? 1 : 0, unit.unit_id]
    );
  }

  async deleteByDocument(documentId: string): Promise<void> {
    this.db.run(`DELETE FROM units WHERE document_id = ?`, [documentId]);
  }

  async countByDocument(
    documentId: string,
    mode: SegmentationModeValue,
    includeDeleted = false
  ): Promise<number> {
    const query = includeDeleted
      ? `SELECT COUNT(*) FROM units WHERE document_id = ? AND mode = ?`
      : `SELECT COUNT(*) FROM units WHERE document_id = ? AND mode = ? AND is_deleted = 0`;

    const result = this.db.exec(query, [documentId, mode]);

    if (result.length === 0 || result[0].values.length === 0) {
      return 0;
    }

    return result[0].values[0][0] as number;
  }
}
