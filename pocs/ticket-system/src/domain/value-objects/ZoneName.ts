export class ZoneName {
  private readonly value: string;

  constructor(value: string) {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new Error("Zone name is required");
    }

    this.value = normalized;
  }

  equals(other: ZoneName): boolean {
    return this.value === other.value;
  }

  asString(): string {
    return this.value;
  }
}
