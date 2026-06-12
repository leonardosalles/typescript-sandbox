export interface GroceryCommand {
  execute(): void;
  undo(): void;
  describe(): string;
}
