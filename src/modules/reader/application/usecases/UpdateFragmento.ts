import { NotFoundError } from '@/shared/application/errors';
import type { FragmentoRepositoryPort } from '../ports/FragmentoRepositoryPort';
import type { SqlJsDatabaseAdapter } from '../../infrastructure/db/sqljs/SqlJsDatabaseAdapter';

export class UpdateFragmento {
  constructor(
    private fragmentoRepo: FragmentoRepositoryPort,
    private dbAdapter: SqlJsDatabaseAdapter
  ) {}

  async execute(params: {
    fragmentoId: string;
    nuevoTexto: string;
  }): Promise<void> {
    const fragmento = await this.fragmentoRepo.findById(params.fragmentoId);
    if (!fragmento) {
      throw new NotFoundError('Fragmento no encontrado');
    }

    const updatedFragmento = {
      ...fragmento,
      texto_actual: params.nuevoTexto,
    };

    await this.fragmentoRepo.update(updatedFragmento);
    await this.dbAdapter.persist();
  }
}
