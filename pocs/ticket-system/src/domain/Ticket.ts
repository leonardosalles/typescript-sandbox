import { Seat } from "./Seat";
import { Money } from "./value-objects/Money";
import { ShowId } from "./value-objects/ShowId";

export class Ticket {
  readonly showId: ShowId;
  readonly showTitle: string;
  readonly seatLabel: string;
  readonly price: Money;

  constructor(showId: ShowId, showTitle: string, seat: Seat, price: Money) {
    this.showId = showId;
    this.showTitle = showTitle;
    this.seatLabel = seat.label();
    this.price = price;
  }
}
