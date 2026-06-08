import { CapacityPolicy } from "../domain/policies/CapacityPolicy";
import { ShowRepository } from "../domain/repositories/ShowRepository";
import { SeatSelection } from "../domain/SeatSelection";
import { Ticket } from "../domain/Ticket";
import { TicketOrder } from "../domain/TicketOrder";
import { SeatNumber } from "../domain/value-objects/SeatNumber";
import { ShowId } from "../domain/value-objects/ShowId";
import { ZoneName } from "../domain/value-objects/ZoneName";
import { Clock } from "./Clock";
import { OrderIdGenerator } from "./OrderIdGenerator";
import { SellTicketsRequest } from "./SellTicketsRequest";

export class TicketSeller {
  private readonly shows: ShowRepository;
  private readonly capacityPolicy: CapacityPolicy;
  private readonly orderIds: OrderIdGenerator;
  private readonly clock: Clock;

  constructor(
    shows: ShowRepository,
    capacityPolicy: CapacityPolicy,
    orderIds: OrderIdGenerator,
    clock: Clock,
  ) {
    this.shows = shows;
    this.capacityPolicy = capacityPolicy;
    this.orderIds = orderIds;
    this.clock = clock;
  }

  sell(request: SellTicketsRequest): TicketOrder {
    const showId = new ShowId(request.showId);
    const show = this.shows.findById(showId);

    if (!show) {
      throw new Error(`Show ${showId.asString()} was not found`);
    }

    const selections = request.seats.map(
      (seat) =>
        new SeatSelection(
          new ZoneName(seat.zone),
          new SeatNumber(seat.seatNumber),
        ),
    );
    const prices = selections.map((selection) => show.priceFor(selection));

    this.capacityPolicy.assertAllowed(show, selections);
    const soldSeats = show.sell(selections);
    this.shows.save(show);

    const tickets = soldSeats.map(
      (seat, index) => new Ticket(show.id, show.title, seat, prices[index]),
    );

    return new TicketOrder(
      this.orderIds.next(),
      request.customerName,
      request.channel,
      tickets,
      this.clock.now(),
    );
  }
}
