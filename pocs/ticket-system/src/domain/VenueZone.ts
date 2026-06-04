import { Money } from "./value-objects/Money";
import { ZoneName } from "./value-objects/ZoneName";

export class VenueZone {
  readonly name: ZoneName;
  readonly capacity: number;
  readonly price: Money;

  constructor(name: ZoneName, capacity: number, price: Money) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error("Zone capacity must be a positive integer");
    }

    this.name = name;
    this.capacity = capacity;
    this.price = price;
  }
}
