import { FreightQuoteService } from "./calculator/FreightQuoteService";
import {
  sampleShipments,
  calmMarket,
  hotMarket,
} from "./fixtures/FreightFixtures";
import { ScenarioFreightMarket } from "./market/DynamicFreightMarket";
import { BoatPricing } from "./pricing/BoatPricing";
import { RailPricing } from "./pricing/RailPricing";
import { TruckPricing } from "./pricing/TruckPricing";
import { runShipmentScenario } from "./scenarios/Scenarios";

const market = new ScenarioFreightMarket([calmMarket(), hotMarket()]);
const service = new FreightQuoteService(
  [new TruckPricing(), new RailPricing(), new BoatPricing()],
  market,
);

console.log("============================================================");
console.log("FREIGHT SYSTEM - POC");
console.log("Dynamic freight prices by volume, cargo type and transport mode");
console.log("============================================================");

for (const shipment of sampleShipments()) {
  runShipmentScenario(service, shipment);
}
