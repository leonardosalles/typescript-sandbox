import { GuitarBuilder } from "../GuitarBuilder";
import { GuitarSpec } from "../GuitarSpec";
import { GuitarFamily } from "../GuitarTypes";
import { PricingStrategy } from "../strategies/PricingStrategy";
import { SerialNumberIssuer } from "../value-objects/SerialNumber";
import { GuitarFactory } from "./GuitarFactory";

export abstract class CustomShopFactory implements GuitarFactory {
  abstract readonly family: GuitarFamily;

  constructor(
    private readonly pricing: PricingStrategy,
    private readonly serials: SerialNumberIssuer,
  ) {}

  canCreate(spec: GuitarSpec): boolean {
    return spec.family === this.family;
  }

  builderFor(spec: GuitarSpec): GuitarBuilder {
    if (!this.canCreate(spec)) {
      throw new Error(`${this.family} factory cannot build ${spec.family}`);
    }

    return new GuitarBuilder(
      this.normalize(spec),
      this.serials.issue(this.family),
      this.pricing.price(spec),
    );
  }

  protected normalize(spec: GuitarSpec): GuitarSpec {
    return spec;
  }
}
