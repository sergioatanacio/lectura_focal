import type { Cuaderno } from '../../domain/entities/Cuaderno';

export interface CuadernoRepositoryPort {
  save(cuaderno: Cuaderno): Promise<void>;
  findById(cuadernoId: string): Promise<Cuaderno | null>;
  findAll(): Promise<Cuaderno[]>;
  update(cuaderno: Cuaderno): Promise<void>;
  delete(cuadernoId: string): Promise<void>;
}
