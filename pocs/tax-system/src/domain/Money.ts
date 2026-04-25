export class Money {
  private constructor(
    private readonly cents: number,
    readonly currency: string = "USD",
  ) {
    if (!Number.isInteger(cents))
      throw new Error("Money must be integer cents");
    if (cents < 0) throw new Error("Money cannot be negative");
  }

  static ofDollars(amount: number, currency = "USD"): Money {
    return new Money(Math.round(amount * 100), currency);
  }

  static ofCents(cents: number, currency = "USD"): Money {
    return new Money(cents, currency);
  }

  static zero(currency = "USD"): Money {
    return new Money(0, currency);
  }

  asDollars(): number {
    return this.cents / 100;
  }

  asCents(): number {
    return this.cents;
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.cents + other.cents, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(Math.round(this.cents * factor), this.currency);
  }

  equals(other: Money): boolean {
    return this.cents === other.cents && this.currency === other.currency;
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.cents > other.cents;
  }

  format(): string {
    return `$${this.asDollars().toFixed(2)}`;
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(
        `Currency mismatch: ${this.currency} vs ${other.currency}`,
      );
    }
  }

  toString(): string {
    return this.format();
  }
}
