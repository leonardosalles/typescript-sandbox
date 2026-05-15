export class Weight {
  private constructor(private readonly kilograms: number) {
    if (kilograms <= 0) throw new Error("Weight must be greater than zero");
  }

  static kilograms(value: number): Weight {
    return new Weight(value);
  }

  asKilograms(): number {
    return this.kilograms;
  }
}
