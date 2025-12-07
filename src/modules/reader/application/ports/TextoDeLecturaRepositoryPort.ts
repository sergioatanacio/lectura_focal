import type { TextoDeLectura } from '../../domain/entities/TextoDeLectura';

export interface TextoDeLecturaRepositoryPort {
  save(textoDeLectura: TextoDeLectura): Promise<void>;
  findById(textoLecturaId: string): Promise<TextoDeLectura | null>;
  findByTextoOriginal(textoOriginalId: string): Promise<TextoDeLectura[]>;
  findByCuaderno(cuadernoId: string): Promise<TextoDeLectura[]>;
  update(textoDeLectura: TextoDeLectura): Promise<void>;
  delete(textoLecturaId: string): Promise<void>;
}
