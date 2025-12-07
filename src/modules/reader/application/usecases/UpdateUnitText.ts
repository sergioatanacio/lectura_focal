import { NotFoundError } from '@/shared/application/errors';
import type { UnitRepositoryPort } from '../ports/UnitRepositoryPort';

export class UpdateUnitText {
  constructor(private unitRepo: UnitRepositoryPort) {}

  async execute(unitId: string, newText: string): Promise<void> {
    const unit = await this.unitRepo.findById(unitId);
    if (!unit) {
      throw new NotFoundError('Unidad no encontrada');
    }

    unit.current_text = newText;
    await this.unitRepo.update(unit);
  }
}
