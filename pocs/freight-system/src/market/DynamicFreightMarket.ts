import { CargoType, TransportMode } from "../domain/FreightTypes";

export class MarketSnapshot {
  constructor(
    readonly fuelIndex: number,
    readonly portCongestionIndex: number,
    readonly railCapacityIndex: number,
    readonly truckDemandIndex: number,
    readonly cargoRisk: ReadonlyMap<CargoType, number>,
  ) {
    if (fuelIndex <= 0) throw new Error("Fuel index must be positive");
    if (portCongestionIndex <= 0)
      throw new Error("Port index must be positive");
    if (railCapacityIndex <= 0) throw new Error("Rail index must be positive");
    if (truckDemandIndex <= 0) throw new Error("Truck index must be positive");
  }

  multiplierFor(mode: TransportMode, cargoType: CargoType): number {
    const cargoRisk = this.cargoRisk.get(cargoType) ?? 1;

    if (mode === TransportMode.Truck) {
      return this.fuelIndex * this.truckDemandIndex * cargoRisk;
    }

    if (mode === TransportMode.Rail) {
      return this.fuelIndex * this.railCapacityIndex * cargoRisk;
    }

    return this.fuelIndex * this.portCongestionIndex * cargoRisk;
  }
}

export interface FreightMarket {
  current(): MarketSnapshot;
}

export class FixedFreightMarket implements FreightMarket {
  constructor(private readonly snapshot: MarketSnapshot) {}

  current(): MarketSnapshot {
    return this.snapshot;
  }
}

export class ScenarioFreightMarket implements FreightMarket {
  private index = 0;

  constructor(private readonly snapshots: MarketSnapshot[]) {
    if (snapshots.length === 0)
      throw new Error("At least one market snapshot is required");
  }

  current(): MarketSnapshot {
    const snapshot = this.snapshots[this.index];
    this.index = (this.index + 1) % this.snapshots.length;
    return snapshot;
  }
}
