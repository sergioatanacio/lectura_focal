import type { Document } from '../../domain/entities/Document';
import type { DocumentRepositoryPort } from '../../application/ports/DocumentRepositoryPort';
import type { Database } from '../db/sqljs/loadSqlJs';

export class DocumentRepositorySqliteAdapter implements DocumentRepositoryPort {
  constructor(private db: Database) {}

  async save(document: Document): Promise<void> {
    this.db.run(
      `INSERT INTO documents (document_id, title, raw_text, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        document.document_id,
        document.title || null,
        document.raw_text,
        document.created_at,
        document.updated_at,
      ]
    );
  }

  async findById(documentId: string): Promise<Document | null> {
    const result = this.db.exec(
      `SELECT document_id, title, raw_text, created_at, updated_at
       FROM documents WHERE document_id = ?`,
      [documentId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    const row = result[0].values[0];
    return {
      document_id: row[0] as string,
      title: row[1] as string | undefined,
      raw_text: row[2] as string,
      created_at: row[3] as number,
      updated_at: row[4] as number,
    };
  }

  async update(document: Document): Promise<void> {
    this.db.run(
      `UPDATE documents SET title = ?, raw_text = ?, updated_at = ?
       WHERE document_id = ?`,
      [
        document.title || null,
        document.raw_text,
        document.updated_at,
        document.document_id,
      ]
    );
  }

  async delete(documentId: string): Promise<void> {
    this.db.run(`DELETE FROM documents WHERE document_id = ?`, [documentId]);
  }

  async findAll(): Promise<Document[]> {
    const result = this.db.exec(
      `SELECT document_id, title, raw_text, created_at, updated_at
       FROM documents ORDER BY created_at DESC`
    );

    if (result.length === 0) {
      return [];
    }

    return result[0].values.map((row) => ({
      document_id: row[0] as string,
      title: row[1] as string | undefined,
      raw_text: row[2] as string,
      created_at: row[3] as number,
      updated_at: row[4] as number,
    }));
  }
}
