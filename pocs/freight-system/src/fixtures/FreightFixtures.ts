import { CargoType, Lane, ServiceLevel } from "../domain/FreightTypes";
import { Distance, Volume, Weight } from "../domain/measurements";
import { Shipment } from "../domain/Shipment";
import { MarketSnapshot } from "../market/DynamicFreightMarket";

export function calmMarket(): MarketSnapshot {
  return new MarketSnapshot(
    1.04,
    1.08,
    0.94,
    1.02,
    new Map([
      [CargoType.General, 1],
      [CargoType.Fragile, 1.12],
      [CargoType.Refrigerated, 1.2],
      [CargoType.Hazardous, 1.38],
    ]),
  );
}

export function hotMarket(): MarketSnapshot {
  return new MarketSnapshot(
    1.22,
    1.45,
    1.16,
    1.31,
    new Map([
      [CargoType.General, 1],
      [CargoType.Fragile, 1.15],
      [CargoType.Refrigerated, 1.28],
      [CargoType.Hazardous, 1.52],
    ]),
  );
}

export function sampleShipments(): Shipment[] {
  return [
    new Shipment(
      "S-100",
      new Lane("Chicago", "Dallas"),
      Distance.kilometers(1500),
      Volume.cubicMeters(18),
      Weight.kilograms(6200),
      CargoType.General,
      ServiceLevel.Standard,
    ),
    new Shipment(
      "S-200",
      new Lane("Seattle", "Miami"),
      Distance.kilometers(5300),
      Volume.cubicMeters(36),
      Weight.kilograms(12000),
      CargoType.Refrigerated,
      ServiceLevel.Economy,
    ),
    new Shipment(
      "S-300",
      new Lane("Newark", "Atlanta"),
      Distance.kilometers(1370),
      Volume.fromBox(3, 2, 2),
      Weight.kilograms(900),
      CargoType.Fragile,
      ServiceLevel.Express,
    ),
    new Shipment(
      "S-400",
      new Lane("Houston", "Los Angeles"),
      Distance.kilometers(2480),
      Volume.cubicMeters(26),
      Weight.kilograms(18000),
      CargoType.Hazardous,
      ServiceLevel.Standard,
    ),
  ];
}
