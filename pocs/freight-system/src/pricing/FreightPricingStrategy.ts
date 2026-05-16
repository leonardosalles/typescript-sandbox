import { FreightQuote } from "../domain/Quote";
import { Shipment } from "../domain/Shipment";
import { MarketSnapshot } from "../market/DynamicFreightMarket";

export interface FreightPricingStrategy {
  readonly name: string;
  canPrice(shipment: Shipment): boolean;
  quote(shipment: Shipment, market: MarketSnapshot): FreightQuote;
}
