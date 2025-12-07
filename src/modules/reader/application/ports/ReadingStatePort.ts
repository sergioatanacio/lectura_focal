import type { ReadingState } from '../../domain/entities/ReadingState';

export interface ReadingStatePort {
  save(state: ReadingState): Promise<void>;
  findByDocument(documentId: string): Promise<ReadingState | null>;
  update(state: ReadingState): Promise<void>;
}
