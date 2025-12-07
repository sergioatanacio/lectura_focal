import type { SegmentationModeValue } from '../values/SegmentationMode';

export interface TextoDeLectura {
  texto_lectura_id: string;
  texto_original_id: string;
  modo_segmentacion: SegmentationModeValue;
  nombre?: string;
  created_at: number;
}

export function createTextoDeLectura(params: {
  texto_lectura_id: string;
  texto_original_id: string;
  modo_segmentacion: SegmentationModeValue;
  nombre?: string;
}): TextoDeLectura {
  return {
    texto_lectura_id: params.texto_lectura_id,
    texto_original_id: params.texto_original_id,
    modo_segmentacion: params.modo_segmentacion,
    nombre: params.nombre,
    created_at: Date.now(),
  };
}
