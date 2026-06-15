import { AddItemCommand } from "../domain/commands/AddItemCommand";
import { CommandHistory } from "../domain/commands/CommandHistory";
import { MarkDoneCommand } from "../domain/commands/MarkDoneCommand";
import { RemoveItemCommand } from "../domain/commands/RemoveItemCommand";
import { GroceryItem } from "../domain/GroceryItem";
import { GroceryList } from "../domain/GroceryList";
import { GroceryItemSnapshot } from "../domain/GroceryTypes";
import { GroceryListRepository } from "../domain/repositories/GroceryListRepository";
import { GroceryItemId } from "../domain/value-objects/GroceryItemId";
import { GroceryListId } from "../domain/value-objects/GroceryListId";
import { ProductName } from "../domain/value-objects/ProductName";
import { Quantity } from "../domain/value-objects/Quantity";
import { Clock } from "./Clock";
import { GroceryItemIdGenerator } from "./GroceryItemIdGenerator";
import {
  AddGroceryItemRequest,
  ItemActionRequest,
} from "./GroceryTodoRequests";

export class GroceryTodoService {
  private readonly lists: GroceryListRepository;
  private readonly itemIds: GroceryItemIdGenerator;
  private readonly clock: Clock;
  private readonly history: CommandHistory;

  constructor(
    lists: GroceryListRepository,
    itemIds: GroceryItemIdGenerator,
    clock: Clock,
    history: CommandHistory,
  ) {
    this.lists = lists;
    this.itemIds = itemIds;
    this.clock = clock;
    this.history = history;
  }

  addItem(request: AddGroceryItemRequest): GroceryItemSnapshot {
    const list = this.requireList(request.listId);
    const item = new GroceryItem(
      new GroceryItemId(this.itemIds.next()),
      new ProductName(request.name),
      request.category,
      new Quantity(request.quantityAmount, request.quantityUnit),
      this.clock.now(),
    );

    this.history.do(new AddItemCommand(list, item));
    this.lists.save(list);
    return item.snapshot();
  }

  removeItem(request: ItemActionRequest): string {
    const list = this.requireList(request.listId);
    const itemId = new GroceryItemId(request.itemId);
    this.history.do(new RemoveItemCommand(list, itemId, this.clock.now()));
    this.lists.save(list);
    return itemId.asString();
  }

  markAsDone(request: ItemActionRequest): string {
    const list = this.requireList(request.listId);
    const itemId = new GroceryItemId(request.itemId);
    this.history.do(new MarkDoneCommand(list, itemId, this.clock.now()));
    this.lists.save(list);
    return itemId.asString();
  }

  undo(): string {
    return this.history.undo();
  }

  redo(): string {
    return this.history.redo();
  }

  listAll(listId: string, includeRemoved = false): GroceryItemSnapshot[] {
    return this.requireList(listId).listAll(includeRemoved);
  }

  historySnapshot(): { readonly done: number; readonly redo: number } {
    return {
      done: this.history.doneCount(),
      redo: this.history.redoCount(),
    };
  }

  private requireList(listId: string): GroceryList {
    const id = new GroceryListId(listId);
    const list = this.lists.findById(id);

    if (!list) {
      throw new Error(`Grocery list ${id.asString()} was not found`);
    }

    return list;
  }
}
