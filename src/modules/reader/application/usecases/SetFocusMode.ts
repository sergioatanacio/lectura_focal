import { NotFoundError } from '@/shared/application/errors';
import type { ReadingStatePort } from '../ports/ReadingStatePort';

export class SetFocusMode {
  constructor(private readingStateRepo: ReadingStatePort) {}

  async execute(documentId: string, isEnabled: boolean): Promise<void> {
    const readingState = await this.readingStateRepo.findByDocument(documentId);
    if (!readingState) {
      throw new NotFoundError('Estado de lectura no encontrado');
    }

    readingState.focus_mode = isEnabled;
    await this.readingStateRepo.update(readingState);
  }
}
