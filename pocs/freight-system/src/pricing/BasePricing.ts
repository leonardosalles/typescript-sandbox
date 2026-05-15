import { CargoType, ServiceLevel } from "../domain/FreightTypes";
import { Money } from "../domain/Money";
import { Shipment } from "../domain/Shipment";

export function volumeDistanceCost(
  shipment: Shipment,
  dollarsPerCubicMeterKm: number,
): Money {
  return Money.dollars(
    shipment.volume.asCubicMeters() *
      shipment.distance.asKilometers() *
      dollarsPerCubicMeterKm,
  );
}

export function weightDistanceCost(
  shipment: Shipment,
  dollarsPerTonKm: number,
): Money {
  const tons = shipment.weight.asKilograms() / 1000;
  return Money.dollars(
    tons * shipment.distance.asKilometers() * dollarsPerTonKm,
  );
}

export function serviceMultiplier(serviceLevel: ServiceLevel): number {
  if (serviceLevel === ServiceLevel.Express) return 1.45;
  if (serviceLevel === ServiceLevel.Standard) return 1.15;
  return 1;
}

export function handlingFee(shipment: Shipment): Money {
  if (shipment.cargoType === CargoType.Hazardous) return Money.dollars(380);
  if (shipment.cargoType === CargoType.Refrigerated) return Money.dollars(260);
  if (shipment.cargoType === CargoType.Fragile) return Money.dollars(140);
  return Money.dollars(80);
}
