import { GuitarSpec } from "../GuitarSpec";
import { GuitarFamily } from "../GuitarTypes";
import { GuitarBuilder } from "../GuitarBuilder";

export interface GuitarFactory {
  readonly family: GuitarFamily;
  canCreate(spec: GuitarSpec): boolean;
  builderFor(spec: GuitarSpec): GuitarBuilder;
}
