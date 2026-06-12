import { GroceryItem } from "./GroceryItem";
import { GroceryItemSnapshot, GroceryItemStatus } from "./GroceryTypes";
import { GroceryItemId } from "./value-objects/GroceryItemId";
import { GroceryListId } from "./value-objects/GroceryListId";

export class GroceryList {
  readonly id: GroceryListId;
  readonly title: string;
  private readonly items: GroceryItem[];

  constructor(id: GroceryListId, title: string, items: GroceryItem[] = []) {
    const normalizedTitle = title.trim();

    if (normalizedTitle.length === 0) {
      throw new Error("Grocery list title is required");
    }

    this.id = id;
    this.title = normalizedTitle;
    this.items = [...items];
  }

  add(item: GroceryItem): void {
    if (this.items.some((existing) => existing.id.equals(item.id))) {
      throw new Error(`Item id ${item.id.asString()} already exists`);
    }

    if (
      this.items.some((existing) =>
        existing.isSameProduct(item.name, item.category),
      )
    ) {
      throw new Error(
        `Product ${item.name.asString()} already exists in ${item.category}`,
      );
    }

    this.items.push(item);
  }

  remove(itemId: GroceryItemId, removedAt: Date): GroceryItemSnapshot {
    const item = this.requireItem(itemId);
    const previous = item.snapshot();
    item.remove(removedAt);
    return previous;
  }

  restoreRemoved(
    itemId: GroceryItemId,
    previousStatus: GroceryItemStatus,
    previousCompletedAt?: Date,
  ): void {
    this.requireItem(itemId).restore(previousStatus, previousCompletedAt);
  }

  markDone(itemId: GroceryItemId, completedAt: Date): GroceryItemSnapshot {
    const item = this.requireItem(itemId);
    const previous = item.snapshot();
    item.markDone(completedAt);
    return previous;
  }

  markPending(itemId: GroceryItemId): void {
    this.requireItem(itemId).markPending();
  }

  listAll(includeRemoved = false): GroceryItemSnapshot[] {
    return this.items
      .filter((item) => includeRemoved || !item.isRemoved())
      .map((item) => item.snapshot())
      .sort((left, right) => left.addedAt.getTime() - right.addedAt.getTime());
  }

  private requireItem(itemId: GroceryItemId): GroceryItem {
    const item = this.items.find((candidate) => candidate.id.equals(itemId));

    if (!item) {
      throw new Error(`Item ${itemId.asString()} was not found`);
    }

    return item;
  }
}
