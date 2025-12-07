import type { SegmentationModeValue } from '../../domain/values/SegmentationMode';
import type { Comment } from '../../domain/entities/Comment';

export interface UnitViewDTO {
  unit_id: string;
  document_id: string;
  position: number;
  current_text: string;
  original_text: string;
  total_units: number;
  comments: Comment[];
}

export interface ReadingViewDTO {
  document_id: string;
  document_title?: string;
  mode: SegmentationModeValue;
  current_unit: UnitViewDTO | null;
  focus_mode: boolean;
  has_next: boolean;
  has_prev: boolean;
}

export interface DocumentListDTO {
  document_id: string;
  title?: string;
  created_at: number;
  updated_at: number;
  text_preview: string;
}
