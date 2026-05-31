import { GuitarFactorySystem } from "./GuitarFactorySystem";
import { ProductionLineEvents } from "../domain/events/ProductionEvent";
import {
  AcousticGuitarFactory,
  BassGuitarFactory,
  ElectricGuitarFactory,
} from "../domain/factories";
import { ComponentPricingStrategy } from "../domain/strategies/PricingStrategy";
import { SequentialSerialNumberIssuer } from "../domain/value-objects/SerialNumber";
import { FactoryCatalog } from "../infrastructure/FactoryCatalog";
import { InMemoryInventory } from "../infrastructure/InMemoryInventory";

export function createGuitarFactorySystem(events = new ProductionLineEvents()) {
  const pricing = new ComponentPricingStrategy();
  const serials = new SequentialSerialNumberIssuer();
  const catalog = new FactoryCatalog([
    new ElectricGuitarFactory(pricing, serials),
    new AcousticGuitarFactory(pricing, serials),
    new BassGuitarFactory(pricing, serials),
  ]);
  const inventory = new InMemoryInventory();

  return {
    system: new GuitarFactorySystem(catalog, inventory, events),
    inventory,
    events,
  };
}
