import { generateId } from '@/shared/domain/ids';
import { ValidationError } from '@/shared/application/errors';
import { createCuaderno } from '../../domain/entities/Cuaderno';
import type { CuadernoRepositoryPort } from '../ports/CuadernoRepositoryPort';
import type { SqlJsDatabaseAdapter } from '../../infrastructure/db/sqljs/SqlJsDatabaseAdapter';

export class CreateCuaderno {
  constructor(
    private cuadernoRepo: CuadernoRepositoryPort,
    private dbAdapter: SqlJsDatabaseAdapter
  ) {}

  async execute(params: { nombre: string }): Promise<string> {
    if (!params.nombre || params.nombre.trim().length === 0) {
      throw new ValidationError('El nombre del cuaderno no puede estar vacío');
    }

    const cuadernoId = generateId();
    const cuaderno = createCuaderno({
      cuaderno_id: cuadernoId,
      nombre: params.nombre.trim(),
    });

    await this.cuadernoRepo.save(cuaderno);
    await this.dbAdapter.persist();

    return cuadernoId;
  }
}
