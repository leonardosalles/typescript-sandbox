export enum CargoType {
  General = "GENERAL",
  Fragile = "FRAGILE",
  Refrigerated = "REFRIGERATED",
  Hazardous = "HAZARDOUS",
}

export enum TransportMode {
  Truck = "TRUCK",
  Rail = "RAIL",
  Boat = "BOAT",
}

export enum ServiceLevel {
  Economy = "ECONOMY",
  Standard = "STANDARD",
  Express = "EXPRESS",
}

export class Lane {
  constructor(
    readonly origin: string,
    readonly destination: string,
  ) {
    if (!origin.trim()) throw new Error("Origin is required");
    if (!destination.trim()) throw new Error("Destination is required");
    if (origin === destination)
      throw new Error("Origin and destination differ");
  }

  label(): string {
    return `${this.origin} -> ${this.destination}`;
  }
}
