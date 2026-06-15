import { GroceryCategory } from "../domain/GroceryTypes";

export type AddGroceryItemRequest = {
  readonly listId: string;
  readonly name: string;
  readonly category: GroceryCategory;
  readonly quantityAmount: number;
  readonly quantityUnit: string;
};

export type ItemActionRequest = {
  readonly listId: string;
  readonly itemId: string;
};
