import { generateId } from '@/shared/domain/ids';
import { ValidationError, NotFoundError } from '@/shared/application/errors';
import { createTextoOriginal } from '../../domain/entities/TextoOriginal';
import type { TextoOriginalRepositoryPort } from '../ports/TextoOriginalRepositoryPort';
import type { CuadernoRepositoryPort } from '../ports/CuadernoRepositoryPort';
import type { SqlJsDatabaseAdapter } from '../../infrastructure/db/sqljs/SqlJsDatabaseAdapter';

export class CreateTextoOriginal {
  constructor(
    private textoOriginalRepo: TextoOriginalRepositoryPort,
    private cuadernoRepo: CuadernoRepositoryPort,
    private dbAdapter: SqlJsDatabaseAdapter
  ) {}

  async execute(params: {
    cuadernoId: string;
    contenido: string;
  }): Promise<string> {
    if (!params.contenido || params.contenido.trim().length === 0) {
      throw new ValidationError('El contenido no puede estar vacío');
    }

    const cuaderno = await this.cuadernoRepo.findById(params.cuadernoId);
    if (!cuaderno) {
      throw new NotFoundError('Cuaderno no encontrado');
    }

    const textoOriginalId = generateId();
    const textoOriginal = createTextoOriginal({
      texto_original_id: textoOriginalId,
      cuaderno_id: params.cuadernoId,
      contenido: params.contenido,
    });

    await this.textoOriginalRepo.save(textoOriginal);
    await this.dbAdapter.persist();

    return textoOriginalId;
  }
}
