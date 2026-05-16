import { CargoType, TransportMode } from "../domain/FreightTypes";
import { Money } from "../domain/Money";
import { QuoteBreakdown, FreightQuote } from "../domain/Quote";
import { Shipment } from "../domain/Shipment";
import { MarketSnapshot } from "../market/DynamicFreightMarket";
import {
  handlingFee,
  serviceMultiplier,
  volumeDistanceCost,
  weightDistanceCost,
} from "./BasePricing";
import { FreightPricingStrategy } from "./FreightPricingStrategy";

export class TruckPricing implements FreightPricingStrategy {
  readonly name = "RoadRunner Trucking";

  canPrice(shipment: Shipment): boolean {
    return (
      shipment.distance.asKilometers() <= 2500 &&
      shipment.volume.asCubicMeters() <= 85
    );
  }

  quote(shipment: Shipment, market: MarketSnapshot): FreightQuote {
    const breakdown = new QuoteBreakdown();
    const warnings: string[] = [];
    const volumeCost = volumeDistanceCost(shipment, 0.042);
    const weightCost = weightDistanceCost(shipment, 0.19);
    const base = volumeCost.max(weightCost);
    const dynamic = base.multiply(
      market.multiplierFor(TransportMode.Truck, shipment.cargoType),
    );
    const service = dynamic.multiply(
      serviceMultiplier(shipment.serviceLevel) - 1,
    );
    const handling = handlingFee(shipment);

    breakdown.add("road movement after market", dynamic);
    breakdown.add("service level surcharge", service);
    breakdown.add("handling", handling);

    if (shipment.cargoType === CargoType.Hazardous) {
      breakdown.add("hazmat road permit", Money.dollars(220));
    }

    if (shipment.isBulky()) {
      warnings.push("truck capacity is sensitive to bulky shipments");
    }

    return new FreightQuote(
      TransportMode.Truck,
      this.name,
      breakdown,
      3,
      warnings,
    );
  }
}
