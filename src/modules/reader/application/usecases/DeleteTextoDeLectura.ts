import { NotFoundError } from '@/shared/application/errors';
import type { TextoDeLecturaRepositoryPort } from '../ports/TextoDeLecturaRepositoryPort';
import type { FragmentoRepositoryPort } from '../ports/FragmentoRepositoryPort';
import type { EstadoLecturaPort } from '../ports/EstadoLecturaPort';
import type { SqlJsDatabaseAdapter } from '../../infrastructure/db/sqljs/SqlJsDatabaseAdapter';

export class DeleteTextoDeLectura {
  constructor(
    private textoDeLecturaRepo: TextoDeLecturaRepositoryPort,
    private fragmentoRepo: FragmentoRepositoryPort,
    private estadoLecturaRepo: EstadoLecturaPort,
    private dbAdapter: SqlJsDatabaseAdapter
  ) {}

  async execute(textoLecturaId: string): Promise<void> {
    // Verificar que existe
    const textoDeLectura = await this.textoDeLecturaRepo.findById(
      textoLecturaId
    );
    if (!textoDeLectura) {
      throw new NotFoundError('Texto de lectura no encontrado');
    }

    // Eliminar fragmentos asociados
    await this.fragmentoRepo.deleteByTextoLectura(textoLecturaId);

    // Eliminar estado de lectura
    try {
      await this.estadoLecturaRepo.delete(textoLecturaId);
    } catch {
      // Puede no existir, no es crítico
    }

    // Eliminar texto de lectura
    await this.textoDeLecturaRepo.delete(textoLecturaId);

    // Persistir cambios
    await this.dbAdapter.persist();
  }
}
