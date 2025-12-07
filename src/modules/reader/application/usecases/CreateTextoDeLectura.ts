import { generateId } from '@/shared/domain/ids';
import { ValidationError, NotFoundError } from '@/shared/application/errors';
import { createTextoDeLectura } from '../../domain/entities/TextoDeLectura';
import { createFragmento } from '../../domain/entities/Fragmento';
import { createEstadoLectura } from '../../domain/entities/EstadoLectura';
import type { TextoDeLecturaRepositoryPort } from '../ports/TextoDeLecturaRepositoryPort';
import type { TextoOriginalRepositoryPort } from '../ports/TextoOriginalRepositoryPort';
import type { FragmentoRepositoryPort } from '../ports/FragmentoRepositoryPort';
import type { EstadoLecturaPort } from '../ports/EstadoLecturaPort';
import type { SegmentationModeValue } from '../../domain/values/SegmentationMode';
import type { SqlJsDatabaseAdapter } from '../../infrastructure/db/sqljs/SqlJsDatabaseAdapter';
import { segmentText } from './segmentation';

export class CreateTextoDeLectura {
  constructor(
    private textoDeLecturaRepo: TextoDeLecturaRepositoryPort,
    private textoOriginalRepo: TextoOriginalRepositoryPort,
    private fragmentoRepo: FragmentoRepositoryPort,
    private estadoLecturaRepo: EstadoLecturaPort,
    private dbAdapter: SqlJsDatabaseAdapter
  ) {}

  async execute(params: {
    textoOriginalId: string;
    modoSegmentacion: SegmentationModeValue;
    nombre?: string;
  }): Promise<string> {
    const textoOriginal = await this.textoOriginalRepo.findById(
      params.textoOriginalId
    );
    if (!textoOriginal) {
      throw new NotFoundError('Texto original no encontrado');
    }

    const textoLecturaId = generateId();
    const textoDeLectura = createTextoDeLectura({
      texto_lectura_id: textoLecturaId,
      texto_original_id: params.textoOriginalId,
      modo_segmentacion: params.modoSegmentacion,
      nombre: params.nombre,
    });

    await this.textoDeLecturaRepo.save(textoDeLectura);

    const segments = segmentText(
      textoOriginal.contenido,
      params.modoSegmentacion
    );
    const fragmentos = segments.map((texto, index) =>
      createFragmento({
        fragmento_id: generateId(),
        texto_lectura_id: textoLecturaId,
        position: index,
        texto,
      })
    );

    if (fragmentos.length > 0) {
      await this.fragmentoRepo.saveAll(fragmentos);
    }

    const estadoLectura = createEstadoLectura({
      texto_lectura_id: textoLecturaId,
      current_position: 0,
      focus_mode: false,
    });

    await this.estadoLecturaRepo.save(estadoLectura);
    await this.dbAdapter.persist();

    return textoLecturaId;
  }
}
