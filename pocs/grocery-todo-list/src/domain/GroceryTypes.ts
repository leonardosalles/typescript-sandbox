export enum GroceryCategory {
  Produce = "produce",
  Bakery = "bakery",
  Dairy = "dairy",
  Meat = "meat",
  Pantry = "pantry",
  Frozen = "frozen",
  Household = "household",
  Other = "other",
}

export enum GroceryItemStatus {
  Pending = "pending",
  Done = "done",
  Removed = "removed",
}

export type GroceryItemSnapshot = {
  readonly id: string;
  readonly name: string;
  readonly category: GroceryCategory;
  readonly quantity: string;
  readonly status: GroceryItemStatus;
  readonly addedAt: Date;
  readonly completedAt?: Date;
  readonly removedAt?: Date;
};
