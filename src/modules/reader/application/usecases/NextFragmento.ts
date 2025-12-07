import { NotFoundError } from '@/shared/application/errors';
import type { EstadoLecturaPort } from '../ports/EstadoLecturaPort';
import type { FragmentoRepositoryPort } from '../ports/FragmentoRepositoryPort';
import type { LecturaViewDTO } from '../dto/FragmentoViewDTO';
import type { SqlJsDatabaseAdapter } from '../../infrastructure/db/sqljs/SqlJsDatabaseAdapter';
import { GetFragmentoView } from './GetFragmentoView';

export class NextFragmento {
  constructor(
    private estadoLecturaRepo: EstadoLecturaPort,
    private fragmentoRepo: FragmentoRepositoryPort,
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

    const fragmentos = await this.fragmentoRepo.findByTextoLectura(
      textoLecturaId
    );
    const activeFragmentos = fragmentos.filter((f) => !f.is_deleted);
    const totalFragmentos = activeFragmentos.length;

    if (estado.current_position < totalFragmentos - 1) {
      estado.current_position += 1;
      await this.estadoLecturaRepo.update(estado);
      await this.dbAdapter.persist();
    }

    return this.getFragmentoView.execute(textoLecturaId);
  }
}
