import type { CuadernoRepositoryPort } from '../ports/CuadernoRepositoryPort';
import type { Cuaderno } from '../../domain/entities/Cuaderno';

export class ListCuadernos {
  constructor(private cuadernoRepo: CuadernoRepositoryPort) {}

  async execute(): Promise<Cuaderno[]> {
    return await this.cuadernoRepo.findAll();
  }
}
