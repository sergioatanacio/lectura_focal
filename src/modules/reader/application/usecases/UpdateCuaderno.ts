import { NotFoundError, ValidationError } from '@/shared/application/errors';
import type { CuadernoRepositoryPort } from '../ports/CuadernoRepositoryPort';
import type { SqlJsDatabaseAdapter } from '../../infrastructure/db/sqljs/SqlJsDatabaseAdapter';

export class UpdateCuaderno {
  constructor(
    private cuadernoRepo: CuadernoRepositoryPort,
    private dbAdapter: SqlJsDatabaseAdapter
  ) {}

  async execute(params: {
    cuadernoId: string;
    nombre: string;
  }): Promise<void> {
    if (!params.nombre || params.nombre.trim().length === 0) {
      throw new ValidationError('El nombre del cuaderno no puede estar vacío');
    }

    const cuaderno = await this.cuadernoRepo.findById(params.cuadernoId);
    if (!cuaderno) {
      throw new NotFoundError('Cuaderno no encontrado');
    }

    const updatedCuaderno = {
      ...cuaderno,
      nombre: params.nombre.trim(),
      updated_at: Date.now(),
    };

    await this.cuadernoRepo.update(updatedCuaderno);
    await this.dbAdapter.persist();
  }
}
