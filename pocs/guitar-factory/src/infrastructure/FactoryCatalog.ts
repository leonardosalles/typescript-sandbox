import { GuitarSpec } from "../domain/GuitarSpec";
import { GuitarFactory } from "../domain/factories/GuitarFactory";

export class FactoryCatalog {
  constructor(private readonly factories: GuitarFactory[]) {}

  findFor(spec: GuitarSpec): GuitarFactory {
    const factory = this.factories.find((candidate) =>
      candidate.canCreate(spec),
    );

    if (!factory) throw new Error(`No factory can build ${spec.family}`);

    return factory;
  }
}
