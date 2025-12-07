import type { SegmentationModeValue } from '../../domain/values/SegmentationMode';
import type { Comment } from '../../domain/entities/Comment';

export interface FragmentoViewDTO {
  fragmento_id: string;
  texto_lectura_id: string;
  position: number;
  texto_actual: string;
  texto_original: string;
  total_fragmentos: number;
  comments: Comment[];
}

export interface LecturaViewDTO {
  texto_lectura_id: string;
  cuaderno_id: string;
  nombre_cuaderno: string;
  nombre_lectura?: string;
  modo_segmentacion: SegmentationModeValue;
  current_fragmento: FragmentoViewDTO | null;
  focus_mode: boolean;
  has_next: boolean;
  has_prev: boolean;
}
