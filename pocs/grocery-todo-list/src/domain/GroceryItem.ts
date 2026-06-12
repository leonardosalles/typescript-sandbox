import {
  GroceryCategory,
  GroceryItemSnapshot,
  GroceryItemStatus,
} from "./GroceryTypes";
import { GroceryItemId } from "./value-objects/GroceryItemId";
import { ProductName } from "./value-objects/ProductName";
import { Quantity } from "./value-objects/Quantity";

export class GroceryItem {
  readonly id: GroceryItemId;
  readonly name: ProductName;
  readonly category: GroceryCategory;
  readonly quantity: Quantity;
  readonly addedAt: Date;
  private status: GroceryItemStatus;
  private completedAt?: Date;
  private removedAt?: Date;

  constructor(
    id: GroceryItemId,
    name: ProductName,
    category: GroceryCategory,
    quantity: Quantity,
    addedAt: Date,
  ) {
    if (Number.isNaN(addedAt.getTime())) {
      throw new Error("Added date is invalid");
    }

    this.id = id;
    this.name = name;
    this.category = category;
    this.quantity = quantity;
    this.addedAt = new Date(addedAt);
    this.status = GroceryItemStatus.Pending;
  }

  markDone(completedAt: Date): void {
    if (this.status === GroceryItemStatus.Removed) {
      throw new Error(`Cannot complete removed item ${this.name.asString()}`);
    }

    if (this.status === GroceryItemStatus.Done) {
      throw new Error(`Item ${this.name.asString()} is already done`);
    }

    this.status = GroceryItemStatus.Done;
    this.completedAt = new Date(completedAt);
  }

  markPending(): void {
    if (this.status === GroceryItemStatus.Removed) {
      throw new Error(`Cannot reopen removed item ${this.name.asString()}`);
    }

    this.status = GroceryItemStatus.Pending;
    this.completedAt = undefined;
  }

  remove(removedAt: Date): void {
    if (this.status === GroceryItemStatus.Removed) {
      throw new Error(`Item ${this.name.asString()} is already removed`);
    }

    this.status = GroceryItemStatus.Removed;
    this.removedAt = new Date(removedAt);
  }

  restore(previousStatus: GroceryItemStatus, previousCompletedAt?: Date): void {
    if (this.status !== GroceryItemStatus.Removed) {
      throw new Error(`Item ${this.name.asString()} is not removed`);
    }

    this.status = previousStatus;
    this.completedAt = previousCompletedAt
      ? new Date(previousCompletedAt)
      : undefined;
    this.removedAt = undefined;
  }

  isRemoved(): boolean {
    return this.status === GroceryItemStatus.Removed;
  }

  isSameProduct(name: ProductName, category: GroceryCategory): boolean {
    return (
      this.name.equals(name) && this.category === category && !this.isRemoved()
    );
  }

  snapshot(): GroceryItemSnapshot {
    return {
      id: this.id.asString(),
      name: this.name.asString(),
      category: this.category,
      quantity: this.quantity.describe(),
      status: this.status,
      addedAt: new Date(this.addedAt),
      completedAt: this.completedAt ? new Date(this.completedAt) : undefined,
      removedAt: this.removedAt ? new Date(this.removedAt) : undefined,
    };
  }
}
