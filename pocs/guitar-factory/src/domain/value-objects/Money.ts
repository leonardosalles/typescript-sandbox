export class Money {
  constructor(
    private readonly cents: number,
    readonly currency = "USD",
  ) {
    if (!Number.isInteger(cents)) throw new Error("Money must use cents");
    if (cents < 0) throw new Error("Money cannot be negative");
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

  multiply(factor: number): Money {
    if (factor < 0) throw new Error("Money factor cannot be negative");
    return new Money(Math.round(this.cents * factor), this.currency);
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

export function dollars(amount: number, currency = "USD"): Money {
  return new Money(Math.round(amount * 100), currency);
}

export function cents(amount: number, currency = "USD"): Money {
  return new Money(amount, currency);
}

export function zeroMoney(currency = "USD"): Money {
  return new Money(0, currency);
}
