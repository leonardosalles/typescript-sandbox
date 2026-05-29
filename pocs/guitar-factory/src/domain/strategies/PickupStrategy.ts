import { GuitarSpec } from "../GuitarSpec";
import { PickupSet } from "../GuitarTypes";

export type ToneProfile = {
  brightness: number;
  warmth: number;
  output: number;
  description: string;
};

export interface PickupStrategy {
  tone(spec: GuitarSpec): ToneProfile;
}

export class MagneticPickupStrategy implements PickupStrategy {
  tone(spec: GuitarSpec): ToneProfile {
    const profiles = new Map<PickupSet, ToneProfile>([
      [
        PickupSet.SingleCoil,
        {
          brightness: 92,
          warmth: 42,
          output: 48,
          description: "glassy attack",
        },
      ],
      [
        PickupSet.Humbucker,
        {
          brightness: 58,
          warmth: 82,
          output: 88,
          description: "thick sustain",
        },
      ],
      [
        PickupSet.P90,
        { brightness: 72, warmth: 66, output: 70, description: "raw midrange" },
      ],
      [
        PickupSet.Piezo,
        {
          brightness: 86,
          warmth: 54,
          output: 45,
          description: "acoustic snap",
        },
      ],
      [
        PickupSet.JazzBass,
        {
          brightness: 64,
          warmth: 78,
          output: 68,
          description: "round low end",
        },
      ],
    ]);

    const profile = profiles.get(spec.pickupSet);
    if (!profile) throw new Error(`No tone profile for ${spec.pickupSet}`);

    return profile;
  }
}
