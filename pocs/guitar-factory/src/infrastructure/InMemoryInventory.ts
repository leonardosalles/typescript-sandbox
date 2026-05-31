import { Guitar } from "../domain/Guitar";
import { Specification } from "../domain/specifications/Specification";

export interface Inventory {
  add(guitar: Guitar): void;
  all(): Guitar[];
  matching(specification: Specification<Guitar>): Guitar[];
  count(): number;
}

export class InMemoryInventory implements Inventory {
  private readonly guitars = new Map<string, Guitar>();

  add(guitar: Guitar): void {
    this.guitars.set(guitar.serial.toString(), guitar);
  }

  all(): Guitar[] {
    return [...this.guitars.values()];
  }

  matching(specification: Specification<Guitar>): Guitar[] {
    return this.all().filter((guitar) => specification.isSatisfiedBy(guitar));
  }

  count(): number {
    return this.guitars.size;
  }
}
