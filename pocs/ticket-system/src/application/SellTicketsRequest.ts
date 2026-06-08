import { SaleChannel } from "../domain/TicketTypes";

export type SeatSelectionInput = {
  readonly zone: string;
  readonly seatNumber: string;
};

export type SellTicketsRequest = {
  readonly showId: string;
  readonly customerName: string;
  readonly channel: SaleChannel;
  readonly seats: SeatSelectionInput[];
};
