import type { TextoOriginal } from '../../domain/entities/TextoOriginal';

export interface TextoOriginalRepositoryPort {
  save(textoOriginal: TextoOriginal): Promise<void>;
  findById(textoOriginalId: string): Promise<TextoOriginal | null>;
  findByCuaderno(cuadernoId: string): Promise<TextoOriginal[]>;
  delete(textoOriginalId: string): Promise<void>;
}
