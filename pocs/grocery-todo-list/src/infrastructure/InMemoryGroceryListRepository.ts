import { GroceryList } from "../domain/GroceryList";
import { GroceryListRepository } from "../domain/repositories/GroceryListRepository";
import { GroceryListId } from "../domain/value-objects/GroceryListId";

export class InMemoryGroceryListRepository implements GroceryListRepository {
  private readonly lists: GroceryList[];

  constructor(initialLists: GroceryList[] = []) {
    this.lists = [...initialLists];
  }

  findById(id: GroceryListId): GroceryList | undefined {
    return this.lists.find((list) => list.id.equals(id));
  }

  save(list: GroceryList): void {
    const index = this.lists.findIndex((candidate) =>
      candidate.id.equals(list.id),
    );

    if (index >= 0) {
      this.lists[index] = list;
      return;
    }

    this.lists.push(list);
  }
}
