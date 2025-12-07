import { NotFoundError } from '@/shared/application/errors';
import type { ReadingStatePort } from '../ports/ReadingStatePort';
import type { SegmentationModeValue } from '../../domain/values/SegmentationMode';

export class SetReadingMode {
  constructor(private readingStateRepo: ReadingStatePort) {}

  async execute(
    documentId: string,
    mode: SegmentationModeValue
  ): Promise<void> {
    const readingState = await this.readingStateRepo.findByDocument(documentId);
    if (!readingState) {
      throw new NotFoundError('Estado de lectura no encontrado');
    }

    readingState.mode = mode;
    readingState.current_position = 0;
    await this.readingStateRepo.update(readingState);
  }
}
