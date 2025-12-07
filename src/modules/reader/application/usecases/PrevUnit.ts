import { NotFoundError } from '@/shared/application/errors';
import type { ReadingStatePort } from '../ports/ReadingStatePort';
import type { UnitRepositoryPort } from '../ports/UnitRepositoryPort';
import type { DocumentRepositoryPort } from '../ports/DocumentRepositoryPort';
import type { CommentRepositoryPort } from '../ports/CommentRepositoryPort';
import type { ReadingViewDTO } from '../dto/ReaderViewDTO';

export class PrevUnit {
  constructor(
    private documentRepo: DocumentRepositoryPort,
    private unitRepo: UnitRepositoryPort,
    private commentRepo: CommentRepositoryPort,
    private readingStateRepo: ReadingStatePort
  ) {}

  async execute(documentId: string): Promise<ReadingViewDTO> {
    const document = await this.documentRepo.findById(documentId);
    if (!document) {
      throw new NotFoundError('Documento no encontrado');
    }

    const readingState = await this.readingStateRepo.findByDocument(documentId);
    if (!readingState) {
      throw new NotFoundError('Estado de lectura no encontrado');
    }

    const units = await this.unitRepo.findByDocument(
      documentId,
      readingState.mode
    );
    const activeUnits = units.filter((u) => !u.is_deleted);
    const totalUnits = activeUnits.length;

    if (readingState.current_position > 0) {
      readingState.current_position--;
      await this.readingStateRepo.update(readingState);
    }

    const currentUnit =
      activeUnits.length > 0
        ? activeUnits[readingState.current_position]
        : null;

    const comments = currentUnit
      ? await this.commentRepo.findByUnit(currentUnit.unit_id)
      : [];

    return {
      document_id: document.document_id,
      document_title: document.title,
      mode: readingState.mode,
      current_unit: currentUnit
        ? {
            unit_id: currentUnit.unit_id,
            document_id: currentUnit.document_id,
            position: readingState.current_position,
            current_text: currentUnit.current_text,
            original_text: currentUnit.original_text,
            total_units: totalUnits,
            comments,
          }
        : null,
      focus_mode: readingState.focus_mode,
      has_next: readingState.current_position < totalUnits - 1,
      has_prev: readingState.current_position > 0,
    };
  }
}
