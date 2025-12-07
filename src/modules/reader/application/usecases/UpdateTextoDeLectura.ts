import { NotFoundError } from '@/shared/application/errors';
import type { TextoDeLecturaRepositoryPort } from '../ports/TextoDeLecturaRepositoryPort';
import type { SqlJsDatabaseAdapter } from '../../infrastructure/db/sqljs/SqlJsDatabaseAdapter';

export class UpdateTextoDeLectura {
  constructor(
    private textoDeLecturaRepo: TextoDeLecturaRepositoryPort,
    private dbAdapter: SqlJsDatabaseAdapter
  ) {}

  async execute(params: {
    textoLecturaId: string;
    nombre?: string;
  }): Promise<void> {
    const textoDeLectura = await this.textoDeLecturaRepo.findById(
      params.textoLecturaId
    );
    if (!textoDeLectura) {
      throw new NotFoundError('Texto de lectura no encontrado');
    }

    const updatedTexto = {
      ...textoDeLectura,
      nombre: params.nombre?.trim(),
    };

    await this.textoDeLecturaRepo.update(updatedTexto);
    await this.dbAdapter.persist();
  }
}
