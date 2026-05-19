import { FreightQuote } from "../domain/Quote";
import { Shipment } from "../domain/Shipment";
import { FreightMarket } from "../market/DynamicFreightMarket";
import { FreightPricingStrategy } from "../pricing/FreightPricingStrategy";

export class FreightQuoteService {
  constructor(
    private readonly strategies: FreightPricingStrategy[],
    private readonly market: FreightMarket,
  ) {}

  quoteAll(shipment: Shipment): FreightQuote[] {
    const snapshot = this.market.current();

    return this.strategies
      .filter((strategy) => strategy.canPrice(shipment))
      .map((strategy) => strategy.quote(shipment, snapshot))
      .sort((left, right) => left.total().asCents() - right.total().asCents());
  }

  cheapest(shipment: Shipment): FreightQuote {
    const quotes = this.quoteAll(shipment);
    const cheapest = quotes[0];

    if (!cheapest) {
      throw new Error(`No carrier can price shipment ${shipment.id}`);
    }

    return cheapest;
  }
}
