import { NotFoundError } from '@/shared/application/errors';
import type { TextoDeLecturaRepositoryPort } from '../ports/TextoDeLecturaRepositoryPort';
import type { TextoOriginalRepositoryPort } from '../ports/TextoOriginalRepositoryPort';
import type { CuadernoRepositoryPort } from '../ports/CuadernoRepositoryPort';
import type { FragmentoRepositoryPort } from '../ports/FragmentoRepositoryPort';
import type { CommentRepositoryPort } from '../ports/CommentRepositoryPort';
import type { EstadoLecturaPort } from '../ports/EstadoLecturaPort';
import type { LecturaViewDTO } from '../dto/FragmentoViewDTO';

export class GetFragmentoView {
  constructor(
    private textoDeLecturaRepo: TextoDeLecturaRepositoryPort,
    private textoOriginalRepo: TextoOriginalRepositoryPort,
    private cuadernoRepo: CuadernoRepositoryPort,
    private fragmentoRepo: FragmentoRepositoryPort,
    private commentRepo: CommentRepositoryPort,
    private estadoLecturaRepo: EstadoLecturaPort
  ) {}

  async execute(textoLecturaId: string): Promise<LecturaViewDTO> {
    const textoDeLectura = await this.textoDeLecturaRepo.findById(
      textoLecturaId
    );
    if (!textoDeLectura) {
      throw new NotFoundError('Texto de lectura no encontrado');
    }

    const textoOriginal = await this.textoOriginalRepo.findById(
      textoDeLectura.texto_original_id
    );
    if (!textoOriginal) {
      throw new NotFoundError('Texto original no encontrado');
    }

    const cuaderno = await this.cuadernoRepo.findById(
      textoOriginal.cuaderno_id
    );
    if (!cuaderno) {
      throw new NotFoundError('Cuaderno no encontrado');
    }

    let estadoLectura = await this.estadoLecturaRepo.findByTextoLectura(
      textoLecturaId
    );

    if (!estadoLectura) {
      throw new NotFoundError('Estado de lectura no encontrado');
    }

    const fragmentos = await this.fragmentoRepo.findByTextoLectura(
      textoLecturaId
    );
    const activeFragmentos = fragmentos.filter((f) => !f.is_deleted);
    const totalFragmentos = activeFragmentos.length;

    if (
      estadoLectura.current_position < 0 ||
      estadoLectura.current_position >= totalFragmentos
    ) {
      estadoLectura.current_position = totalFragmentos > 0 ? 0 : 0;
      await this.estadoLecturaRepo.update(estadoLectura);
    }

    const currentFragmento =
      activeFragmentos.length > 0
        ? activeFragmentos[estadoLectura.current_position]
        : null;

    const comments = currentFragmento
      ? await this.commentRepo.findByUnit(currentFragmento.fragmento_id)
      : [];

    return {
      texto_lectura_id: textoLecturaId,
      cuaderno_id: cuaderno.cuaderno_id,
      nombre_cuaderno: cuaderno.nombre,
      nombre_lectura: textoDeLectura.nombre,
      modo_segmentacion: textoDeLectura.modo_segmentacion,
      current_fragmento: currentFragmento
        ? {
            fragmento_id: currentFragmento.fragmento_id,
            texto_lectura_id: currentFragmento.texto_lectura_id,
            position: estadoLectura.current_position,
            texto_actual: currentFragmento.texto_actual,
            texto_original: currentFragmento.texto_original,
            total_fragmentos: totalFragmentos,
            comments,
          }
        : null,
      focus_mode: estadoLectura.focus_mode,
      has_next: estadoLectura.current_position < totalFragmentos - 1,
      has_prev: estadoLectura.current_position > 0,
    };
  }
}
