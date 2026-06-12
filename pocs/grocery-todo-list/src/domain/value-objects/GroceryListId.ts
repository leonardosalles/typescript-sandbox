export class GroceryListId {
  private readonly value: string;

  constructor(value: string) {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new Error("Grocery list id is required");
    }

    this.value = normalized;
  }

  equals(other: GroceryListId): boolean {
    return this.value === other.value;
  }

  asString(): string {
    return this.value;
  }
}
