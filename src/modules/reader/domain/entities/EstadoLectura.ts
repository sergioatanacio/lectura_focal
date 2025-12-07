export interface EstadoLectura {
  texto_lectura_id: string;
  current_position: number;
  focus_mode: boolean;
}

export function createEstadoLectura(params: {
  texto_lectura_id: string;
  current_position?: number;
  focus_mode?: boolean;
}): EstadoLectura {
  return {
    texto_lectura_id: params.texto_lectura_id,
    current_position: params.current_position ?? 0,
    focus_mode: params.focus_mode ?? false,
  };
}
