import { GuitarSpec } from "../GuitarSpec";
import { BodyShape, GuitarFamily } from "../GuitarTypes";
import { CustomShopFactory } from "./CustomShopFactory";

export class BassGuitarFactory extends CustomShopFactory {
  readonly family = GuitarFamily.Bass;

  protected normalize(spec: GuitarSpec): GuitarSpec {
    return spec.bodyShape === BodyShape.JazzBass
      ? spec
      : spec.with({ bodyShape: BodyShape.JazzBass });
  }
}
