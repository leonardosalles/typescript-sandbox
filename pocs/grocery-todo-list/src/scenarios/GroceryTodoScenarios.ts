import { FixedClock } from "../application/Clock";
import { SequentialGroceryItemIdGenerator } from "../application/GroceryItemIdGenerator";
import { GroceryTodoService } from "../application/GroceryTodoService";
import { CommandHistory } from "../domain/commands/CommandHistory";
import { GroceryCategory } from "../domain/GroceryTypes";
import { weeklyGroceries } from "../fixtures/GroceryFixtures";
import { InMemoryGroceryListRepository } from "../infrastructure/InMemoryGroceryListRepository";

export class GroceryTodoScenarios {
  run(): void {
    const repository = new InMemoryGroceryListRepository([weeklyGroceries()]);
    const service = new GroceryTodoService(
      repository,
      new SequentialGroceryItemIdGenerator("GROCERY"),
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

    service.markAsDone({ listId: "LIST-WEEKLY", itemId: milk.id });
    service.removeItem({ listId: "LIST-WEEKLY", itemId: apples.id });

    console.log("After add, done, remove");
    console.table(service.listAll("LIST-WEEKLY", true));

    console.log(`Undo: ${service.undo()}`);
    console.log(`Undo: ${service.undo()}`);
    console.table(service.listAll("LIST-WEEKLY", true));

    console.log(`Redo: ${service.redo()}`);
    console.table(service.listAll("LIST-WEEKLY", true));
  }
}
