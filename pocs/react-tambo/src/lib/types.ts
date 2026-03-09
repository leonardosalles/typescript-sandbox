export type SeatStatus =
  | "available"
  | "occupied"
  | "selected"
  | "exit"
  | "business";

export interface Seat {
  id: string;
  row: number;
  col: string;
  status: SeatStatus;
}
