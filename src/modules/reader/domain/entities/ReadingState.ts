import type { SegmentationModeValue } from '../values/SegmentationMode';

export interface ReadingState {
  document_id: string;
  mode: SegmentationModeValue;
  current_position: number;
  focus_mode: boolean;
}

export function createReadingState(params: {
  document_id: string;
  mode: SegmentationModeValue;
  current_position?: number;
  focus_mode?: boolean;
}): ReadingState {
  return {
    document_id: params.document_id,
    mode: params.mode,
    current_position: params.current_position ?? 0,
    focus_mode: params.focus_mode ?? false,
  };
}
