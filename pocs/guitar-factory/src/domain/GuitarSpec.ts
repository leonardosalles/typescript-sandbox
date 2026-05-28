import {
  BodyShape,
  Finish,
  GuitarFamily,
  GuitarSpecInput,
  OperatingSystem,
  PickupSet,
  ToneWood,
} from "./GuitarTypes";

const allowedShapes = new Map<GuitarFamily, BodyShape[]>([
  [GuitarFamily.Electric, [BodyShape.Strat, BodyShape.LesPaul, BodyShape.Tele]],
  [GuitarFamily.Acoustic, [BodyShape.Dreadnought]],
  [GuitarFamily.Bass, [BodyShape.JazzBass]],
]);

const allowedPickups = new Map<GuitarFamily, PickupSet[]>([
  [
    GuitarFamily.Electric,
    [PickupSet.SingleCoil, PickupSet.Humbucker, PickupSet.P90],
  ],
  [GuitarFamily.Acoustic, [PickupSet.Piezo]],
  [GuitarFamily.Bass, [PickupSet.JazzBass, PickupSet.Humbucker]],
]);

const defaultShape = new Map<GuitarFamily, BodyShape>([
  [GuitarFamily.Electric, BodyShape.Strat],
  [GuitarFamily.Acoustic, BodyShape.Dreadnought],
  [GuitarFamily.Bass, BodyShape.JazzBass],
]);

const defaultPickup = new Map<GuitarFamily, PickupSet>([
  [GuitarFamily.Electric, PickupSet.Humbucker],
  [GuitarFamily.Acoustic, PickupSet.Piezo],
  [GuitarFamily.Bass, PickupSet.JazzBass],
]);

const defaultStrings = new Map<GuitarFamily, number>([
  [GuitarFamily.Electric, 6],
  [GuitarFamily.Acoustic, 6],
  [GuitarFamily.Bass, 4],
]);

export class GuitarSpec {
  readonly family: GuitarFamily;
  readonly model: string;
  readonly bodyShape: BodyShape;
  readonly toneWood: ToneWood;
  readonly pickupSet: PickupSet;
  readonly finish: Finish;
  readonly operatingSystem: OperatingSystem;
  readonly strings: number;
  readonly leftHanded: boolean;

  constructor(input: GuitarSpecInput) {
    const normalized = this.normalize(input);

    this.family = normalized.family;
    this.model = normalized.model;
    this.bodyShape = normalized.bodyShape;
    this.toneWood = normalized.toneWood;
    this.pickupSet = normalized.pickupSet;
    this.finish = normalized.finish;
    this.operatingSystem = normalized.operatingSystem;
    this.strings = normalized.strings;
    this.leftHanded = normalized.leftHanded;
  }

  with(changes: Partial<GuitarSpecInput>): GuitarSpec {
    return new GuitarSpec({ ...this.toInput(), ...changes });
  }

  toInput(): GuitarSpecInput {
    return {
      family: this.family,
      model: this.model,
      bodyShape: this.bodyShape,
      toneWood: this.toneWood,
      pickupSet: this.pickupSet,
      finish: this.finish,
      operatingSystem: this.operatingSystem,
      strings: this.strings,
      leftHanded: this.leftHanded,
    };
  }

  private normalize(input: GuitarSpecInput): GuitarSpecInput {
    const shapes = allowedShapes.get(input.family) ?? [];
    const pickups = allowedPickups.get(input.family) ?? [];
    const bodyShape = shapes.includes(input.bodyShape)
      ? input.bodyShape
      : this.required(defaultShape, input.family);
    const pickupSet = pickups.includes(input.pickupSet)
      ? input.pickupSet
      : this.required(defaultPickup, input.family);
    const strings = this.normalizeStrings(input);
    const model =
      input.model.trim().length >= 3
        ? input.model.trim()
        : `${input.family} Custom`;

    return {
      ...input,
      model,
      bodyShape,
      pickupSet,
      strings,
    };
  }

  private normalizeStrings(input: GuitarSpecInput): number {
    if (input.family === GuitarFamily.Bass) {
      return [4, 5].includes(input.strings) ? input.strings : 4;
    }

    if ([6, 7, 12].includes(input.strings)) {
      return input.strings;
    }

    return this.required(defaultStrings, input.family);
  }

  private required<T>(table: Map<GuitarFamily, T>, family: GuitarFamily): T {
    const value = table.get(family);
    if (!value) throw new Error(`Missing defaults for ${family}`);
    return value;
  }
}
