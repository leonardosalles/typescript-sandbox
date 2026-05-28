import { GuitarSpec } from "./GuitarSpec";
import {
  BodyShape,
  Finish,
  GuitarFamily,
  OperatingSystem,
  PickupSet,
  ToneWood,
} from "./GuitarTypes";

export function defaultElectricSpec(): GuitarSpec {
  return new GuitarSpec({
    family: GuitarFamily.Electric,
    model: "Aurora Custom",
    bodyShape: BodyShape.Strat,
    toneWood: ToneWood.Alder,
    pickupSet: PickupSet.SingleCoil,
    finish: Finish.Sunburst,
    operatingSystem: OperatingSystem.StudioLink,
    strings: 6,
    leftHanded: false,
  });
}
