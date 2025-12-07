import type { Unit } from '../../domain/entities/Unit';
import type { SegmentationModeValue } from '../../domain/values/SegmentationMode';

export interface UnitRepositoryPort {
  save(unit: Unit): Promise<void>;
  saveAll(units: Unit[]): Promise<void>;
  findById(unitId: string): Promise<Unit | null>;
  findByDocument(
    documentId: string,
    mode: SegmentationModeValue
  ): Promise<Unit[]>;
  findByDocumentAndPosition(
    documentId: string,
    mode: SegmentationModeValue,
    position: number
  ): Promise<Unit | null>;
  update(unit: Unit): Promise<void>;
  deleteByDocument(documentId: string): Promise<void>;
  countByDocument(
    documentId: string,
    mode: SegmentationModeValue,
    includeDeleted?: boolean
  ): Promise<number>;
}
