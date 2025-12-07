import type { SegmentationModeValue } from '../values/SegmentationMode';

export interface Unit {
  unit_id: string;
  document_id: string;
  position: number;
  mode: SegmentationModeValue;
  original_text: string;
  current_text: string;
  is_deleted: boolean;
}

export function createUnit(params: {
  unit_id: string;
  document_id: string;
  position: number;
  mode: SegmentationModeValue;
  text: string;
}): Unit {
  return {
    unit_id: params.unit_id,
    document_id: params.document_id,
    position: params.position,
    mode: params.mode,
    original_text: params.text,
    current_text: params.text,
    is_deleted: false,
  };
}
