import { CargoType, Lane, ServiceLevel } from "./FreightTypes";
import { Distance, Volume, Weight } from "./measurements";

export class Shipment {
  constructor(
    readonly id: string,
    readonly lane: Lane,
    readonly distance: Distance,
    readonly volume: Volume,
    readonly weight: Weight,
    readonly cargoType: CargoType,
    readonly serviceLevel: ServiceLevel,
  ) {
    if (!id.trim()) throw new Error("Shipment id is required");
  }

  densityKgPerCubicMeter(): number {
    return this.weight.asKilograms() / this.volume.asCubicMeters();
  }

  isBulky(): boolean {
    return this.volume.isAtLeast(20);
  }
}
