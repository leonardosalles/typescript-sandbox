import { FreightQuoteService } from "../calculator/FreightQuoteService";
import { Shipment } from "../domain/Shipment";

export function runShipmentScenario(
  service: FreightQuoteService,
  shipment: Shipment,
): void {
  console.log(`\n============================================================`);
  console.log(`${shipment.id}: ${shipment.lane.label()}`);
  console.log(
    `${shipment.cargoType} | ${shipment.serviceLevel} | ${shipment.volume.asCubicMeters()} m3 | ${shipment.weight.asKilograms()} kg | ${shipment.distance.asKilometers()} km`,
  );
  console.log(`density: ${shipment.densityKgPerCubicMeter().toFixed(1)} kg/m3`);

  const quotes = service.quoteAll(shipment);

  if (quotes.length === 0) {
    console.log("No available freight option");
    return;
  }

  for (const quote of quotes) {
    quote.print();
  }

  const best = quotes[0];
  console.log(`\nBest option: ${best.carrier} at ${best.total().format()}`);
}
