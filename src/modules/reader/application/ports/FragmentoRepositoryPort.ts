import type { Fragmento } from '../../domain/entities/Fragmento';

export interface FragmentoRepositoryPort {
  save(fragmento: Fragmento): Promise<void>;
  saveAll(fragmentos: Fragmento[]): Promise<void>;
  findById(fragmentoId: string): Promise<Fragmento | null>;
  findByTextoLectura(textoLecturaId: string): Promise<Fragmento[]>;
  findByTextoLecturaAndPosition(
    textoLecturaId: string,
    position: number
  ): Promise<Fragmento | null>;
  update(fragmento: Fragmento): Promise<void>;
  deleteByTextoLectura(textoLecturaId: string): Promise<void>;
  countByTextoLectura(
    textoLecturaId: string,
    includeDeleted?: boolean
  ): Promise<number>;
}
