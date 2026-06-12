export class Quantity {
  private readonly amount: number;
  private readonly unit: string;

  constructor(amount: number, unit: string) {
    const normalizedUnit = unit.trim().toLocaleLowerCase();

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Quantity amount must be greater than zero");
    }

    if (normalizedUnit.length === 0) {
      throw new Error("Quantity unit is required");
    }

    this.amount = amount;
    this.unit = normalizedUnit;
  }

  describe(): string {
    return `${this.amount} ${this.unit}`;
  }

  equals(other: Quantity): boolean {
    return this.amount === other.amount && this.unit === other.unit;
  }
}
