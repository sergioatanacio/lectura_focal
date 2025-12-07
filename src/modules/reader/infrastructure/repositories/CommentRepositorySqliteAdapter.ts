import type { Comment } from '../../domain/entities/Comment';
import type { CommentRepositoryPort } from '../../application/ports/CommentRepositoryPort';
import type { Database } from '../db/sqljs/loadSqlJs';

export class CommentRepositorySqliteAdapter implements CommentRepositoryPort {
  constructor(private db: Database) {}

  async save(comment: Comment): Promise<void> {
    this.db.run(
      `INSERT INTO comments (comment_id, unit_id, text, created_at)
       VALUES (?, ?, ?, ?)`,
      [comment.comment_id, comment.unit_id, comment.text, comment.created_at]
    );
  }

  async findById(commentId: string): Promise<Comment | null> {
    const result = this.db.exec(
      `SELECT comment_id, unit_id, text, created_at
       FROM comments WHERE comment_id = ?`,
      [commentId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    const row = result[0].values[0];
    return {
      comment_id: row[0] as string,
      unit_id: row[1] as string,
      text: row[2] as string,
      created_at: row[3] as number,
    };
  }

  async findByUnit(unitId: string): Promise<Comment[]> {
    const result = this.db.exec(
      `SELECT comment_id, unit_id, text, created_at
       FROM comments WHERE unit_id = ?
       ORDER BY created_at ASC`,
      [unitId]
    );

    if (result.length === 0) {
      return [];
    }

    return result[0].values.map((row) => ({
      comment_id: row[0] as string,
      unit_id: row[1] as string,
      text: row[2] as string,
      created_at: row[3] as number,
    }));
  }

  async delete(commentId: string): Promise<void> {
    this.db.run(`DELETE FROM comments WHERE comment_id = ?`, [commentId]);
  }
}
