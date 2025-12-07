export type SegmentationModeValue = 'ORACION' | 'PARRAFO';

export class SegmentationMode {
  private constructor(private readonly value: SegmentationModeValue) {}

  static ORACION = new SegmentationMode('ORACION');
  static PARRAFO = new SegmentationMode('PARRAFO');

  static fromString(value: string): SegmentationMode {
    if (value === 'ORACION') return SegmentationMode.ORACION;
    if (value === 'PARRAFO') return SegmentationMode.PARRAFO;
    throw new Error(`Invalid SegmentationMode: ${value}`);
  }

  toString(): SegmentationModeValue {
    return this.value;
  }

  equals(other: SegmentationMode): boolean {
    return this.value === other.value;
  }
}
