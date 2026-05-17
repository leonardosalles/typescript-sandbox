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

export class RailPricing implements FreightPricingStrategy {
  readonly name = "Continental Rail";

  canPrice(shipment: Shipment): boolean {
    return (
      shipment.distance.asKilometers() >= 600 &&
      shipment.cargoType !== CargoType.Fragile
    );
  }

  quote(shipment: Shipment, market: MarketSnapshot): FreightQuote {
    const breakdown = new QuoteBreakdown();
    const volumeCost = volumeDistanceCost(shipment, 0.018);
    const weightCost = weightDistanceCost(shipment, 0.11);
    const base = volumeCost.max(weightCost);
    const dynamic = base.multiply(
      market.multiplierFor(TransportMode.Rail, shipment.cargoType),
    );
    const service = dynamic.multiply(
      serviceMultiplier(shipment.serviceLevel) - 1,
    );
    const terminalFee =
      shipment.serviceLevel === ServiceLevel.Express
        ? Money.dollars(480)
        : Money.dollars(310);

    breakdown.add("rail movement after market", dynamic);
    breakdown.add("service level surcharge", service);
    breakdown.add("terminal fee", terminalFee);
    breakdown.add("handling", handlingFee(shipment));

    return new FreightQuote(TransportMode.Rail, this.name, breakdown, 7);
  }
}
