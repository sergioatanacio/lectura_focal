export interface Cuaderno {
  cuaderno_id: string;
  nombre: string;
  created_at: number;
  updated_at: number;
}

export function createCuaderno(params: {
  cuaderno_id: string;
  nombre: string;
}): Cuaderno {
  const now = Date.now();
  return {
    cuaderno_id: params.cuaderno_id,
    nombre: params.nombre,
    created_at: now,
    updated_at: now,
  };
}
