import { GroceryList } from "../GroceryList";
import { GroceryItemStatus } from "../GroceryTypes";
import { GroceryItemId } from "../value-objects/GroceryItemId";
import { GroceryCommand } from "./GroceryCommand";

export class RemoveItemCommand implements GroceryCommand {
  private readonly list: GroceryList;
  private readonly itemId: GroceryItemId;
  private readonly removedAt: Date;
  private previousStatus?: GroceryItemStatus;
  private previousCompletedAt?: Date;

  constructor(list: GroceryList, itemId: GroceryItemId, removedAt: Date) {
    this.list = list;
    this.itemId = itemId;
    this.removedAt = new Date(removedAt);
  }

  execute(): void {
    const previous = this.list.remove(this.itemId, this.removedAt);
    this.previousStatus = previous.status;
    this.previousCompletedAt = previous.completedAt;
  }

  undo(): void {
    if (!this.previousStatus) {
      throw new Error("Cannot undo remove before executing it");
    }

    this.list.restoreRemoved(
      this.itemId,
      this.previousStatus,
      this.previousCompletedAt,
    );
  }

  describe(): string {
    return `Remove ${this.itemId.asString()}`;
  }
}
