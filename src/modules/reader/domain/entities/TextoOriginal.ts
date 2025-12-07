export interface TextoOriginal {
  texto_original_id: string;
  cuaderno_id: string;
  contenido: string;
  created_at: number;
}

export function createTextoOriginal(params: {
  texto_original_id: string;
  cuaderno_id: string;
  contenido: string;
}): TextoOriginal {
  return {
    texto_original_id: params.texto_original_id,
    cuaderno_id: params.cuaderno_id,
    contenido: params.contenido,
    created_at: Date.now(),
  };
}
