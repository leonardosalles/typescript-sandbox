import { GroceryList } from "../domain/GroceryList";
import { GroceryListId } from "../domain/value-objects/GroceryListId";

export function weeklyGroceries(): GroceryList {
  return new GroceryList(new GroceryListId("LIST-WEEKLY"), "Weekly groceries");
}
