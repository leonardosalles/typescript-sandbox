export class Money {
  private readonly cents: number;

  constructor(cents: number) {
    if (!Number.isInteger(cents)) {
      throw new Error("Money must be represented as integer cents");
    }

    if (cents < 0) {
      throw new Error("Money cannot be negative");
    }

    this.cents = cents;
  }

  plus(other: Money): Money {
    return new Money(this.cents + other.cents);
  }

  times(quantity: number): Money {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error("Quantity multiplier must be a non-negative integer");
    }

    return new Money(this.cents * quantity);
  }

  asCents(): number {
    return this.cents;
  }

  format(currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(this.cents / 100);
  }
}
