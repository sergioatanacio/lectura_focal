import { NotFoundError } from '@/shared/application/errors';
import type { EstadoLecturaPort } from '../ports/EstadoLecturaPort';
import type { LecturaViewDTO } from '../dto/FragmentoViewDTO';
import type { SqlJsDatabaseAdapter } from '../../infrastructure/db/sqljs/SqlJsDatabaseAdapter';
import { GetFragmentoView } from './GetFragmentoView';

export class PrevFragmento {
  constructor(
    private estadoLecturaRepo: EstadoLecturaPort,
    private getFragmentoView: GetFragmentoView,
    private dbAdapter: SqlJsDatabaseAdapter
  ) {}

  async execute(textoLecturaId: string): Promise<LecturaViewDTO> {
    const estado = await this.estadoLecturaRepo.findByTextoLectura(
      textoLecturaId
    );
    if (!estado) {
      throw new NotFoundError('Estado de lectura no encontrado');
    }

    if (estado.current_position > 0) {
      estado.current_position -= 1;
      await this.estadoLecturaRepo.update(estado);
      await this.dbAdapter.persist();
    }

    return this.getFragmentoView.execute(textoLecturaId);
  }
}
