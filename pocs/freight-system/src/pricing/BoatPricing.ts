import { CargoType, ServiceLevel, TransportMode } from "../domain/FreightTypes";
import { Money } from "../domain/Money";
import { FreightQuote, QuoteBreakdown } from "../domain/Quote";
import { Shipment } from "../domain/Shipment";
import { MarketSnapshot } from "../market/DynamicFreightMarket";
import {
  handlingFee,
  serviceMultiplier,
  volumeDistanceCost,
  weightDistanceCost,
} from "./BasePricing";
import { FreightPricingStrategy } from "./FreightPricingStrategy";

export class BoatPricing implements FreightPricingStrategy {
  readonly name = "Salles & Associates Freight";

  canPrice(shipment: Shipment): boolean {
    return (
      shipment.distance.asKilometers() >= 1200 &&
      shipment.serviceLevel !== ServiceLevel.Express
    );
  }

  quote(shipment: Shipment, market: MarketSnapshot): FreightQuote {
    const breakdown = new QuoteBreakdown();
    const warnings: string[] = [];
    const volumeCost = volumeDistanceCost(shipment, 0.011);
    const weightCost = weightDistanceCost(shipment, 0.07);
    const base = volumeCost.max(weightCost);
    const dynamic = base.multiply(
      market.multiplierFor(TransportMode.Boat, shipment.cargoType),
    );
    const service = dynamic.multiply(
      serviceMultiplier(shipment.serviceLevel) - 1,
    );
    const portFee =
      shipment.cargoType === CargoType.Hazardous
        ? Money.dollars(900)
        : Money.dollars(520);

    breakdown.add("ocean movement after market", dynamic);
    breakdown.add("service level surcharge", service);
    breakdown.add("port fee", portFee);
    breakdown.add("handling", handlingFee(shipment));

    if (shipment.cargoType === CargoType.Refrigerated) {
      breakdown.add("reefer container power", Money.dollars(420));
    }

    if (market.portCongestionIndex > 1.3) {
      warnings.push("port congestion is high");
    }

    return new FreightQuote(
      TransportMode.Boat,
      this.name,
      breakdown,
      18,
      warnings,
    );
  }
}
