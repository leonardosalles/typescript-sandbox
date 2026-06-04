export class ShowId {
  private readonly value: string;

  constructor(value: string) {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new Error("Show id is required");
    }

    this.value = normalized;
  }

  equals(other: ShowId): boolean {
    return this.value === other.value;
  }

  asString(): string {
    return this.value;
  }
}
