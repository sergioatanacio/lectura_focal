import { NotFoundError } from '@/shared/application/errors';
import type { CuadernoRepositoryPort } from '../ports/CuadernoRepositoryPort';
import type { TextoOriginalRepositoryPort } from '../ports/TextoOriginalRepositoryPort';
import type { TextoDeLecturaRepositoryPort } from '../ports/TextoDeLecturaRepositoryPort';
import type { FragmentoRepositoryPort } from '../ports/FragmentoRepositoryPort';
import type { EstadoLecturaPort } from '../ports/EstadoLecturaPort';
import type { SqlJsDatabaseAdapter } from '../../infrastructure/db/sqljs/SqlJsDatabaseAdapter';

export class DeleteCuaderno {
  constructor(
    private cuadernoRepo: CuadernoRepositoryPort,
    private textoOriginalRepo: TextoOriginalRepositoryPort,
    private textoDeLecturaRepo: TextoDeLecturaRepositoryPort,
    private fragmentoRepo: FragmentoRepositoryPort,
    private estadoLecturaRepo: EstadoLecturaPort,
    private dbAdapter: SqlJsDatabaseAdapter
  ) {}

  async execute(cuadernoId: string): Promise<void> {
    // Verificar que existe
    const cuaderno = await this.cuadernoRepo.findById(cuadernoId);
    if (!cuaderno) {
      throw new NotFoundError('Cuaderno no encontrado');
    }

    // Obtener todos los textos originales del cuaderno
    const textosOriginales = await this.textoOriginalRepo.findByCuaderno(
      cuadernoId
    );

    // Para cada texto original, eliminar sus textos de lectura y fragmentos
    for (const textoOriginal of textosOriginales) {
      const textosDeLectura = await this.textoDeLecturaRepo.findByTextoOriginal(
        textoOriginal.texto_original_id
      );

      for (const textoDeLectura of textosDeLectura) {
        // Eliminar fragmentos
        await this.fragmentoRepo.deleteByTextoLectura(
          textoDeLectura.texto_lectura_id
        );

        // Eliminar estado de lectura
        try {
          await this.estadoLecturaRepo.delete(textoDeLectura.texto_lectura_id);
        } catch {
          // Puede no existir, no es crítico
        }

        // Eliminar texto de lectura
        await this.textoDeLecturaRepo.delete(textoDeLectura.texto_lectura_id);
      }

      // Eliminar texto original
      await this.textoOriginalRepo.delete(textoOriginal.texto_original_id);
    }

    // Eliminar cuaderno
    await this.cuadernoRepo.delete(cuadernoId);

    // Persistir cambios
    await this.dbAdapter.persist();
  }
}
