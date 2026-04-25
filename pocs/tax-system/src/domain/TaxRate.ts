export class TaxRate {
  private constructor(private readonly basisPoints: number) {
    if (basisPoints < 0) throw new Error("TaxRate cannot be negative");
    if (basisPoints > 10000) throw new Error("TaxRate cannot exceed 100%");
  }

  static ofPercent(percent: number): TaxRate {
    return new TaxRate(Math.round(percent * 100));
  }

  static ofBasisPoints(bps: number): TaxRate {
    return new TaxRate(bps);
  }

  static zero(): TaxRate {
    return new TaxRate(0);
  }

  asPercent(): number {
    return this.basisPoints / 100;
  }

  asFactor(): number {
    return this.basisPoints / 10000;
  }

  add(other: TaxRate): TaxRate {
    return new TaxRate(this.basisPoints + other.basisPoints);
  }

  equals(other: TaxRate): boolean {
    return this.basisPoints === other.basisPoints;
  }

  isZero(): boolean {
    return this.basisPoints === 0;
  }

  format(): string {
    return `${this.asPercent().toFixed(2)}%`;
  }

  toString(): string {
    return this.format();
  }
}
