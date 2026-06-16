import { FixedClock } from "../application/Clock";
import { SequentialGroceryItemIdGenerator } from "../application/GroceryItemIdGenerator";
import { GroceryTodoService } from "../application/GroceryTodoService";
import { CommandHistory } from "../domain/commands/CommandHistory";
import { GroceryCategory, GroceryItemStatus } from "../domain/GroceryTypes";
import { weeklyGroceries } from "../fixtures/GroceryFixtures";
import { InMemoryGroceryListRepository } from "../infrastructure/InMemoryGroceryListRepository";

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

const service = new GroceryTodoService(
  new InMemoryGroceryListRepository([weeklyGroceries()]),
  new SequentialGroceryItemIdGenerator("TEST"),
  new FixedClock(new Date("2026-06-16T12:00:00.000Z")),
  new CommandHistory(),
);

const milk = service.addItem({
  listId: "LIST-WEEKLY",
  name: "Milk",
  category: GroceryCategory.Dairy,
  quantityAmount: 2,
  quantityUnit: "bottles",
});

const apples = service.addItem({
  listId: "LIST-WEEKLY",
  name: "Apples",
  category: GroceryCategory.Produce,
  quantityAmount: 6,
  quantityUnit: "units",
});

assertEqual(milk.id, "TEST-0001");
assertEqual(apples.id, "TEST-0002");
assertEqual(service.listAll("LIST-WEEKLY").length, 2);

assertThrows(
  () =>
    service.addItem({
      listId: "LIST-WEEKLY",
      name: " milk ",
      category: GroceryCategory.Dairy,
      quantityAmount: 1,
      quantityUnit: "carton",
    }),
  /already exists/,
);

service.markAsDone({ listId: "LIST-WEEKLY", itemId: milk.id });

assertEqual(
  service.listAll("LIST-WEEKLY").find((item) => item.id === milk.id)?.status,
  GroceryItemStatus.Done,
);

service.removeItem({ listId: "LIST-WEEKLY", itemId: apples.id });
assertEqual(service.listAll("LIST-WEEKLY").length, 1);
assertEqual(service.listAll("LIST-WEEKLY", true).length, 2);
assertEqual(
  service.listAll("LIST-WEEKLY", true).find((item) => item.id === apples.id)
    ?.status,
  GroceryItemStatus.Removed,
);

assertEqual(service.undo(), `Remove ${apples.id}`);
assertEqual(service.listAll("LIST-WEEKLY").length, 2);

assertEqual(service.undo(), `Mark ${milk.id} as done`);
assertEqual(
  service.listAll("LIST-WEEKLY").find((item) => item.id === milk.id)?.status,
  GroceryItemStatus.Pending,
);

assertEqual(service.redo(), `Mark ${milk.id} as done`);
assertEqual(
  service.listAll("LIST-WEEKLY").find((item) => item.id === milk.id)?.status,
  GroceryItemStatus.Done,
);

assertThrows(
  () =>
    service.markAsDone({
      listId: "LIST-WEEKLY",
      itemId: "UNKNOWN",
    }),
  /was not found/,
);

const emptyHistory = new CommandHistory();
assertThrows(() => emptyHistory.undo(), /no operation to undo/);
assertThrows(() => emptyHistory.redo(), /no operation to redo/);

assertOk(
  service.historySnapshot().done > 0,
  "History should track executed operations",
);

console.log("Grocery todo rule tests passed");
