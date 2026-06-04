import { SeatInventory } from "./SeatInventory";
import { SeatSelection } from "./SeatSelection";
import { Seat } from "./Seat";
import { CapacitySnapshot, SeatSnapshot } from "./TicketTypes";
import { Money } from "./value-objects/Money";
import { ShowId } from "./value-objects/ShowId";

export class Show {
  readonly id: ShowId;
  readonly title: string;
  readonly startsAt: Date;
  private readonly inventory: SeatInventory;

  constructor(
    id: ShowId,
    title: string,
    startsAt: Date,
    inventory: SeatInventory,
  ) {
    const normalizedTitle = title.trim();

    if (normalizedTitle.length === 0) {
      throw new Error("Show title is required");
    }

    if (Number.isNaN(startsAt.getTime())) {
      throw new Error("Show date is invalid");
    }

    this.id = id;
    this.title = normalizedTitle;
    this.startsAt = new Date(startsAt);
    this.inventory = inventory;
  }

  quote(selections: SeatSelection[]): Money {
    this.inventory.assertCanSell(selections);
    return new Money(this.inventory.totalFor(selections));
  }

  priceFor(selection: SeatSelection): Money {
    return new Money(this.inventory.totalFor([selection]));
  }

  sell(selections: SeatSelection[]): Seat[] {
    this.quote(selections);
    return this.inventory.sell(selections);
  }

  capacitySnapshots(): CapacitySnapshot[] {
    return this.inventory.capacitySnapshots();
  }

  seatSnapshots(): SeatSnapshot[] {
    return this.inventory.seatSnapshots();
  }
}
