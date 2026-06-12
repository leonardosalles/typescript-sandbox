export class GroceryItemId {
  private readonly value: string;

  constructor(value: string) {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new Error("Grocery item id is required");
    }

    this.value = normalized;
  }

  equals(other: GroceryItemId): boolean {
    return this.value === other.value;
  }

  asString(): string {
    return this.value;
  }
}
