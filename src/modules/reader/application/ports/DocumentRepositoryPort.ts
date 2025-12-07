import type { Document } from '../../domain/entities/Document';

export interface DocumentRepositoryPort {
  save(document: Document): Promise<void>;
  findById(documentId: string): Promise<Document | null>;
  update(document: Document): Promise<void>;
  delete(documentId: string): Promise<void>;
  findAll(): Promise<Document[]>;
}
