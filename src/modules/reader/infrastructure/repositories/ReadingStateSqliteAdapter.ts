import type { ReadingState } from '../../domain/entities/ReadingState';
import type { ReadingStatePort } from '../../application/ports/ReadingStatePort';
import type { SegmentationModeValue } from '../../domain/values/SegmentationMode';
import type { Database } from '../db/sqljs/loadSqlJs';

export class ReadingStateSqliteAdapter implements ReadingStatePort {
  constructor(private db: Database) {}

  async save(state: ReadingState): Promise<void> {
    this.db.run(
      `INSERT INTO reading_state (document_id, mode, current_position, focus_mode)
       VALUES (?, ?, ?, ?)`,
      [
        state.document_id,
        state.mode,
        state.current_position,
        state.focus_mode ? 1 : 0,
      ]
    );
  }

  async findByDocument(documentId: string): Promise<ReadingState | null> {
    const result = this.db.exec(
      `SELECT document_id, mode, current_position, focus_mode
       FROM reading_state WHERE document_id = ?`,
      [documentId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    const row = result[0].values[0];
    return {
      document_id: row[0] as string,
      mode: row[1] as SegmentationModeValue,
      current_position: row[2] as number,
      focus_mode: (row[3] as number) === 1,
    };
  }

  async update(state: ReadingState): Promise<void> {
    this.db.run(
      `UPDATE reading_state SET mode = ?, current_position = ?, focus_mode = ?
       WHERE document_id = ?`,
      [
        state.mode,
        state.current_position,
        state.focus_mode ? 1 : 0,
        state.document_id,
      ]
    );
  }
}
