export class Volume {
  private constructor(private readonly cubicMeters: number) {
    if (cubicMeters <= 0) throw new Error("Volume must be greater than zero");
  }

  static cubicMeters(value: number): Volume {
    return new Volume(value);
  }

  static fromBox(lengthM: number, widthM: number, heightM: number): Volume {
    return new Volume(lengthM * widthM * heightM);
  }

  asCubicMeters(): number {
    return this.cubicMeters;
  }

  isAtLeast(value: number): boolean {
    return this.cubicMeters >= value;
  }
}
