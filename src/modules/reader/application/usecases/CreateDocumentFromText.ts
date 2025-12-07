import { generateId } from '@/shared/domain/ids';
import { ValidationError } from '@/shared/application/errors';
import { createDocument } from '../../domain/entities/Document';
import { createUnit } from '../../domain/entities/Unit';
import { createReadingState } from '../../domain/entities/ReadingState';
import type { DocumentRepositoryPort } from '../ports/DocumentRepositoryPort';
import type { UnitRepositoryPort } from '../ports/UnitRepositoryPort';
import type { ReadingStatePort } from '../ports/ReadingStatePort';
import type { SegmentationModeValue } from '../../domain/values/SegmentationMode';
import { segmentText } from './segmentation';

export class CreateDocumentFromText {
  constructor(
    private documentRepo: DocumentRepositoryPort,
    private unitRepo: UnitRepositoryPort,
    private readingStateRepo: ReadingStatePort
  ) {}

  async execute(params: {
    title?: string;
    rawText: string;
    segmentationMode: SegmentationModeValue;
  }): Promise<string> {
    if (!params.rawText || params.rawText.trim().length === 0) {
      throw new ValidationError('El texto no puede estar vacío');
    }

    const documentId = generateId();
    const document = createDocument({
      document_id: documentId,
      title: params.title,
      raw_text: params.rawText,
    });

    await this.documentRepo.save(document);

    const segments = segmentText(params.rawText, params.segmentationMode);
    const units = segments.map((text, index) =>
      createUnit({
        unit_id: generateId(),
        document_id: documentId,
        position: index,
        mode: params.segmentationMode,
        text,
      })
    );

    if (units.length > 0) {
      await this.unitRepo.saveAll(units);
    }

    const readingState = createReadingState({
      document_id: documentId,
      mode: params.segmentationMode,
      current_position: 0,
      focus_mode: false,
    });

    await this.readingStateRepo.save(readingState);

    return documentId;
  }
}
