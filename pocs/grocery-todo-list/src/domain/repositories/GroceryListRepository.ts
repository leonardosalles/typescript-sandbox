import { GroceryList } from "../GroceryList";
import { GroceryListId } from "../value-objects/GroceryListId";

export interface GroceryListRepository {
  findById(id: GroceryListId): GroceryList | undefined;
  save(list: GroceryList): void;
}
