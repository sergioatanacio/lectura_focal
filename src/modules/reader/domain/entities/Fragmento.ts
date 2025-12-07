export interface Fragmento {
  fragmento_id: string;
  texto_lectura_id: string;
  position: number;
  texto_original: string;
  texto_actual: string;
  is_deleted: boolean;
}

export function createFragmento(params: {
  fragmento_id: string;
  texto_lectura_id: string;
  position: number;
  texto: string;
}): Fragmento {
  return {
    fragmento_id: params.fragmento_id,
    texto_lectura_id: params.texto_lectura_id,
    position: params.position,
    texto_original: params.texto,
    texto_actual: params.texto,
    is_deleted: false,
  };
}
