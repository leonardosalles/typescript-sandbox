export interface GroceryItemIdGenerator {
  next(): string;
}

export class SequentialGroceryItemIdGenerator implements GroceryItemIdGenerator {
  private nextNumber: number;
  private readonly prefix: string;

  constructor(prefix = "ITEM", firstNumber = 1) {
    if (!Number.isInteger(firstNumber) || firstNumber <= 0) {
      throw new Error("First item number must be a positive integer");
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
