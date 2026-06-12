import { GroceryList } from "../GroceryList";
import { GroceryItemId } from "../value-objects/GroceryItemId";
import { GroceryCommand } from "./GroceryCommand";

export class MarkDoneCommand implements GroceryCommand {
  private readonly list: GroceryList;
  private readonly itemId: GroceryItemId;
  private readonly completedAt: Date;

  constructor(list: GroceryList, itemId: GroceryItemId, completedAt: Date) {
    this.list = list;
    this.itemId = itemId;
    this.completedAt = new Date(completedAt);
  }

  execute(): void {
    this.list.markDone(this.itemId, this.completedAt);
  }

  undo(): void {
    this.list.markPending(this.itemId);
  }

  describe(): string {
    return `Mark ${this.itemId.asString()} as done`;
  }
}
