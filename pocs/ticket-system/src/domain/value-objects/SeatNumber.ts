export class SeatNumber {
  private readonly value: string;

  constructor(value: string) {
    const normalized = value.trim().toUpperCase();

    if (!/^[A-Z][0-9]{1,3}$/.test(normalized)) {
      throw new Error("Seat number must look like A1, B12, or C120");
    }

    this.value = normalized;
  }

  equals(other: SeatNumber): boolean {
    return this.value === other.value;
  }

  asString(): string {
    return this.value;
  }
}
