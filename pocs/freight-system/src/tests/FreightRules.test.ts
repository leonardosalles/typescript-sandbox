import { FreightQuoteService } from "../calculator/FreightQuoteService";
import {
  CargoType,
  Lane,
  ServiceLevel,
  TransportMode,
} from "../domain/FreightTypes";
import { Distance, Volume, Weight } from "../domain/measurements";
import { Shipment } from "../domain/Shipment";
import { calmMarket, hotMarket } from "../fixtures/FreightFixtures";
import { FixedFreightMarket } from "../market/DynamicFreightMarket";
import { BoatPricing } from "../pricing/BoatPricing";
import { RailPricing } from "../pricing/RailPricing";
import { TruckPricing } from "../pricing/TruckPricing";

const strategies = [new TruckPricing(), new RailPricing(), new BoatPricing()];

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`Expected ${String(expected)}, got ${String(actual)}`);
  }
}

function assertOk(value: boolean, message: string): void {
  if (!value) throw new Error(message);
}

function assertThrows(action: () => void, expectedMessage: RegExp): void {
  try {
    action();
  } catch (error) {
    if (error instanceof Error && expectedMessage.test(error.message)) return;
    throw error;
  }

  throw new Error(`Expected error matching ${expectedMessage}`);
}

const longGeneralShipment = new Shipment(
  "T-1",
  new Lane("Seattle", "Miami"),
  Distance.kilometers(5300),
  Volume.cubicMeters(35),
  Weight.kilograms(11000),
  CargoType.General,
  ServiceLevel.Economy,
);

const fragileShipment = new Shipment(
  "T-2",
  new Lane("Newark", "Atlanta"),
  Distance.kilometers(1370),
  Volume.cubicMeters(10),
  Weight.kilograms(1200),
  CargoType.Fragile,
  ServiceLevel.Standard,
);

const calmService = new FreightQuoteService(
  strategies,
  new FixedFreightMarket(calmMarket()),
);
const hotService = new FreightQuoteService(
  strategies,
  new FixedFreightMarket(hotMarket()),
);

const calmQuotes = calmService.quoteAll(longGeneralShipment);
const hotQuotes = hotService.quoteAll(longGeneralShipment);

assertEqual(calmQuotes[0].mode, TransportMode.Boat);
assertOk(
  hotQuotes[0].total().asCents() > calmQuotes[0].total().asCents(),
  "Hot market should cost more than calm market",
);

const fragileQuotes = calmService.quoteAll(fragileShipment);
assertEqual(
  fragileQuotes.some((quote) => quote.mode === TransportMode.Rail),
  false,
);
assertEqual(
  fragileQuotes.some((quote) => quote.mode === TransportMode.Truck),
  true,
);

assertThrows(
  () =>
    new Shipment(
      "",
      new Lane("A", "B"),
      Distance.kilometers(10),
      Volume.cubicMeters(1),
      Weight.kilograms(1),
      CargoType.General,
      ServiceLevel.Economy,
    ),
  /Shipment id is required/,
);

console.log("Freight rule tests passed");
