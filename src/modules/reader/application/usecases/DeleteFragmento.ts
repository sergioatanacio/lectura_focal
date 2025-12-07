import { NotFoundError } from '@/shared/application/errors';
import type { FragmentoRepositoryPort } from '../ports/FragmentoRepositoryPort';
import type { LecturaViewDTO } from '../dto/FragmentoViewDTO';
import type { SqlJsDatabaseAdapter } from '../../infrastructure/db/sqljs/SqlJsDatabaseAdapter';
import { GetFragmentoView } from './GetFragmentoView';

export class DeleteFragmento {
  constructor(
    private fragmentoRepo: FragmentoRepositoryPort,
    private getFragmentoView: GetFragmentoView,
    private dbAdapter: SqlJsDatabaseAdapter
  ) {}

  async execute(params: {
    fragmentoId: string;
    textoLecturaId: string;
  }): Promise<LecturaViewDTO> {
    const fragmento = await this.fragmentoRepo.findById(params.fragmentoId);
    if (!fragmento) {
      throw new NotFoundError('Fragmento no encontrado');
    }

    const deletedFragmento = {
      ...fragmento,
      is_deleted: true,
    };

    await this.fragmentoRepo.update(deletedFragmento);
    await this.dbAdapter.persist();

    return this.getFragmentoView.execute(params.textoLecturaId);
  }
}
