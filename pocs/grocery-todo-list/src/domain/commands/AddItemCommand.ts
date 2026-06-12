import { GroceryItem } from "../GroceryItem";
import { GroceryList } from "../GroceryList";
import { GroceryItemStatus } from "../GroceryTypes";
import { GroceryCommand } from "./GroceryCommand";

export class AddItemCommand implements GroceryCommand {
  private readonly list: GroceryList;
  private readonly item: GroceryItem;
  private executedBefore: boolean;

  constructor(list: GroceryList, item: GroceryItem) {
    this.list = list;
    this.item = item;
    this.executedBefore = false;
  }

  execute(): void {
    if (this.executedBefore) {
      this.list.restoreRemoved(this.item.id, GroceryItemStatus.Pending);
      return;
    }

    this.list.add(this.item);
    this.executedBefore = true;
  }

  undo(): void {
    this.list.remove(this.item.id, new Date());
  }

  describe(): string {
    return `Add ${this.item.name.asString()}`;
  }
}
