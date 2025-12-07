import type { EstadoLectura } from '../../domain/entities/EstadoLectura';

export interface EstadoLecturaPort {
  save(estado: EstadoLectura): Promise<void>;
  findByTextoLectura(textoLecturaId: string): Promise<EstadoLectura | null>;
  update(estado: EstadoLectura): Promise<void>;
  delete(textoLecturaId: string): Promise<void>;
}
