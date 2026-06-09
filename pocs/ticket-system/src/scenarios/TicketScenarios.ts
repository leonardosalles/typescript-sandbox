import { FixedClock } from "../application/Clock";
import { SequentialOrderIdGenerator } from "../application/OrderIdGenerator";
import { TicketSeller } from "../application/TicketSeller";
import { MaximumCapacityPolicy } from "../domain/policies/MaximumCapacityPolicy";
import { SaleChannel } from "../domain/TicketTypes";
import { rockFestival, jazzNight } from "../fixtures/TicketFixtures";
import { InMemoryShowRepository } from "../infrastructure/InMemoryShowRepository";

export class TicketScenarios {
  run(): void {
    const repository = new InMemoryShowRepository([
      rockFestival(),
      jazzNight(),
    ]);
    const seller = new TicketSeller(
      repository,
      new MaximumCapacityPolicy(),
      new SequentialOrderIdGenerator("POC"),
      new FixedClock(new Date("2026-06-09T12:00:00.000Z")),
    );

    const vipOrder = seller.sell({
      showId: "SHOW-ROCK-2026",
      customerName: "Leonardo Salles",
      channel: SaleChannel.Online,
      seats: [
        { zone: "VIP", seatNumber: "A1" },
        { zone: "VIP", seatNumber: "A2" },
      ],
    });

    console.log(
      `Order ${vipOrder.id}: ${vipOrder.tickets.length} tickets, ${vipOrder.total().format()}`,
    );

    const mixedOrder = seller.sell({
      showId: "SHOW-JAZZ-2026",
      customerName: "Grace Hopper",
      channel: SaleChannel.BoxOffice,
      seats: [
        { zone: "TABLE", seatNumber: "D3" },
        { zone: "MEZZANINE", seatNumber: "E2" },
      ],
    });

    console.log(
      `Order ${mixedOrder.id}: ${mixedOrder.tickets.map((ticket) => ticket.seatLabel).join(", ")}`,
    );

    for (const show of repository.all()) {
      console.log(show.title);
      console.table(show.capacitySnapshots());
    }
  }
}
