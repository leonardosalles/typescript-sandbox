import { SaleChannel } from "./TicketTypes";
import { Ticket } from "./Ticket";
import { Money } from "./value-objects/Money";

export class TicketOrder {
  readonly id: string;
  readonly customerName: string;
  readonly channel: SaleChannel;
  readonly tickets: Ticket[];
  readonly createdAt: Date;

  constructor(
    id: string,
    customerName: string,
    channel: SaleChannel,
    tickets: Ticket[],
    createdAt: Date,
  ) {
    if (id.trim().length === 0) {
      throw new Error("Order id is required");
    }

    if (customerName.trim().length === 0) {
      throw new Error("Customer name is required");
    }

    if (tickets.length === 0) {
      throw new Error("Order must have at least one ticket");
    }

    this.id = id;
    this.customerName = customerName.trim();
    this.channel = channel;
    this.tickets = [...tickets];
    this.createdAt = new Date(createdAt);
  }

  total(): Money {
    return this.tickets.reduce(
      (total, ticket) => total.plus(ticket.price),
      new Money(0),
    );
  }
}
