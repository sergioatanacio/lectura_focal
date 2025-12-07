import type { TextoDeLecturaRepositoryPort } from '../ports/TextoDeLecturaRepositoryPort';

export interface TextoLecturaListItem {
  texto_lectura_id: string;
  texto_original_id: string;
  modo_segmentacion: string;
  nombre?: string;
  created_at: number;
}

export class ListTextosDeLectura {
  constructor(private textoDeLecturaRepo: TextoDeLecturaRepositoryPort) {}

  async execute(cuadernoId: string): Promise<TextoLecturaListItem[]> {
    const textos = await this.textoDeLecturaRepo.findByCuaderno(cuadernoId);

    return textos.map((t) => ({
      texto_lectura_id: t.texto_lectura_id,
      texto_original_id: t.texto_original_id,
      modo_segmentacion: t.modo_segmentacion,
      nombre: t.nombre,
      created_at: t.created_at,
    }));
  }
}
