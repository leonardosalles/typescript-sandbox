export interface OrderIdGenerator {
  next(): string;
}

export class SequentialOrderIdGenerator implements OrderIdGenerator {
  private nextNumber: number;
  private readonly prefix: string;

  constructor(prefix = "ORD", firstNumber = 1) {
    if (!Number.isInteger(firstNumber) || firstNumber <= 0) {
      throw new Error("First order number must be a positive integer");
    }

    this.prefix = prefix;
    this.nextNumber = firstNumber;
  }

  next(): string {
    const id = `${this.prefix}-${String(this.nextNumber).padStart(4, "0")}`;
    this.nextNumber += 1;
    return id;
  }
}
