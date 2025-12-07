import { NotFoundError } from '@/shared/application/errors';
import type { UnitRepositoryPort } from '../ports/UnitRepositoryPort';
import type { ReadingStatePort } from '../ports/ReadingStatePort';

export class DeleteUnit {
  constructor(
    private unitRepo: UnitRepositoryPort,
    private readingStateRepo: ReadingStatePort
  ) {}

  async execute(unitId: string): Promise<void> {
    const unit = await this.unitRepo.findById(unitId);
    if (!unit) {
      throw new NotFoundError('Unidad no encontrada');
    }

    unit.is_deleted = true;
    await this.unitRepo.update(unit);

    const readingState = await this.readingStateRepo.findByDocument(
      unit.document_id
    );
    if (readingState) {
      const units = await this.unitRepo.findByDocument(
        unit.document_id,
        readingState.mode
      );
      const activeUnits = units.filter((u) => !u.is_deleted);

      if (
        readingState.current_position >= activeUnits.length &&
        activeUnits.length > 0
      ) {
        readingState.current_position = activeUnits.length - 1;
        await this.readingStateRepo.update(readingState);
      }
    }
  }
}
