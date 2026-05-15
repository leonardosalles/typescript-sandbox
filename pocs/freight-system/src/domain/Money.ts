export class Money {
  private constructor(
    private readonly cents: number,
    readonly currency = "USD",
  ) {
    if (!Number.isInteger(cents)) throw new Error("Money must use cents");
    if (cents < 0) throw new Error("Money cannot be negative");
  }

  static dollars(amount: number, currency = "USD"): Money {
    return new Money(Math.round(amount * 100), currency);
  }

  static cents(amount: number, currency = "USD"): Money {
    return new Money(amount, currency);
  }

  static zero(currency = "USD"): Money {
    return new Money(0, currency);
  }

  asCents(): number {
    return this.cents;
  }

  asDollars(): number {
    return this.cents / 100;
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.cents + other.cents, this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    if (other.cents > this.cents) throw new Error("Money cannot go below zero");
    return new Money(this.cents - other.cents, this.currency);
  }

  multiply(factor: number): Money {
    if (factor < 0) throw new Error("Money factor cannot be negative");
    return new Money(Math.round(this.cents * factor), this.currency);
  }

  max(other: Money): Money {
    this.assertSameCurrency(other);
    return this.cents >= other.cents ? this : other;
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
}
