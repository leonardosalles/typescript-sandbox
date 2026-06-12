export class ProductName {
  private readonly value: string;

  constructor(value: string) {
    const normalized = value.trim().replace(/\s+/g, " ");

    if (normalized.length < 2) {
      throw new Error("Product name must have at least 2 characters");
    }

    if (normalized.length > 80) {
      throw new Error("Product name must have at most 80 characters");
    }

    this.value = normalized;
  }

  equals(other: ProductName): boolean {
    return this.value.toLocaleLowerCase() === other.value.toLocaleLowerCase();
  }

  asString(): string {
    return this.value;
  }
}
