import { FixedClock } from "../application/Clock";
import { SequentialOrderIdGenerator } from "../application/OrderIdGenerator";
import { TicketSeller } from "../application/TicketSeller";
import { HashTable } from "../domain/collections/HashTable";
import {
  Equality,
  HashFunction,
  StringHashFunction,
} from "../domain/collections/HashFunction";
import { MaximumCapacityPolicy } from "../domain/policies/MaximumCapacityPolicy";
import { SaleChannel } from "../domain/TicketTypes";
import { rockFestival } from "../fixtures/TicketFixtures";
import { InMemoryShowRepository } from "../infrastructure/InMemoryShowRepository";

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`Expected ${String(expected)}, got ${String(actual)}`);
  }
}

function assertOk(value: boolean, message: string): void {
  if (!value) {
    throw new Error(message);
  }
}

function assertThrows(action: () => void, expectedMessage: RegExp): void {
  try {
    action();
  } catch (error) {
    if (error instanceof Error && expectedMessage.test(error.message)) {
      return;
    }

    throw error;
  }

  throw new Error(`Expected error matching ${expectedMessage}`);
}

class ConstantHash implements HashFunction<string>, Equality<string> {
  hash(): number {
    return 1;
  }

  equals(left: string, right: string): boolean {
    return left === right;
  }
}

const repository = new InMemoryShowRepository([rockFestival()]);
const seller = new TicketSeller(
  repository,
  new MaximumCapacityPolicy(),
  new SequentialOrderIdGenerator("TEST"),
  new FixedClock(new Date("2026-06-09T12:00:00.000Z")),
);

const vipOrder = seller.sell({
  showId: "SHOW-ROCK-2026",
  customerName: "Kent Beck",
  channel: SaleChannel.Online,
  seats: [
    { zone: "VIP", seatNumber: "A1" },
    { zone: "VIP", seatNumber: "A2" },
  ],
});

assertEqual(vipOrder.id, "TEST-0001");
assertEqual(vipOrder.tickets.length, 2);
assertEqual(vipOrder.total().asCents(), 50000);
assertEqual(vipOrder.tickets[0].seatLabel, "VIP-A1");

const show = repository.findById(vipOrder.tickets[0].showId);
assertOk(Boolean(show), "Sold show should still be in the repository");
assertEqual(
  show?.capacitySnapshots().find((snapshot) => snapshot.zone === "VIP")
    ?.available,
  3,
);

assertThrows(
  () =>
    seller.sell({
      showId: "SHOW-ROCK-2026",
      customerName: "Barbara Liskov",
      channel: SaleChannel.Partner,
      seats: [{ zone: "VIP", seatNumber: "A1" }],
    }),
  /not available/,
);

assertThrows(
  () =>
    seller.sell({
      showId: "SHOW-ROCK-2026",
      customerName: "Martin Fowler",
      channel: SaleChannel.BoxOffice,
      seats: [
        { zone: "FLOOR", seatNumber: "B1" },
        { zone: "FLOOR", seatNumber: "B1" },
      ],
    }),
  /Duplicated selection/,
);

assertThrows(
  () =>
    seller.sell({
      showId: "SHOW-ROCK-2026",
      customerName: "Rebecca Wirfs-Brock",
      channel: SaleChannel.Online,
      seats: [{ zone: "BALCONY", seatNumber: "C99" }],
    }),
  /does not exist/,
);

assertThrows(
  () =>
    seller.sell({
      showId: "UNKNOWN",
      customerName: "Ivar Jacobson",
      channel: SaleChannel.Online,
      seats: [{ zone: "VIP", seatNumber: "A3" }],
    }),
  /was not found/,
);

const collisionTable = new HashTable<string, number>(
  new ConstantHash(),
  new ConstantHash(),
  2,
);
collisionTable.set("A", 1);
collisionTable.set("B", 2);
collisionTable.set("C", 3);
collisionTable.set("A", 10);

assertEqual(collisionTable.get("A"), 10);
assertEqual(collisionTable.get("B"), 2);
assertEqual(collisionTable.get("C"), 3);
assertEqual(collisionTable.size(), 3);

const resizeTable = new HashTable<string, number>(
  new StringHashFunction(),
  new StringHashFunction(),
  3,
);

for (let index = 0; index < 20; index += 1) {
  resizeTable.set(`seat-${index}`, index);
}

assertEqual(resizeTable.get("seat-19"), 19);
assertOk(
  resizeTable.loadFactor() < 0.75,
  "HashTable should resize before it becomes crowded",
);

console.log("Ticket rule tests passed");
