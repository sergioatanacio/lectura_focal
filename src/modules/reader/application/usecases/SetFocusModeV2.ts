import { NotFoundError } from '@/shared/application/errors';
import type { EstadoLecturaPort } from '../ports/EstadoLecturaPort';
import type { LecturaViewDTO } from '../dto/FragmentoViewDTO';
import type { SqlJsDatabaseAdapter } from '../../infrastructure/db/sqljs/SqlJsDatabaseAdapter';
import { GetFragmentoView } from './GetFragmentoView';

export class SetFocusModeV2 {
  constructor(
    private estadoLecturaRepo: EstadoLecturaPort,
    private getFragmentoView: GetFragmentoView,
    private dbAdapter: SqlJsDatabaseAdapter
  ) {}

  async execute(params: {
    textoLecturaId: string;
    focusMode: boolean;
  }): Promise<LecturaViewDTO> {
    const estado = await this.estadoLecturaRepo.findByTextoLectura(
      params.textoLecturaId
    );
    if (!estado) {
      throw new NotFoundError('Estado de lectura no encontrado');
    }

    const updatedEstado = {
      ...estado,
      focus_mode: params.focusMode,
    };

    await this.estadoLecturaRepo.update(updatedEstado);
    await this.dbAdapter.persist();

    return this.getFragmentoView.execute(params.textoLecturaId);
  }
}
