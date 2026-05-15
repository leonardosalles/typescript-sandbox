export class Distance {
  private constructor(private readonly kilometers: number) {
    if (kilometers <= 0) throw new Error("Distance must be greater than zero");
  }

  static kilometers(value: number): Distance {
    return new Distance(value);
  }

  asKilometers(): number {
    return this.kilometers;
  }
}
