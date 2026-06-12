import { GroceryCommand } from "./GroceryCommand";

export class CommandHistory {
  private readonly done: GroceryCommand[];
  private readonly undone: GroceryCommand[];

  constructor() {
    this.done = [];
    this.undone = [];
  }

  do(command: GroceryCommand): void {
    command.execute();
    this.done.push(command);
    this.undone.length = 0;
  }

  undo(): string {
    const command = this.done.pop();

    if (!command) {
      throw new Error("There is no operation to undo");
    }

    command.undo();
    this.undone.push(command);
    return command.describe();
  }

  redo(): string {
    const command = this.undone.pop();

    if (!command) {
      throw new Error("There is no operation to redo");
    }

    command.execute();
    this.done.push(command);
    return command.describe();
  }

  doneCount(): number {
    return this.done.length;
  }

  redoCount(): number {
    return this.undone.length;
  }
}
