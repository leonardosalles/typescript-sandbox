import { GuitarSpec } from "../GuitarSpec";
import {
  GuitarFamily,
  GuitarSpecInput,
  OperatingSystem,
  PickupSet,
} from "../GuitarTypes";
import { CustomShopFactory } from "./CustomShopFactory";

export class AcousticGuitarFactory extends CustomShopFactory {
  readonly family = GuitarFamily.Acoustic;

  protected normalize(spec: GuitarSpec): GuitarSpec {
    const patch: Partial<GuitarSpecInput> = {
      pickupSet: PickupSet.Piezo,
      operatingSystem:
        spec.operatingSystem === OperatingSystem.StudioLink
          ? OperatingSystem.SmartStage
          : spec.operatingSystem,
    };

    return spec.with(patch);
  }
}
